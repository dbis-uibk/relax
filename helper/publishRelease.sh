#!/usr/bin/env bash
# Publishes the build in dist/ to the gh-pages branch, which GitHub Pages serves.
# Replaces the whole branch content, leaving out the tests and the .gz files
# (GitHub Pages compresses responses itself). Never force-pushes.
#
# Usage: helper/publishRelease.sh "v0.38 Short description"

set -euo pipefail

message=${1:-}
if [[ ! $message =~ ^v[0-9] ]]; then
	echo 'usage: helper/publishRelease.sh "v0.38 Short description"' >&2
	exit 1
fi

cd "$(dirname "$0")/.."

if [[ ! -f dist/index.html ]]; then
	echo 'dist/index.html not found, create it with yarn build first' >&2
	exit 1
fi

site=$(mktemp -d)
trap 'git worktree remove --force "$site" 2>/dev/null || true; rm -rf "$site"' EXIT

git fetch --quiet --depth=1 origin gh-pages
git worktree add --quiet --detach "$site" FETCH_HEAD

git -C "$site" rm -rqf .
cp -R dist/. "$site/"
find "$site" -path "$site/.git" -prune -o -type f \( -name 'test.html*' -o -name 'tests.*' -o -name '*.gz' \) -exec rm {} +

git -C "$site" add -A
if git -C "$site" diff --cached --quiet; then
	echo 'gh-pages already contains this build, nothing to publish'
	exit 0
fi

git -C "$site" commit --quiet -m "$message"
git -C "$site" push --quiet origin HEAD:gh-pages
echo "published: $message"
