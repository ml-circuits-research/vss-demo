// chattext.mjs: the chat thread's words (ui/chattext.js): plain replies from decide() results, and typed answers matched to choices.
import { plainReply, matchChoice, doneLine } from "../src/ui/chattext.js";
let fail = 0; const eq = (name, a, b) => { if (JSON.stringify(a) !== JSON.stringify(b)) { fail++; console.log(`FAIL ${name}: ${JSON.stringify(a)} != ${JSON.stringify(b)}`); } };

eq("create", plainReply({ action: "execute", line: 'create a blue box called "mailer"', notes: [], questions: [] }).text, "Done: a blue box called mailer.");
eq("create top", doneLine('create a red box called "a" top left'), "Done: a red box called a top left.");
eq("delete", plainReply({ action: "execute", line: "delete 2 component(s)" }).text, "Done: deleted 2 components.");
eq("set", plainReply({ action: "execute", line: 'set {"color":"blue"} on 1 component(s)' }).text, "Done: changed one component to blue.");
eq("connect x3", doneLine("connect c1 to c2 with a solid arrow; connect c2 to c3 with a solid arrow; connect c3 to c4 with a solid arrow"), "Done: connected two components with a solid arrow (3 times).");
eq("move", doneLine("move c4 to the left"), "Done: moved the component to the left.");
eq("clear", doneLine("clear the canvas"), "Done: cleared the canvas.");
eq("ask", plainReply({ action: "ask", line: "which colour, red or blue?", questions: [{ kind: "role", role: "color", candidates: ["red", "blue"], text: "which colour, red or blue?" }] }),
  { text: "Which colour, red or blue?", extra: "" });
eq("refuse", plainReply({ action: "refuse", line: "I did not understand that (no-sense). I can: add, delete, move.", notes: [], questions: [] }).text, "I did not understand that. What I can do here: add, delete, move.");
eq("refuse blocked", plainReply({ action: "refuse", line: "not done: c1 is locked" }).text, "I could not do that: c1 is locked.");
eq("presence note", plainReply({ action: "execute", line: "create a box", notes: [{ kind: "presence", role: "size", text: "a size may have been meant; none was used" }], questions: [] }),
  { text: "Done: a box.", extra: "A size may have been meant; none was used." });
eq("presence question, no repeated note", plainReply({ action: "execute", line: "create a box", notes: [{ kind: "presence", role: "size", text: "a size may have been meant; none was used" }],
  questions: [{ kind: "presence", role: "size", text: "did you mean to give a size?", candidates: ["yes", "no"] }] }), { text: "Done: a box.", extra: "Did you mean to give a size?" });
eq("offer", plainReply({ action: "execute", line: "create a box", notes: [], questions: [{ kind: "offer", role: "text", word: "irina", text: 'is "irina" the new name?', candidates: ["yes", "no"] }] }).extra, "Is irina the new name?".replace("irina", '"irina"'));
eq("unplaced", plainReply({ action: "execute", line: "create a box", notes: [{ kind: "unplaced", text: '"foo" was not used' }] }).extra, "I did not use foo.");
eq("correction", plainReply({ action: "execute", line: "create a box", notes: [{ kind: "correction", text: 'read "bxo" as "box"' }] }).extra, "I read bxo as box.");
eq("no model", plainReply({ action: "refuse", line: "no model is loaded" }).text, "No reader model is loaded.");

const ch = [{ label: "irina" }, { label: "paul" }, { label: "yes", aliases: ["y"] }];
eq("match label", matchChoice(ch, " Irina. "), 0);
eq("match alias", matchChoice(ch, "y"), 2);
eq("no match", matchChoice(ch, "add a box"), -1);
eq("underscore", matchChoice([{ label: "top left" }], "top_left"), 0);
eq("ambiguous", matchChoice([{ label: "a" }, { label: "A" }], "a"), -1);
console.log(fail ? `chattext: ${fail} FAIL` : "chattext: all checks pass"); process.exit(fail ? 1 : 0);
