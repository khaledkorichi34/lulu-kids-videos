# Lulu kids videos: production guide

This repository makes short animated videos for a YouTube kids channel and publishes them.
The owner (Khaled) asked for **3 new videos a day for children aged 3 to 10**, published
automatically. Each scheduled run makes and publishes **exactly one** video, then stops.

The audience is small children. Every video must be gentle, correct and visually clean.
When in doubt, make the simpler, calmer video.

## What a run does

1. Read `episodes/log.json` (what has been published) and `channel.json` (settings and IDs).
2. Pick the format for this time slot and a topic that is not in the log yet.
3. Write `episodes/NNN-slug/scene.html` and `episode.json` (NNN = last number + 1).
4. Build, look at every check sheet, fix what is wrong, rebuild.
5. Publish through Make, record the result in the log, commit and push to `main`.

## Formats and ages

Find the slot with `TZ=Europe/Madrid date +%H`:

| Slot | Hour | Format | Ages |
|---|---|---|---|
| Morning | before 11 | **Learning**: counting, letters and first words, colours, shapes, opposites, simple sums (2 + 3) | 3 to 7 |
| Afternoon | 11 to 16 | **Curious**: "Who am I?" riddle (three clues, then the reveal) or "Did you know?" (three facts about one animal or one thing in nature) | 6 to 10 |
| Evening | 17 and later | **Story**: a small story with Lulu and friends that ends calmly, usually at night (`lullaby_from`) | 3 to 6 |

Vary the topic and the cast from day to day. Never repeat a topic that is already in the log
(a new counting video must count different things or a different range, and so on).

## Content rules

- English text on screen, short sentences, big letters. Younger formats: 2 to 5 words per line.
  Older formats: one sentence of at most 10 words per line.
- Kind and calm. Nothing scary, violent, sad without comfort, rude or unsafe to copy.
- Facts must be simple, well established and true. If you are not sure a fact is right, do not use it.
  No health, medical, diet or safety advice.
- Original material only: no brands, no existing characters, songs, rhymes or stories from
  books, films or TV. No real people.
- The channel is "Made for Kids": never ask viewers to like, subscribe, comment, click, buy or
  share anything about themselves. No links in titles or descriptions.
- Title: at most 70 characters, plain and honest, no ALL CAPS, pattern `Topic | Kind of video`.
  Description: 2 to 4 short lines saying what happens and "for children aged X to Y".
- Length 40 to 75 seconds.

## The stage

- 1280 x 720, 30 frames per second. `scene.html` loads `../../toolkit/lib.js` and defines
  `window.renderAt(t)` (draws the whole frame for time `t` in seconds, by setting `svg.innerHTML`)
  and `window.renderThumb()` (a still 1280 x 720 thumbnail). Rendering must depend only on `t`:
  no timers, no `Math.random()` without a fixed seed.
- Copy `episodes/002-count-with-lulu/scene.html` (learning) or
  `episodes/001-lulu-the-little-duck/scene.html` (story) as a starting point.
- Scenes: `SC=[0, 5, 11, ...]` lists scene start times and ends with the total duration.
  `sceneAt(t,SC)` gives `[sceneIndex, timeInScene]`; `fades(t,SC,DUR)` draws the scene changes.
  A scene lasts 4 to 8 seconds; leave text on screen at least 2.5 seconds.
- Layout: ground line `y=520` (characters stand there), caption bar `y=606..698`,
  big animated words `pop()` at `y=150..170`, x centres `300 / 590 / 880` for three words.
  The background sun sits at `(1150,100)` and covers `x=1062..1238, y=12..188`.
- Layering order: `bg()` + props + characters + `nightTint(n)` + pop words + caption + `fades()`.

### Library (`toolkit/lib.js`)

- Motion: `clamp, lerp, prog(t,a,b), eio, eout, back, blink(t,offset)`,
  `jumps(lt,[times],duration,height)` returns `{y,sx,sy}` with squash and stretch.
- Placing: `place(x,y,inner,{s,sx,sy,rot,flip})`, `shadow(x,y,width,lift)`.
- Characters (origin at the feet, about 180 to 230 tall): `duck({wing,eye,asleep})`,
  `frog({eye})`, `bunny({eye,ear})`, `bee({flap})` (origin at its centre), `butterfly(x,y,flap)`.
- Props: `flower(x,y,height,colour,t,i,scale,centre)`, `carrot(x,y,s)`, `heart(x,y,s,colour,opacity)`,
  `sun(t,x,y)`, `moon(x,y)`, `cloud(x,y,s,opacity)`.
- Background: `bg(t, night 0..1, behindHills, {noSun, noFlowers})`.
- Text: `caption(text,lt,t0)`, `pop(text,x,y,size,fill,lt,t0,rot,stroke)`,
  `label(...)` for still text, `LULU` (the coloured name).

New characters and props are welcome: the cast should grow (cat, fish, turtle, owl, ladybird,
snail, tree, boat, stars and so on). Draw them in the same style and add them to `lib.js`
so later episodes can use them: flat shapes, no outlines, round bodies, small dark eyes with a
white highlight, pink cheeks, origin at the feet. Check a new character with `--stills` first.

### Things that went wrong before (avoid them)

- A jumping character rose into the words above it. Work out the top of the jump
  (`520 - height*scale - jumpHeight`) and keep it below the text, or move the text.
- Counting scenes: the background sun and the small background flowers get counted too.
  Use `bg(t,0,'',{noSun:true,noFlowers:true})` whenever children count things.
- Hearts or confetti drawn over faces look messy: draw them before the characters.
- Text on top of a cloud or the sun is hard to read: move one of them.

## episode.json

```json
{
  "number": 3, "slug": "short-name-with-dashes", "format": "learning|curious|story", "ages": "3-6",
  "title": "...", "description": "...",
  "duration": 45, "seed": 3, "lullaby_from": null,
  "sfx": [{"t": 5.3, "type": "pop"}],
  "check_times": [12.4, 30.1]
}
```

- `duration` must equal the last value of `SC`. `seed` picks the tune: use the episode number.
- `lullaby_from`: time when a slow bedtime ending starts (use the start of the night scene), or `null`.
- `sfx` types: `pop`, `ding`, `boing_low`, `boing_high`, `buzz`, `sparkle`. Place them on the
  exact moment of the action. Do not overdo it: 25 at most.
- `check_times`: extra moments to inspect, namely the top of every jump near text and the busiest frames.

## Build and check

```bash
python3 toolkit/make_video.py episodes/NNN-slug --stills 3,9.5,15   # quick look while writing
python3 toolkit/make_video.py episodes/NNN-slug                     # full build, about 2 minutes
```

Open **every** check sheet in `build/check/` and the thumbnail, and look for: overlapping or
cut-off text, characters covering words, anything off-screen, wrong counts or spelling,
a blank or broken frame. Read all on-screen text once more for spelling. Fix and rebuild until
it is clean. If it cannot be made clean, do not publish.

## Publish

Settings and IDs are in `channel.json`.

1. `bash toolkit/publish_media.sh episodes/NNN-slug` prints `VIDEO_URL=` and `THUMB_URL=`.
2. Run the Make scenario `publish_scenario_id` once with the Make tool `scenarios_run`
   (`responsive: true`) and data `{"video_url", "title", "description"}`. It uploads the video
   as public and "Made for Kids" and returns `videoId`.
   **Never run it twice for one episode.** If the run reports an error, first look at the
   execution (`executions_get-detail`) and search the channel (Make `rpc_execute`, app
   `youtube` version 4, rpc `searchVideos`, data `{"__IMTCONN__": youtube_connection_id,
   "channelId": "me", "q": "<title>"}`) to see whether the video is already there.
3. Only if `thumbnails_enabled` is true in `channel.json`: run `thumbnail_scenario_id` with
   `{"video_id", "thumbnail_url"}`. While it is false, skip this step (the channel is not
   verified yet and the call fails).
4. Add the episode to `episodes/log.json` (number, slug, format, ages, title, topic, cast,
   videoId, published date in Europe/Madrid), commit the episode folder and the log, and push
   to `main`. Build output is ignored by git; do not commit videos to `main`.

If a needed tool is missing, an approval is refused, or a step fails and cannot be fixed, stop
without publishing anything half-done and say clearly in the final message what failed.
Do not change `channel.json`, the Make scenarios or the schedule unless the owner asked for it.
