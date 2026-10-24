// table.js: the dictation table used when no textedit model is installed (spec 14.2): spoken punctuation and layout, the start and stop
// phrases, the escape word. A copy of the 'dictation' block of training/worlds/textedit/normalize.json, which the textedit export ships as
// app/model/textedit/normalize.json; when that file is present, src/main.js passes its block instead and this copy is not used.
export const DICTATION_TABLE = {
 "about": "Spoken punctuation and layout in dictation mode (spec 14.2), applied to content only. Keys are spoken words (lower case); 'attach' says how the mark joins the text: 'left' = no space before, 'right' = no space after, 'both' = no space on either side, 'none' = spaces as words. 'literally' writes the next word as text.",
 "escape": "literally",
 "marks": [
  [
   "full stop",
   ".",
   "left"
  ],
  [
   "period",
   ".",
   "left"
  ],
  [
   "comma",
   ",",
   "left"
  ],
  [
   "question mark",
   "?",
   "left"
  ],
  [
   "exclamation mark",
   "!",
   "left"
  ],
  [
   "exclamation point",
   "!",
   "left"
  ],
  [
   "colon",
   ":",
   "left"
  ],
  [
   "semicolon",
   ";",
   "left"
  ],
  [
   "semi colon",
   ";",
   "left"
  ],
  [
   "open quote",
   "“",
   "right"
  ],
  [
   "close quote",
   "”",
   "left"
  ],
  [
   "open bracket",
   "(",
   "right"
  ],
  [
   "close bracket",
   ")",
   "left"
  ],
  [
   "open parenthesis",
   "(",
   "right"
  ],
  [
   "close parenthesis",
   ")",
   "left"
  ],
  [
   "hyphen",
   "-",
   "both"
  ],
  [
   "dash",
   "-",
   "none"
  ],
  [
   "ellipsis",
   "...",
   "left"
  ]
 ],
 "layout": [
  [
   "new line",
   "line"
  ],
  [
   "next line",
   "line"
  ],
  [
   "new paragraph",
   "paragraph"
  ],
  [
   "next paragraph",
   "paragraph"
  ],
  [
   "bullet",
   "bullet"
  ],
  [
   "new bullet",
   "bullet"
  ],
  [
   "numbered item",
   "number"
  ]
 ],
 "start": [
  "start writing",
  "start dictating",
  "start dictation",
  "begin writing",
  "write in",
  "type in",
  "dictate in",
  "start writing in",
  "dictation mode"
 ],
 "stop": [
  "stop writing",
  "stop dictating",
  "stop dictation",
  "done",
  "i am done",
  "im done",
  "end dictation",
  "command mode"
 ]
};
