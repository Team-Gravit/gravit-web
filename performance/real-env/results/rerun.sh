# 재측정 목록. 사용: R=../results/rerunN bash ../results/rerun.sh  (scripts 폴더에서)
# SCREENS를 주면 묶음은 무시되므로 단계 이름의 묶음 글자는 X로 둔다.
set -u
run() { STEPS="$1" SCREENS="$2" bash run-real.sh; }
run desktop-inp-X "${DESKTOP_INP:-main,unit,league,my-summary,my-learning,lesson-result,incorrect,onboarding,settings,notice,notice-detail}"
run desktop-load-X "${DESKTOP_LOAD:-league}"
run desktop-cls-X "${DESKTOP_CLS:-main}"
run ios-inp-X "${IOS_INP:-main,learning,chapter,friend-search,lesson,lesson-result,bookmarked,incorrect,my-edit,onboarding,onboarding-success,notice}"
run mweb-inp-X "${MWEB_INP:-main,my-learning,lesson-result,incorrect,inquiry,notice}"
