#!/usr/bin/env bash
# REF-082 남은 측정을 순서대로 돌린다. 겹치면 값이 흔들리므로 한 번에 하나씩.
# 자는 동안 돌리므로 스스로 복구한다.
# - 단계 로그가 10분 동안 늘지 않으면 멈춘 것으로 보고 죽인 뒤 다시 돌린다 (최대 3회)
# - 끝난 단계는 results/done-<단계> 표시를 남겨, 스크립트를 다시 실행하면 건너뛴다
set -u
P="$(cygpath -w ~/AppData/Local/npm-cache/_npx/668c188756b835f3/node_modules/)/"
R=results
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
    note "시작 $name ($attempt회차)"
    env "$@" > "$log" 2>&1 &
    local pid=$!
    local last_size=-1 idle=0
    while kill -0 "$pid" 2> /dev/null; do
      sleep 30
      local size
      size=$(wc -c < "$log")
      if [ "$size" = "$last_size" ]; then idle=$((idle + 30)); else idle=0; last_size=$size; fi
      if [ "$idle" -ge 600 ]; then
        note "멈춤 감지 $name — 10분간 출력 없음, 종료 후 재시도"
        kill "$pid" 2> /dev/null
        # 측정 node와 puppeteer가 띄운 chrome만 끈다. 사용자 Chrome은 건드리지 않는다.
        powershell -NoProfile -c "Get-CimInstance Win32_Process | Where-Object { \$_.CommandLine -match 'diagnose\.mjs|cls-nav\.mjs' -or (\$_.Name -eq 'chrome.exe' -and \$_.CommandLine -match 'puppeteer') } | ForEach-Object { Stop-Process -Id \$_.ProcessId -Force -ErrorAction SilentlyContinue }" > /dev/null 2>&1
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

note "=== 측정 시작 ==="
# 측정 동안만 절전 진입을 막는다. 이 스크립트가 끝나면 함께 끝나 설정은 바뀌지 않는다.
powershell -NoProfile -c "Add-Type -Name P -Namespace W -MemberDefinition '[DllImport(\"kernel32.dll\")] public static extern uint SetThreadExecutionState(uint f);'; [W.P]::SetThreadExecutionState(0x80000001) | Out-Null; while (\$true) { Start-Sleep 60 }" &
AWAKE_PID=$!
trap 'kill $AWAKE_PID 2> /dev/null' EXIT
# 1. 새로고침 + 응답 지연 600ms — 나머지 19개 화면 (스켈레톤 교체 CLS)
run_step cls-delay600-rest $R/log-cls-delay600-rest.txt \
  DELAY=600 MODE=load RUNS=3 \
  SCREENS=learning,chapter,unit,concept-note,friends,friend-search,lesson,lesson-result,bookmarked,incorrect,my-edit,notifications,onboarding,onboarding-success,settings,inquiry,inquiry-new,notice,notice-detail \
  node diagnose.mjs "$P" $R \
  && mv "$R"/diagnose-load-learning+chapter*.json $R/cls-delay600-load-rest.json
# my-social 1회가 멈춤 때문에 비정상이었다. 다시 잰다.
run_step cls-delay600-my-social $R/log-cls-delay600-my-social.txt \
  DELAY=600 MODE=load RUNS=3 SCREENS=my-social node diagnose.mjs "$P" $R \
  && mv $R/diagnose-load-my-social.json $R/cls-delay600-load-my-social.json
# 2. 앱 안 이동 CLS — 지연 0 / 600ms
run_step cls-nav-delay0 $R/cls-nav-delay0.txt DELAY=0 node cls-nav.mjs "$P"
run_step cls-nav-delay600 $R/cls-nav-delay600.txt DELAY=600 node cls-nav.mjs "$P"
# 3. 묶음 B · C 로딩 + INP (7회)
curl -s "http://localhost:4199/__control?delay=0" > /dev/null
for G in B C; do
  run_step load-$G $R/log-load-$G.txt GROUP=$G MODE=load RUNS=7 node diagnose.mjs "$P" $R
  run_step inp-$G $R/log-inp-$G.txt GROUP=$G MODE=inp RUNS=7 node diagnose.mjs "$P" $R
done
curl -s "http://localhost:4199/__control?delay=0" > /dev/null
note "=== 전체 끝 ==="
