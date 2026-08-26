# files/media/

Simulation clips go here. List them in [`content/media.js`](../../content/media.js).

The site currently points at animated SVG placeholders in `assets/img/`. Replace
each entry's `image:` line with `mp4:` / `webm:` / `poster:` lines once you have
real clips.

## Encoding

Export your animation from ParaView/VisIt/Nek however you normally would, then
convert it for the web:

```bash
# MP4 — plays everywhere. This is the one you must have.
ffmpeg -i input.mov -vf "scale=1280:-2" -c:v libx264 -crf 26 -preset slow \
       -pix_fmt yuv420p -an -movflags +faststart channel-flow.mp4

# WebM — usually 20-40% smaller. Optional; browsers pick it when supported.
ffmpeg -i input.mov -vf "scale=1280:-2" -c:v libvpx-vp9 -crf 36 -b:v 0 \
       -an channel-flow.webm

# Poster frame — shown before the video loads. Grab a representative moment.
ffmpeg -i channel-flow.mp4 -ss 00:00:02 -vframes 1 -q:v 3 channel-flow.jpg
```

### Starting from a GIF

This is the common case here — the RBF runs produce GIFs. Converting is very
much worth it: `cavity_Re100.gif` went from **4.18 MB to 300 KB (MP4) and 207 KB
(WebM)**, about a 20× saving, with *better* image quality, because GIF is capped
at 256 colours and mangles a continuous colormap.

```bash
# MP4
ffmpeg -i cavity_Re100.gif -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" \
       -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -an \
       -movflags +faststart cavity_Re100.mp4

# WebM
ffmpeg -i cavity_Re100.gif -c:v libvpx-vp9 -crf 36 -b:v 0 -an -row-mt 1 \
       cavity_Re100.webm

# Poster, taken 3 seconds in so it isn't the blank first frame
ffmpeg -i cavity_Re100.mp4 -ss 00:00:03 -vframes 1 -q:v 3 cavity_Re100.jpg
```

`scale=trunc(iw/2)*2:trunc(ih/2)*2` rounds the dimensions down to even numbers —
h.264 requires it, and simulation output is often an odd size.

Once converted, **delete the .gif**. Keeping it costs 4 MB in the repository
forever and nothing uses it.

If your clip isn't roughly 16:9, add its shape to the entry in
`content/media.js` so it isn't letterboxed:

```js
aspect: "594 / 550",
```

### Starting from a PNG sequence

```bash
ffmpeg -framerate 30 -i frame_%04d.png -vf "scale=1280:-2" -c:v libx264 \
       -crf 26 -pix_fmt yuv420p -an -movflags +faststart out.mp4
```

Why each flag matters:

| Flag | Why |
| --- | --- |
| `-an` | Strips audio. Silent clips autoplay reliably; clips with an audio track often don't. |
| `-pix_fmt yuv420p` | Without it, Safari and QuickTime may refuse to play the file. |
| `-movflags +faststart` | Moves the index to the front so playback starts before the whole file arrives. |
| `-crf 26` | Quality knob. Lower = better and bigger. Try 23 for detailed flow structures, 30 if the file is too big. |
| `scale=1280:-2` | 720p is plenty — the rail displays at ~380 px. `-2` keeps the aspect ratio and an even height (h.264 requires it). |

## Keep the files small

Aim for **a few MB per clip**, and trim to the interesting 5–15 seconds rather
than uploading a full run. Two reasons this matters more than usual:

- **Git keeps everything forever.** A 200 MB render committed once stays in the
  repository history even after you delete it, and everyone who clones pays for
  it. Get the size right *before* the first commit of a file.
- **GitHub Pages limits.** Published sites should stay under ~1 GB, with a soft
  bandwidth limit of 100 GB/month. A handful of well-compressed clips is nothing;
  a directory of raw renders will get you a warning email.

Check what you're about to add:

```bash
du -sh files/media/
```

If a clip refuses to get small enough, cut its resolution (`scale=960:-2`) or its
frame rate (`-r 24`) before you reach for a higher `-crf`.
