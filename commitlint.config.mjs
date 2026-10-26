/** @type {import('@commitlint/types').UserConfig} */
const config = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 제목은 한국어로 쓴다. 영어 대소문자 규칙은 의미가 없다.
    'subject-case': [0],
    // 본문에 표 · 경로 · URL이 들어가 한 줄이 길어지는 경우가 많다.
    'body-max-line-length': [0],
    'footer-max-line-length': [0],
  },
};

export default config;
