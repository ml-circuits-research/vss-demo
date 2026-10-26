// chat.js (ui): the chat thread above the input (D26). DOM only: the person's messages on the left, the editor's replies on the right, newest at
// the bottom; the thread scrolls and keeps the last `max` messages. A reply is plain sentences, and its choices (a question's candidates) are
// buttons inside it. No decisions and no wording here (chattext.js has the words, main.js the handlers).
//   const chat = createChat(host, { max, onDetails(entry) })
//   chat.person(text) -> id            the person's message, as given
//   chat.editor({ text, extra, action, choices: [{label, run}], entry }) -> id     the editor's reply; entry = its History entry
//   chat.actions() -> element          where a handler may append buttons to the newest reply (small extras only)
//   chat.settle(id)                    the choices of a reply have been used: they stay visible, disabled
//   chat.interim(text) / chat.clearInterim()   what the microphone has heard so far (a faint message at the bottom)
//   chat.reveal(id) -> boolean         scroll to a message and flash it (false when it is no longer in the thread)
//   chat.has(id), chat.size
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };

export function createChat(host, { max = 60, onDetails } = {}) {
  let next = 1, last = null, ghost = null; const nodes = new Map();
  const atBottom = () => host.scrollHeight - host.scrollTop - host.clientHeight < 80;
  const toBottom = () => { host.scrollTop = host.scrollHeight; };
  function add(node, id) {
    const stick = atBottom() || node.classList.contains("from-person");
    if (ghost) host.insertBefore(node, ghost); else host.append(node);
    nodes.set(id, node);
    while (nodes.size > max) { const [oldId, old] = nodes.entries().next().value; old.remove(); nodes.delete(oldId); }
    if (stick) toBottom();
    host.hidden = false;
  }
  return {
    person(text) {
      const id = next++, m = el("div", "msg from-person"); m.dataset.msg = id; m.append(el("div", "bubble", text)); add(m, id); return id;
    },
    editor({ text, extra = "", action = "execute", choices = [], entry = null } = {}) {
      const id = next++, m = el("div", `msg from-editor act-${action}`); m.dataset.msg = id;
      const b = el("div", "bubble"); b.append(el("span", "said", text)); if (extra) b.append(" ", el("span", "said extra", extra));
      const acts = el("div", "choices"); b.append(acts); m.append(b);
      for (const c of choices) { const x = el("button", "choice", c.label); x.type = "button"; x.onclick = () => { if (!b.classList.contains("settled")) c.run(); }; acts.append(x); }
      if (entry && onDetails) { const foot = el("div", "bubble-foot"); const d = el("button", "details-link", "details"); d.type = "button"; d.title = "What was understood and done, in History"; d.onclick = () => onDetails(entry); foot.append(d); m.append(foot); }
      add(m, id); last = { id, node: m, acts, bubble: b }; return id;
    },
    actions() { return last ? last.acts : el("div"); },
    settle(id) { const n = nodes.get(id); if (!n) return; const b = n.querySelector(".bubble"); b.classList.add("settled"); for (const x of b.querySelectorAll("button.choice")) x.disabled = true; },
    interim(text) {
      if (!ghost) { ghost = el("div", "msg from-person interim-msg"); ghost.append(el("div", "bubble")); host.append(ghost); host.hidden = false; }
      ghost.firstChild.textContent = text; toBottom();
    },
    clearInterim() { if (ghost) { ghost.remove(); ghost = null; } },
    reveal(id) {
      const n = nodes.get(id); if (!n) return false;
      n.scrollIntoView({ block: "center", behavior: "smooth" }); n.classList.remove("flash"); void n.offsetWidth; n.classList.add("flash");
      setTimeout(() => n.classList.remove("flash"), 1600); return true;
    },
    has: (id) => nodes.has(id),
    get size() { return nodes.size; },
  };
}
