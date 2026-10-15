# Championship Manager 01/02 for iPad

A personal project: the original PC game (v3.9.60, freeware since Eidos released it) running in Safari through [Boxedwine](https://github.com/danoon2/Boxedwine), packaged as an offline web app.

## Play

1. Open the GitHub Pages link in Safari on the iPad.
2. Share → Add to Home Screen, then open it from the new icon.
3. Tap Kick off. The first launch downloads about 141 MB; after that it plays with no connection.

Saves live on the device. Use Saves → Back up saves in the game to keep a copy in Files.

## What's in here

- `index.html` launcher, touch-to-mouse controls, save import and backup
- `sw.js` service worker that keeps everything on the device
- `shell.js` Boxedwine web shell (GPL v2)
- `data/` the Wine 11 filesystem with a prepared Windows prefix and a virtual CD drive, plus the game, split into 14.5 MB parts

Boxedwine is GPL v2, Wine is LGPL. Championship Manager 01/02 is © Sports Interactive / Eidos, released as freeware.
