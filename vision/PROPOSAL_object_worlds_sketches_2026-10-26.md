# Proposal (not started): object worlds for sketches, parts by the classical step, composition by VSS

Status: recorded 2026-10-26 at the owner's request, to be started only after every open row and interface step is closed. Nothing of
it runs before a declaration in STATUS with the R83 / D16 paragraph (what fails, the cause, the change, the number expected to move).

## The idea

A drawn person is a circle above a rectangle with two lines below; a house is a triangle over a square with a small rectangle inside.
That is PARTS (what the classical stroke step already recognises: circles, rectangles, triangles, lines, cylinders) and COMPOSITION
(the parts' relative positions), and composition is what the VSS scene reader does with positions as addresses (specification 17.2,
17.3; the FPE reader met its criterion C1 on 2026-10-26). An OBJECT WORLD is a legend whose questions are parts ("where is the head?",
"where is the body?", "how many limbs?"), trained on examples like the sentence worlds; one world per object class (person, house,
tree, animal, car...). A group of strokes is read by every object world; the dispatcher keeps the world that explains it (residual,
anchor), and refuses when none does ("this looks like nothing I know"): the mixture of independently trained worlds (Paper 8 of the
series) on another modality. The automatic proposal is the preview at Done (D23): the clean object (a template of the class, sized and
placed from the parts) next to the sketch, the person chooses.

## What is new, and the two risks

New: the object worlds, their generator, the dispatcher over them on stroke groups, the preview with object templates. Risks:
(1) the classical step knows six closed kinds and lines; free-hand drawings (a head with ears, a horse) do not decompose into them
cleanly, and the parts step is not the VSS claim; (2) there is no part-annotated data of such sketches.

## The plan to measure it cheaply

1. A generator of objects from primitives with variation (as the sentence generators): positions, sizes, missing parts, extra strokes;
   training and test splits; criteria written before any run (class accuracy, refusal of unknown classes, part positions).
2. The object worlds trained with the FPE reader at D 1024 (capacity 16 elements), one per class; the paired acceptance test for any
   route; the dispatcher's refusal line calibrated on the generator's held-out classes.
3. A real set: Quick, Draw! (Google, millions of sketches as stroke sequences, 345 categories, open licence), a few categories (house,
   person, tree, cat, car), read through the SAME classical step; the number to watch first is how many real drawings the parts step
   decomposes at all (if under half, the parts step is the limit and the plan stops there, stated); a small CNN on the same categories
   as the reference.
4. Only then the preview with object templates in the editor.

## Where it lives when started

training/worlds/objects/ (generator, legends), app/src/sketch/ (the object preview), a declared row in STATUS per step; the papers:
Paper 9 of the series (the contract on sketches) gets the measured part, or a paper of its own if the real-set numbers are worth it.
