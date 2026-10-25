// translate.mjs: the dictionary path (app/src/translate.js) on a small hand-written dictionary. Usage: node app/tests/translate.mjs
import { createTranslator, fold } from "../src/translate.js";
let pass = 0, fail = 0; const bad = []; const check = (n, c, d = "") => { if (c) pass++; else { fail++; bad.push(`${n}: ${d}`); } };
const t = createTranslator({ language: "ro", entries: { "pune": ["put"], "o": ["a"], "nota": ["note"], "galbena": ["yellow"], "sub": ["below"], "baza de date": ["database"],
  "baza de date": ["database"], "baza": ["base"], "cutia": ["the box"], "la": ["to", "at"], "conecteaza": ["connect"], "numita": ["called"], "adauga": ["add"], "rosie": ["red"], "comenzi": ["orders"] } });
check("fold", fold("Pune o notă galbenă ȘI țară") === "pune o nota galbena si tara", fold("Pune o notă galbenă ȘI țară"));
const a = t.translate("Pune o notă galbenă sub baza de date");
check("longest key first", a.variants[0].join(" ") === "put a note yellow below database", a.variants[0].join(" "));
const b = t.translate("conectează cutia la baza de date");
check("alternatives", b.variants.map((v) => v.join(" ")).join("|") === "connect the box to database|connect the box at database", b.variants.map((v) => v.join(" ")).join("|"));
const c = t.translate("adaugă o cutie roșie numită Comenzi");
check("label after intro kept with its spelling", c.variants[0].join(" ").endsWith("called Comenzi") && c.variants[0].includes("add"), c.variants[0].join(" "));
const d = t.translate("add a red box to the database");
check("English passes through", d.variants[0].join(" ") === "add a red box to the database" && d.replaced.length === 0, JSON.stringify(d));
const e = t.translate("add o cutie rosie");
check("Romglish: English grammar, Romanian words", e.variants[0].join(" ") === "add a cutie red", e.variants[0].join(" "));
const big = createTranslator({ entries: { x: ["a", "b"] } }, { maxVariants: 4 }).translate("x x x x");
check("variants capped", big.variants.length === 4, String(big.variants.length));
console.log(`translate: ${pass} checks passed, ${fail} failed`); if (fail) { console.log(bad.join("\n")); process.exit(1); }
