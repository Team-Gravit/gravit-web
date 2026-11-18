#!/usr/bin/env bash
# AC-3: develop(기준)과 #350 빌드 시간을 3회씩 잰다. 매 회 imagetools 캐시를 지워 CI(빈 캐시)와 같게 한다.
set -u
S="$1"; ROOT="$2"; cd "$ROOT"
FILES="apps/web/vite.config.ts apps/web/src/vite-env.d.ts apps/web/src/pages/league/ui/league-page.tsx"
for f in $FILES; do mkdir -p "$S/backup/$(dirname $f)"; cp "$f" "$S/backup/$f"; done
measure() {
  for i in 1 2 3; do
    rm -rf node_modules/.cache/imagetools apps/web/node_modules/.cache/imagetools
    s=$(date +%s.%N); pnpm --filter @repo/web build >/dev/null 2>&1; rc=$?; e=$(date +%s.%N)
    echo "$1 run$i rc=$rc $(awk "BEGIN{printf \"%.1f\", $e - $s}")s" | tee -a "$S/result.txt"
  done
}
: > "$S/result.txt"
for f in $FILES; do git show "HEAD:$f" > "$f"; done
measure base
for f in $FILES; do cp "$S/backup/$f" "$f"; done
measure new
git diff --stat -- $FILES | tail -1 | tee -a "$S/result.txt"
