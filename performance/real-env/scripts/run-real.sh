#!/usr/bin/env bash
# real-env 측정. ../../evidence/2026-11-11_ref082/run-mac.sh를 복사해 단계에 프로필과 응답 지연을 더했다.
# 겹치면 값이 흔들리므로 한 번에 하나씩 돌린다. 스스로 복구한다.
# - 단계 로그가 10분 동안 늘지 않으면 멈춘 것으로 보고 죽인 뒤 다시 돌린다 (최대 3회)
# - 끝난 단계는 results-mac/done-<단계> 표시를 남겨, 스크립트를 다시 실행하면 건너뛴다
# 단계 이름: <프로필>-<load|inp|cls>-<묶음>. cls는 MODE=load · DELAY=600 · RUNS=3 (런북 §2 CLS 예외)
# 사용: P=<puppeteer node_modules 절대 경로>/ [STEPS="ios-load-A"] [SCREENS=main] bash run-real.sh
set -u
P="${P:?P에 puppeteer node_modules 절대 경로를 넣는다}"
R="${R:-../results}"
DEFAULT_STEPS=""
for profile in ios mweb desktop; do
  for kind in load inp cls; do
    for group in A B C; do DEFAULT_STEPS="$DEFAULT_STEPS $profile-$kind-$group"; done
  done
done
STEPS="${STEPS:-$DEFAULT_STEPS}"
mkdir -p "$R"
PROGRESS=$R/progress.txt

note() { echo "$(date '+%H:%M:%S') $*" | tee -a "$PROGRESS"; }

# run_step <이름> <로그 파일> <명령...>
run_step() {
  local name=$1 log=$2
  shift 2
  if [ -f "$R/done-$name" ]; then
    note "건너뜀 $name (이미 끝남)"
    return 0
  fi
  for attempt in 1 2 3; do
    note "시작 $name (${attempt}회차)"
    env "$@" > "$log" 2>&1 &
    local pid=$!
    local last_size=-1 idle=0
    while kill -0 "$pid" 2> /dev/null; do
      sleep 30
      local size
      size=$(wc -c < "$log" | tr -d ' ')
      if [ "$size" = "$last_size" ]; then idle=$((idle + 30)); else idle=0; last_size=$size; fi
      if [ "$idle" -ge 600 ]; then
        note "멈춤 감지 $name — 10분간 출력 없음, 종료 후 재시도"
        kill "$pid" 2> /dev/null
        # 측정 node와 puppeteer가 띄운 chrome만 끈다. 사용자 Chrome은 건드리지 않는다.
        pkill -f 'diagnose.mjs|cls-nav.mjs' 2> /dev/null
        pkill -f 'puppeteer.*[Cc]hrome' 2> /dev/null
        break
      fi
    done
    wait "$pid" 2> /dev/null
    local code=$?
    if [ "$idle" -lt 600 ] && [ "$code" = 0 ]; then
      touch "$R/done-$name"
      note "완료 $name"
      return 0
    fi
    note "실패 $name (종료 코드 $code)"
  done
  note "포기 $name — 3회 모두 실패"
  return 1
}

note "=== 측정 시작 ($STEPS) ==="
# 측정 동안만 절전 진입을 막는다. 이 스크립트가 끝나면 caffeinate도 함께 끝난다.
caffeinate -dimsu -w $$ &
curl -s "http://localhost:4199/__control?delay=0" > /dev/null
for step in $STEPS; do
  IFS=- read -r profile kind group <<< "$step"
  if [ "$kind" = cls ]; then
    run_step "$step" "$R/log-$step.txt" PROFILE="$profile" GROUP="$group" MODE=load DELAY=600 RUNS=3 \
      ${SCREENS:+SCREENS=$SCREENS} node diagnose.mjs "$P" "$R"
  else
    run_step "$step" "$R/log-$step.txt" PROFILE="$profile" GROUP="$group" MODE="$kind" DELAY=0 RUNS="${RUNS:-7}" \
      ${SCREENS:+SCREENS=$SCREENS} node diagnose.mjs "$P" "$R"
  fi
done
curl -s "http://localhost:4199/__control?delay=0" > /dev/null
note "=== 전체 끝 ==="
