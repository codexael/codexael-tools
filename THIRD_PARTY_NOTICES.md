# Third-Party Notices

Toolstack's own code is licensed under the MIT License (see [LICENSE](LICENSE)).

This repository also includes third-party open source software. Each component
stays under its own license. The full license texts are in the
[`licenses/`](licenses/) folder, and the original copyright headers inside the
vendored files are kept as is.

## Bundled libraries

| Component | Version | License | Files in this repo | License text |
|---|---|---|---|---|
| [Bootstrap](https://getbootstrap.com/) | 5.2.0-beta1 | MIT | `css/bootstrap.min.css`, `js/bootstrap.bundle.min.js` | [bootstrap-LICENSE.txt](licenses/bootstrap-LICENSE.txt) |
| [Bootstrap Icons](https://icons.getbootstrap.com/) | 1.11.3 | MIT | `css/bootstrap-icons.min.css`, `css/icons/bootstrap-icons.woff`, `css/icons/bootstrap-icons.woff2` | [bootstrap-icons-LICENSE.txt](licenses/bootstrap-icons-LICENSE.txt) |
| [CodeMirror 5](https://codemirror.net/5/) | 5.65.21 | MIT | `js/codemirror/*.js`, `css/codemirror/*.css` | [codemirror-LICENSE.txt](licenses/codemirror-LICENSE.txt) |
| [bwip-js](https://github.com/metafloor/bwip-js) (includes Barcode Writer in Pure PostScript) | 4.9.0 | MIT | `js/bwip-js-min.js` | [bwip-js-LICENSE.txt](licenses/bwip-js-LICENSE.txt) |
| [CryptoJS](https://github.com/brix/crypto-js) | 4.2.x | MIT | `js/crypto-js.min.js` | [crypto-js-LICENSE.txt](licenses/crypto-js-LICENSE.txt) |
| [diff-match-patch](https://github.com/google/diff-match-patch) | not recorded | Apache-2.0 | `js/diff_match_patch.js` | [diff-match-patch-LICENSE.txt](licenses/diff-match-patch-LICENSE.txt) |
| [jsQR](https://github.com/cozmo/jsQR) | not recorded | Apache-2.0 | `js/jsQR.js` | [jsqr-LICENSE.txt](licenses/jsqr-LICENSE.txt) |
| [Mammoth.js](https://github.com/mwilliamson/mammoth.js) | not recorded | BSD-2-Clause | `js/mammoth.browser.min.js` | [mammoth-LICENSE.txt](licenses/mammoth-LICENSE.txt) |
| [Marked](https://marked.js.org/) | 15.0.12 | MIT | `js/marked.min.js` | [marked-LICENSE.txt](licenses/marked-LICENSE.txt) |
| [PDF.js](https://mozilla.github.io/pdf.js/) | 3.11.174 | Apache-2.0 | `js/pdf.min.js`, `js/pdf.worker.min.js` | [pdfjs-LICENSE.txt](licenses/pdfjs-LICENSE.txt) |
| [PeerJS](https://peerjs.com/) | 1.5.4 | MIT | `js/peerjs.min.js` | [peerjs-LICENSE.txt](licenses/peerjs-LICENSE.txt) |
| [DOMPurify](https://github.com/cure53/DOMPurify) | 3.4.12 | Apache-2.0 OR MPL-2.0 (used under Apache-2.0) | `js/purify.min.js` | [dompurify-LICENSE.txt](licenses/dompurify-LICENSE.txt) |
| [QRCode.js](https://github.com/davidshimjs/qrcodejs) | not recorded | MIT | `js/qrcode.min.js` | [qrcodejs-LICENSE.txt](licenses/qrcodejs-LICENSE.txt) |
| [SQL Formatter](https://github.com/sql-formatter-org/sql-formatter) | not recorded | MIT | `js/sql-formatter.min.js` | [sql-formatter-LICENSE.txt](licenses/sql-formatter-LICENSE.txt) |
| [Turndown](https://github.com/mixmark-io/turndown) | not recorded | MIT | `js/turndown.min.js` | [turndown-LICENSE.txt](licenses/turndown-LICENSE.txt) |
| [ZXing for JS – browser](https://github.com/zxing-js/browser) | not recorded | MIT | `js/zxing-browser.min.js` | [zxing-browser-LICENSE.txt](licenses/zxing-browser-LICENSE.txt) |
| [ZXing for JS – library](https://github.com/zxing-js/library) (bundled inside zxing-browser) | not recorded | Apache-2.0 | `js/zxing-browser.min.js` | [zxing-library-LICENSE.txt](licenses/zxing-library-LICENSE.txt) |

"QR Code" is a registered trademark of DENSO WAVE INCORPORATED.

### Libraries bundled inside `js/mammoth.browser.min.js`

The Mammoth.js browser build contains these dependencies. Their license texts
are in [`licenses/mammoth-bundled/`](licenses/mammoth-bundled/).

| Component | License |
|---|---|
| [JSZip](https://github.com/Stuk/jszip) | MIT OR GPL-3.0 (used under MIT) |
| [Bluebird](https://github.com/petkaantonov/bluebird) | MIT |
| [pako](https://github.com/nodeca/pako) | MIT AND Zlib |
| [xmldom](https://github.com/xmldom/xmldom) | MIT |
| [sax](https://github.com/isaacs/sax-js) | ISC |
| [lop](https://github.com/mwilliamson/lop) | BSD-2-Clause |
| [option](https://github.com/mwilliamson/node-options) | BSD-2-Clause |
| [dingbat-to-unicode](https://github.com/mwilliamson/dingbat-to-unicode) | BSD-2-Clause |
| [base64-js](https://github.com/beatgammit/base64-js) | MIT |
| [ieee754](https://github.com/feross/ieee754) | BSD-3-Clause |
| [immediate](https://github.com/calvinmetcalf/immediate) | MIT |
| [lie](https://github.com/calvinmetcalf/lie) | MIT |
| [readable-stream](https://github.com/nodejs/readable-stream) | MIT |

## Loaded at runtime (not included in this repository)

| Component | License | Notes |
|---|---|---|
| [Archivo Black](https://fonts.google.com/specimen/Archivo+Black) and [Space Mono](https://fonts.google.com/specimen/Space+Mono) fonts | SIL Open Font License 1.1 | Served by Google Fonts. |

## Third-party data services

Several tools fetch data from free public APIs when the user opens them. No
code from these services is included in this repository. Their data and
images stay under each provider's own terms, and each tool page links to its
source.

Advice Slip, Cat Facts (catfact.ninja), The Cat API, Dog API (dogapi.dog),
random.dog, Useless Facts, Riddles API, Open Trivia Database, The Metropolitan
Museum of Art Collection API, Wikimedia Feed API, iNaturalist, OpenStreetMap,
Razorpay IFSC, Zippopotam.us, Frankfurter, ExchangeRate-API, Gold API, ipwho.is
and Lorem Picsum.

Scrum Poker and the Party Games use the free PeerJS cloud server only to help
browsers find each other. After that, players talk to each other directly over
WebRTC, and no game data is stored on a server.

## Updating this file

When you add, upgrade or remove a vendored library:

1. Add or replace its license text in `licenses/`.
2. Update the tables above.
3. Update the `THIRD_PARTY_LIBRARIES` list in `js/common.js`, which powers the
   "Third-party licenses" dialog in the site footer.
4. Keep the library's original copyright header at the top of its file.
