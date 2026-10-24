# Third-party code in web/vendor (spec 12.2 and 13.2: every library recorded with its version and licence)

| file | library | version | licence | use |
|---|---|---|---|---|
| double-metaphone.js (+ double-metaphone.LICENSE) | double-metaphone (Titus Wormer, npm `double-metaphone`) | 2.0.1 | MIT | phonetic keys for the speech corrector (web/correct.js) |
| typo/typo.js | Typo.js (npm `typo-js`) | 1.4.0 | Modified BSD (BSD-3-Clause, per its package.json and README) | `check(word)`: is a token a valid English word (the corrector does not correct those; spec 12.1) |
| typo/en_US/ | en_US Hunspell dictionary from SCOWL, as shipped with typo-js 1.4.0 | 2020.12.07 | see typo/en_US/README.md (SCOWL licence: permissive) | the dictionary for Typo.js |

Files are copied unmodified from the npm tarballs (`npm pack double-metaphone@2.0.1 typo-js@1.4.0`). Typo.js's suggestion function is not
used. No other runtime dependency.
