module.exports = {
  extends: ['@tanstack/eslint-plugin-query/recommended'],
  rules: {
    '@tanstack/query/exhaustive-deps': 'error', // 쿼리 의존성 검사
    '@tanstack/query/stable-query-client': 'error' // 쿼리 클라이언트 안정성
  }
}