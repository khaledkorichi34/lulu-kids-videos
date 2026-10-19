#!/usr/bin/env bash
# Make a vertical 1080x1920 copy of an episode's MP4 for TikTok (the 16:9 video centred on a
# blurred copy of itself) and put it on the `tiktok-media` branch so Metricool can download it.
# The branch always holds ONLY the latest TikTok video (replaced each time). Prints the link.
#
#   toolkit/publish_tiktok_media.sh episodes/NNN-slug
set -euo pipefail
EP="${1:?usage: toolkit/publish_tiktok_media.sh episodes/NNN-slug}"
ROOT="$(git rev-parse --show-toplevel)"
SLUG="$(python3 -c "import json,sys;print(json.load(open(sys.argv[1]))['slug'])" "$EP/episode.json")"
ORIGIN="$(git -C "$ROOT" remote get-url origin)"
REPO_PATH="$(echo "$ORIGIN" | sed -E 's#^https://github.com/##; s#\.git$##')"
SRC="$EP/build/$SLUG.mp4"
[ -f "$SRC" ] || { echo "missing $SRC - run make_video.py first" >&2; exit 1; }

TMP="$(mktemp -d)"
OUT="$TMP/$SLUG-vertical.mp4"
ffmpeg -y -v error -i "$SRC" -filter_complex \
  "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=30:5,eq=brightness=-0.05[bg];[0:v]scale=1080:-2[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2" \
  -c:v libx264 -preset medium -crf 21 -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart "$OUT"
cd "$TMP"
git init -q -b tiktok-media
git add -A
git -c user.name="Lulu video bot" -c user.email="noreply@anthropic.com" commit -q -m "TikTok media for $SLUG"
git remote add origin "$ORIGIN"
git push -q -f origin tiktok-media
SHA="$(git rev-parse HEAD)"
echo "TIKTOK_VIDEO_URL=https://raw.githubusercontent.com/$REPO_PATH/$SHA/$SLUG-vertical.mp4"
rm -rf "$TMP"
