#!/usr/bin/env bash
# Put an episode's finished MP4 (and thumbnail) on the `media` branch so Make can download them.
# The branch always holds ONLY the latest episode (it is replaced each time), so the repository
# never grows with old videos. Prints the public download links.
#
#   toolkit/publish_media.sh episodes/NNN-slug
set -euo pipefail
EP="${1:?usage: toolkit/publish_media.sh episodes/NNN-slug}"
ROOT="$(git rev-parse --show-toplevel)"
SLUG="$(python3 -c "import json,sys;print(json.load(open(sys.argv[1]))['slug'])" "$EP/episode.json")"
ORIGIN="$(git -C "$ROOT" remote get-url origin)"
REPO_PATH="$(echo "$ORIGIN" | sed -E 's#^https://github.com/##; s#\.git$##')"
[ -f "$EP/build/$SLUG.mp4" ] || { echo "missing $EP/build/$SLUG.mp4 - run make_video.py first" >&2; exit 1; }

TMP="$(mktemp -d)"
cp "$EP/build/$SLUG.mp4" "$TMP/"
[ -f "$EP/build/$SLUG-thumb.png" ] && cp "$EP/build/$SLUG-thumb.png" "$TMP/"
cd "$TMP"
git init -q -b media
git add -A
git -c user.name="Lulu video bot" -c user.email="noreply@anthropic.com" commit -q -m "Media for $SLUG"
git remote add origin "$ORIGIN"
git push -q -f origin media
SHA="$(git rev-parse HEAD)"
echo "VIDEO_URL=https://raw.githubusercontent.com/$REPO_PATH/$SHA/$SLUG.mp4"
[ -f "$SLUG-thumb.png" ] && echo "THUMB_URL=https://raw.githubusercontent.com/$REPO_PATH/$SHA/$SLUG-thumb.png"
rm -rf "$TMP"
