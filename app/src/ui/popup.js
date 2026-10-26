// popup.js (ui): the one kind of popup of the app (owner, D21 item 1 and D22): as wide as the window with margins on a desktop, the phone's
// width on a phone, its content laid out across the width by the caller (grids), vertical scrolling only when the content is still too long,
// and a header with the title and an X that stays in view while the body scrolls. DOM only.
//   const p = openPopup({ title, className, render(body, popup) });   p.close();
// The static dialogs of index.html have the same structure (header.sheet-head, .sheet-body); wireDialogs() adds the backdrop click to them.
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
const X_ICON = '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>';

function closeOnBackdrop(dlg) { dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); }); }
export function wireDialogs(root = document) { for (const d of root.querySelectorAll("dialog.sheet")) closeOnBackdrop(d); }

export function openPopup({ title, className = "", render, onClose } = {}) {
  const dlg = el("dialog", `sheet popup ${className}`.trim()); const form = el("form", "sheet-form"); form.method = "dialog";
  const head = el("header", "sheet-head"); head.append(el("h2", null, title || ""));
  const x = el("button", "sheet-x"); x.value = "close"; x.setAttribute("aria-label", "Close"); x.title = "Close"; x.innerHTML = X_ICON; head.append(x);
  const body = el("div", "sheet-body"); form.append(head, body); dlg.append(form); document.body.append(dlg);
  closeOnBackdrop(dlg);
  const popup = { dlg, body, head, close: () => dlg.close(), setTitle: (t) => { head.querySelector("h2").textContent = t; } };
  dlg.addEventListener("close", () => { dlg.remove(); if (onClose) onClose(popup, dlg.returnValue); });
  if (render) render(body, popup);
  dlg.showModal();
  return popup;
}
