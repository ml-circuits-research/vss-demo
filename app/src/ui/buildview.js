// buildview.js (ui): the state of this build (buildstatus.js data) as three columns: what works, what is temporary, what is next.
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
export function renderBuildStatus(host, B) {
  host.replaceChildren(); host.classList.add("build-list");
  host.append(el("p", "build-head", `${B.headline} (${B.date})`));
  const cols = el("div", "build-cols");
  for (const [title, items] of [["What works", B.works], ["Temporary in this build", B.temporary], ["What is next", B.next]]) {
    const sec = el("section", "build-col"); sec.append(el("h4", null, title)); const ul = el("ul");
    for (const t of items) ul.append(el("li", null, t));
    sec.append(ul); cols.append(sec);
  }
  host.append(cols);
}
