# Third-party code in web/vendor (spec 12.2 and 13.2: every library recorded with its version and licence)

| file | library | version | licence | use |
|---|---|---|---|---|
| double-metaphone.js (+ double-metaphone.LICENSE) | double-metaphone (Titus Wormer, npm `double-metaphone`) | 2.0.1 | MIT | phonetic keys for the speech corrector (app/src/correct.js) |
| typo/typo.js | Typo.js (npm `typo-js`) | 1.4.0 | Modified BSD (BSD-3-Clause, per its package.json and README) | `check(word)`: is a token a valid English word (the corrector does not correct those; spec 12.1) |
| kiwi/*.js (+ COPYING.txt) | @lume/kiwi (TypeScript port of the Kiwi Cassowary solver; the original kiwi.js package is unmaintained) | 0.4.4 | BSD-3-Clause (Modified BSD, COPYING.txt) | the linear constraint solver of app/src/editor/geometry.js (spec 8.2) |
| typo/en_US/ | en_US Hunspell dictionary from SCOWL, as shipped with typo-js 1.4.0 | 2020.12.07 | see typo/en_US/README.md (SCOWL licence: permissive) | the dictionary for Typo.js |

Files are copied unmodified from the npm tarballs (`npm pack double-metaphone@2.0.1 typo-js@1.4.0`). Typo.js's suggestion function is not
used. No other runtime dependency.

Checked for the next steps and NOT vendored yet (licences as published on npm on 2026-10-24): @maxgraph/core 0.25.1, Apache-2.0
(the recommended diagram library, spec 9); elkjs 0.12.0, "EPL-2.0 OR GPL-3.0-or-later" (automatic layout, spec 8.3: used under EPL-2.0);
@joint/core, MPL-2.0 (the alternative library). The choice is made at step 6 on the comparison prototype and recorded here.
