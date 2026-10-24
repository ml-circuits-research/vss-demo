// resolver.js: binds the descriptions of a frame to components of the diagram (spec 10.1-10.3). A description comes from the reader's
// frame (tool/sop/infer.py format, mirrored by vss.js): a filler is ["word", w] | ["negword", w] | ["entity", head, attr, det] with attr
// ["word", a] | ["negword", a] | null. Rules, stated and shown to the user:
//   the / this / that / a label            -> exactly one match expected (none: "there is no ..."; several: a question with candidates)
//   a / an                                 -> a new component (create, place) or the most recent match (other actions)
//   all / every / each / a plural head     -> every match
//   it / them                              -> the components touched by the previous request, or the selection (pronoun rule, 10.3)
//   everything                             -> every component
//   shape, component, element, item, thing -> any kind
import { KIND_OF, singular, isPlural, sameWord, COLORS, SIZES, STYLES } from "./scene.js";

export function describe(filler, info = {}) {
  if (!filler) return null;
  if (filler[0] === "word" || filler[0] === "negword") return { head: filler[1], attr: null, det: null };
  if (filler[0] === "entity") {
    const [, head, attr, det] = filler;
    return { head, attr: attr ? { neg: attr[0] === "negword", value: attr[1] } : null, det: det || null };
  }
  return null;
}

function attrMatch(c, attr) {
  if (!attr) return true;
  const v = attr.value; let has;
  if (COLORS.includes(v)) has = c.color === v; else if (SIZES.includes(v)) has = c.size === v; else if (STYLES.includes(v)) has = c.style === v; else has = false;
  return attr.neg ? !has : has;
}

export function labelKey(s) { return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""); }

// returns {ids, status: "ok" | "none" | "ambiguous" | "new", rule, desc}
export function resolve(scene, desc, { creating = false } = {}) {
  if (!desc) return { ids: [], status: "none", rule: "no description", desc };
  const all = [...scene.components.values()];
  const h = desc.head;
  if (h === "it" || h === "them") {
    const ids = scene.selection.length ? scene.selection : scene.lastTouched;
    return { ids: [...ids], status: ids.length ? "ok" : "none", rule: `${h} = ${scene.selection.length ? "the selection" : "the components touched by the previous request"}`, desc };
  }
  if (h === "everything") return { ids: all.map((c) => c.id), status: all.length ? "ok" : "none", rule: "everything = every component", desc };
  const sing = singular(h); const kind = KIND_OF[sing];
  if (!kind) {                                                       // a label used as the head: "connect orders to payments"
    const ids = all.filter((c) => labelKey(c.label) === labelKey(h)).map((c) => c.id);
    return { ids, status: ids.length === 1 ? "ok" : ids.length ? "ambiguous" : "none", rule: `the component labelled "${h}"`, desc };
  }
  const det = desc.det; const plural = isPlural(h);
  if (creating && (det === "a" || det === "an" || (!det && plural))) return { ids: [], status: "new", rule: "a / an: a new component", desc };
  const matches = all.filter((c) => (kind === "generic" || sameWord(c.word, sing)) && attrMatch(c, desc.attr))
    .sort((a, b) => a.order - b.order);
  const ids = matches.map((c) => c.id);
  if (["all", "every", "each", "any"].includes(det) || plural) return { ids, status: ids.length ? "ok" : "none", rule: `${det || "plural"}: every match`, desc };
  if (det === "a" || det === "an") return { ids: ids.slice(-1), status: ids.length ? "ok" : "none", rule: "a / an: the most recent match", desc };
  if (ids.length > 1 && sing === h) {                               // "the api" beside a service: the exact word wins over its synonyms
    const exact = matches.filter((c) => c.word === sing).map((c) => c.id);
    if (exact.length === 1) return { ids: exact, status: "ok", rule: `the ${sing}: the exact word wins over its synonyms (${ids.length - 1} other match${ids.length > 2 ? "es" : ""} by a synonym)`, desc };
  }
  return { ids, status: ids.length === 1 ? "ok" : ids.length ? "ambiguous" : "none", rule: "the / this / that: exactly one match expected", desc };
}

export function phrase(desc) {
  if (!desc) return "it";
  const a = desc.attr ? (desc.attr.neg ? `not-${desc.attr.value} ` : `${desc.attr.value} `) : "";
  return `${desc.det && desc.det !== "the" ? desc.det + " " : "the "}${a}${desc.head}`;
}
