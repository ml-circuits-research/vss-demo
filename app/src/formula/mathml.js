// mathml.js: formula tree -> MathML Core markup (a string), DOM-free. MathML Core is rendered natively, with no library, by
// Chromium 109+ (Chrome, Edge, Opera, Samsung Internet), Firefox (all current versions) and Safari / WebKit (all current versions,
// iOS included); it uses only elements of MathML Core: math, mrow, mi, mn, mo, mspace, mfrac, msup, msub, msubsup, msqrt, mroot,
// munderover.
// Grouping parentheses follow tree.needsParens, as latex.js. Options: {display: "block"|"inline", paths: true} -> every node's
// element carries data-path="<role>/<role>" (the view uses it for clicks and highlights), {highlight: Set of path keys} -> class "fx-hl",
// {cursor: path key} -> class "fx-cursor".
import { needsParens, GREEK, pathKey } from "./tree.js";

const GREEK_CHAR = { alpha: "α", beta: "β", gamma: "γ", delta: "δ", theta: "θ", lambda: "λ", mu: "μ", sigma: "σ", phi: "φ", omega: "ω", psi: "ψ", rho: "ρ" };
const CONST_CHAR = { pi: "π", e: "e", infinity: "∞" };
const REL_CHAR = { equals: "=", less: "&lt;", greater: "&gt;", approx: "≈", implies: "⟹" };
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function toMathML(tree, opts = {}) {
  const body = render(tree, [], opts);
  return `<math xmlns="http://www.w3.org/1998/Math/MathML" display="${opts.display || "block"}">${body}</math>`;
}

function attrs(path, opts) {
  const k = pathKey(path), cls = [];
  if (opts.highlight && opts.highlight.has(k)) cls.push("fx-hl");
  if (opts.cursor !== undefined && opts.cursor === k) cls.push("fx-cursor");
  return (opts.paths ? ` data-path="${esc(k)}"` : "") + (cls.length ? ` class="${cls.join(" ")}"` : "");
}
function leadsWithDigit(t) {
  if (t.op === "num") return true;
  const first = { power: "base", subscript: "base", times: "left", plus: "left", minus: "left" }[t.op];
  return first ? !needsParens(t, first, t[first]) && leadsWithDigit(t[first]) : false;
}
const fence = (inner) =>`<mrow><mo>(</mo>${inner}<mo>)</mo></mrow>`;

function render(t, path, opts) {
  const R = (role) => { const s = render(t[role], path.concat(role), opts); return needsParens(t, role, t[role]) ? fence(s) : s; };
  const C = (role) => render(t[role], path.concat(role), opts);           // a child in its own box (no grouping needed)
  const box = (inner) => `<mrow${attrs(path, opts)}>${inner}</mrow>`;
  switch (t.op) {
    case "num": return `<mn${attrs(path, opts)}>${esc(t.v)}</mn>`;
    case "var": return `<mi${attrs(path, opts)}>${GREEK.includes(t.v) ? GREEK_CHAR[t.v] : esc(t.v)}</mi>`;
    case "const": return `<mi${attrs(path, opts)}>${CONST_CHAR[t.v]}</mi>`;
    case "hole": return `<mi mathvariant="normal"${attrs(path, opts)}>□</mi>`;
    case "plus": return box(`${R("left")}<mo>+</mo>${R("right")}`);
    case "minus": return box(`${R("left")}<mo>−</mo>${R("right")}`);
    case "times": {
      const digit = !needsParens(t, "right", t.right) && leadsWithDigit(t.right);       // as latex.js: \cdot before a digit
      return box(`${R("left")}<mo>${digit ? "⋅" : "&#x2062;"}</mo>${R("right")}`);
    }
    case "neg": return box(`<mo>−</mo>${R("operand")}`);
    case "fraction": return `<mfrac${attrs(path, opts)}><mrow>${C("numerator")}</mrow><mrow>${C("denominator")}</mrow></mfrac>`;
    case "power": return `<msup${attrs(path, opts)}><mrow>${R("base")}</mrow><mrow>${C("exponent")}</mrow></msup>`;
    case "subscript": return `<msub${attrs(path, opts)}><mrow>${R("base")}</mrow><mrow>${C("index")}</mrow></msub>`;
    case "root": return t.index
      ? `<mroot${attrs(path, opts)}><mrow>${C("argument")}</mrow><mrow>${C("index")}</mrow></mroot>`
      : `<msqrt${attrs(path, opts)}>${C("argument")}</msqrt>`;
    case "apply": return box(`<mi>${esc(t.function)}</mi><mo>&#x2061;</mo>${fence(C("argument"))}`);
    case "paren": return box(fence(C("operand")));
    case "abs": return box(`<mo>|</mo>${C("operand")}<mo>|</mo>`);
    case "sum": case "product":
      return box(`<munderover><mo largeop="true" movablelimits="false">${t.op === "sum" ? "∑" : "∏"}</mo><mrow>${C("index")}<mo>=</mo>${C("lower")}</mrow>` +
        `<mrow>${C("upper")}</mrow></munderover>${R("body")}`);
    case "integral": {
      const sign = t.lower ? `<msubsup><mo largeop="true">∫</mo><mrow>${C("lower")}</mrow><mrow>${C("upper")}</mrow></msubsup>` : `<mo largeop="true">∫</mo>`;
      return box(`${sign}${C("body")}<mspace width="0.17em"></mspace><mi mathvariant="normal">d</mi>${C("index")}`);
    }
    default:
      if (REL_CHAR[t.op]) return box(`${R("left")}<mo>${REL_CHAR[t.op]}</mo>${R("right")}`);
      throw new Error(`toMathML: unknown operator ${t.op}`);
  }
}
