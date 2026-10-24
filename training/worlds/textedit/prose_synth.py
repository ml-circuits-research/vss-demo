"""prose_synth.py: synthetic dictated prose of our own (spec 14.6), the NEGATIVE rows of the command threshold: sentences a user dictates as
content, with a deliberate share that uses the editing words in ordinary use ("we should make the first quarter bold in our plans",
"go to the end of the street and turn left"), so that the rate at which content is taken for a command is measured where it is hardest.

Used for local tests and as a second negative set beside the public-domain prose of prose_download.py (DGX). Nothing here comes from others:
the sentences are composed from the grammar below, deterministically from the seed.

Categories (column 2 of the output):
  editing_statement   a statement that contains editing words ("she deleted the old photos before lunch", "the first line of the poem ...")
  editing_imperative  an imperative with an editing verb whose object is not a piece of the text ("replace the batteries in the remote")
  ordinary            prose without editing words
The share of the first two together is --editing_share (default 0.65). Rows are split into calibration and test halves by a hash of the
sentence (stable across sizes). Output: <out>/prose_synth_calibration.tsv and <out>/prose_synth_test.tsv, 'sentence<TAB>category'.
How the rows enter calibration: calibrate.py reads every prose row through the textedit normalizer and the trained reader, exactly as
dictation mode does, and sets the command threshold so that the share of CALIBRATION prose rows that would be executed as commands stays
under the stated target; the TEST rows report the rate of Table 13 ("dictated prose, command threshold": <= 1%).
Run: python3 prose_synth.py --out <world>/raw [--n 2000] [--seed 0] [--editing_share 0.65]"""
import argparse, hashlib, os
import numpy as np

SUBJ = ["we", "I", "she", "he", "they", "our team", "the manager", "my sister", "the board", "everyone", "the editor", "my colleague"]
MODAL = ["should", "will", "could", "must", "might", "would like to", "ought to", "may", "can", "would"]
PERIOD = ["quarter", "month", "week", "year", "half", "season", "phase", "step", "round", "stage"]
ORD = ["first", "second", "third", "last", "next", "previous", "final"]
NUMW = ["two", "three", "four", "five", "ten", "twenty"]
TIMES = ["before lunch", "last night", "this morning", "on monday", "after the meeting", "yesterday", "every friday", "in the spring",
         "by the end of the day", "during the holidays", "at the weekend", "next year"]
PAST_EDIT = [("deleted", "the old photos"), ("removed", "the broken shelf"), ("replaced", "the kitchen tap"), ("selected", "the winning design"),
             ("marked", "the exam papers"), ("highlighted", "the main risks"), ("underlined", "the importance of trust"), ("formatted", "the hard drive"),
             ("moved", "the meeting"), ("changed", "the password"), ("turned", "the page"), ("typed", "a long letter"), ("inserted", "the key"),
             ("cut", "the budget"), ("read", "the whole report"), ("copied", "the recipe"), ("numbered", "the boxes"), ("aligned", "the wheels"),
             ("corrected", "the spelling"), ("added", "more salt"), ("capitalised", "on the trend"), ("chose", "the red dress"), ("swapped", "seats")]
BASE_EDIT = [("delete", "the old files"), ("replace", "the windows"), ("select", "the candidates"), ("move", "the furniture"), ("change", "the schedule"),
             ("read", "the report"), ("number", "the pages"), ("cut", "the costs"), ("highlight", "the risks"), ("format", "the disk"), ("bold", "new ideas"),
             ("make", "the first quarter count"), ("insert", "a clause about holidays"), ("align", "the budget with the plan"), ("undo", "the damage")]
TEXTY_NOUNS = ["line", "word", "sentence", "paragraph", "heading", "title", "list", "page", "chapter", "letter", "note", "card"]
WORKS = ["the poem", "the song", "the speech", "the novel", "the contract", "the article", "her letter", "his email", "the report", "the play"]
ADJ_JUDGE = ["beautiful", "too long", "very moving", "hard to read", "misleading", "perfect", "unclear", "funny", "surprising", "memorable"]
BOLD_NOUNS = ["move", "decision", "plan", "idea", "step", "choice", "claim", "colour", "statement", "design"]
IMPERATIVES = [
    "replace the batteries in the remote", "go to the end of the street and turn left", "make sure the first draft is ready by friday",
    "turn left at the second traffic light", "select the ripest tomatoes for the salad", "number the boxes before you load the truck",
    "cut the onions into thin slices", "add a pinch of salt to the sauce", "delete my old address from the mailing list",
    "read the instructions before you start", "move the chairs to the back of the room", "change the sheets on the guest bed",
    "put the kettle on and sit down", "make a list of everything we need for the trip", "highlight your strengths in the interview",
    "align your goals with the company strategy", "capitalise on the good weather and go outside", "go back to the beginning of the story",
    "mark the date in your calendar", "type your name at the top of the form", "remove your shoes at the door", "insert the card and wait",
    "underline your answer twice", "set the table for six people", "format your answers as short sentences", "jump to the next question if you are stuck",
    "make the bed before breakfast", "make it bold and simple", "bold choices win elections", "read it again slowly", "undo the knot carefully",
    "swap the order of the two songs", "correct me if I am wrong", "choose the last option on the menu", "erase the board after class",
    "promote the new product at the fair", "bullet points make slides boring", "make the last three payments on time", "replace the old roof before winter",
    "delete nothing until the lawyer has seen it", "select a colour for the living room", "turn the music down a little", "center yourself before the race"]
ORDINARY = [
    "the weather was lovely on {day} morning", "our team grew from five to twelve people this year", "{subj} walked along the river for an hour",
    "the train was late again and nobody knew why", "{subj} found a small cafe near the station", "the children laughed at the old film",
    "it rained all afternoon so we stayed inside", "the garden needs a lot of work after the storm", "{subj} called the bank about the loan",
    "the museum opens at ten on weekdays", "dinner was ready by seven and everyone was hungry", "the new office is close to the park",
    "{subj} spent the evening reading by the fire", "the price of coffee went up again", "the dog slept on the sofa all day",
    "we drove to the coast for the long weekend", "the shop on the corner sells fresh bread", "{subj} learned to swim at the age of forty",
    "the hotel room had a view of the mountains", "the concert was cancelled because of the snow", "{subj} met an old friend at the market",
    "the results were better than we expected", "the road to the village was closed for repairs", "the meeting ran over by twenty minutes"]
DAYS = ["monday", "tuesday", "saturday", "sunday"]


def statement(g):
    k = g.integers(9)
    pk = lambda xs: xs[int(g.integers(len(xs)))]
    if k == 0: return f"{pk(SUBJ)} {pk(MODAL)} make the {pk(ORD)} {pk(PERIOD)} {pk(['bold', 'count', 'easier', 'shorter', 'a priority', 'red-letter'])} in our plans"
    if k == 1: v, o = pk(PAST_EDIT); return f"{pk(SUBJ)} {v} {o} {pk(TIMES)}"
    if k == 2: return f"the {pk(ORD)} {pk(TEXTY_NOUNS)} of {pk(WORKS)} was {pk(ADJ_JUDGE)}"
    if k == 3: return f"a bold {pk(BOLD_NOUNS)} can change everything for {pk(['a small company', 'the team', 'a young writer', 'our town'])}"
    if k == 4: return f"the last {pk(NUMW)} {pk(['weeks', 'months', 'years', 'days'])} were {pk(['difficult', 'busy', 'wonderful', 'quiet'])} for {pk(['the team', 'us', 'the family', 'everyone'])}"
    if k == 5: v, o = pk(BASE_EDIT); return f"{pk(SUBJ)} {pk(MODAL)} {v} {o} {pk(TIMES)}"
    if k == 6: return f"{pk(['he', 'she', 'they'])} could not undo what {pk(['he', 'she', 'they'])} said {pk(TIMES)}"
    if k == 7: return f"the {pk(['heading', 'title', 'first line', 'last paragraph', 'next chapter'])} {pk(['explains', 'says', 'hints at', 'describes'])} {pk(['how the system works', 'why prices rose', 'what happened next', 'the whole plan'])}"
    return f"{pk(SUBJ)} made a list of {pk(['things to buy', 'people to invite', 'questions for the doctor', 'places to visit'])} {pk(TIMES)}"


def build(n, seed, editing_share):
    g = np.random.default_rng(seed); out, seen = [], set()
    pk = lambda xs: xs[int(g.integers(len(xs)))]
    tries = 0
    while len(out) < n and tries < 50 * n:
        tries += 1; r = g.random()
        if r < editing_share * 0.7: s, c = statement(g), "editing_statement"
        elif r < editing_share: s, c = pk(IMPERATIVES), "editing_imperative"
        else: s, c = pk(ORDINARY).format(subj=pk(SUBJ), day=pk(DAYS)), "ordinary"
        if g.random() < 0.3 and c != "editing_imperative": s = pk(["and then ", "so ", "but ", "honestly ", "in the end "]) + s
        if c == "editing_imperative" and g.random() < 0.5: s = pk(["please ", "you should ", "remember to ", "first ", "then "]) + s
        s = s[0].upper() + s[1:] + pk([".", ".", "", "!"])
        key = s.lower().rstrip(".!")
        if key in seen: continue
        seen.add(key); out.append((s, c))
    return out


def half(s): return "calibration" if int(hashlib.sha256(s.lower().encode()).hexdigest()[:8], 16) % 2 == 0 else "test"


if __name__ == "__main__":
    ap = argparse.ArgumentParser(); ap.add_argument("--out", required=True); ap.add_argument("--n", type=int, default=2000)
    ap.add_argument("--seed", type=int, default=0); ap.add_argument("--editing_share", type=float, default=0.65)
    a = ap.parse_args(); rows = build(a.n, a.seed, a.editing_share); os.makedirs(a.out, exist_ok=True)
    files = {k: open(os.path.join(a.out, f"prose_synth_{k}.tsv"), "w") for k in ("calibration", "test")}
    for f in files.values(): f.write(f"# sentence\tcategory -- prose_synth.py seed {a.seed}, editing share {a.editing_share}; NEGATIVE rows of the command threshold\n")
    cnt = {}
    for s, c in rows:
        h = half(s); files[h].write(f"{s}\t{c}\n"); cnt[(h, c)] = cnt.get((h, c), 0) + 1
    for f in files.values(): f.close()
    print(f"prose_synth: {len(rows)} sentences -> {a.out}: " + ", ".join(f"{h}/{c} {v}" for (h, c), v in sorted(cnt.items())))
