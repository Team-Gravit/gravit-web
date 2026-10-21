import path from 'node:path';

// 앱마다 eslint 설정이 따로 있고 루트에는 없다. 파일을 앱별로 나눠 각 앱 디렉터리에서 eslint를 돌린다.
const ESLINT_TARGETS = [
  { dir: 'apps/web', filter: '@repo/web' },
  { dir: 'apps/native', filter: '@repo/native' },
];
const LINTABLE_FILE = /\.(c|m)?[jt]sx?$/;

const quote = (files) => files.map((file) => `"${file}"`).join(' ');

/**
 * 커밋 직전 staged 파일만 빠르게 검사한다. 전체 검증(steiger · 타입 · 테스트 · 빌드)은 `pnpm verify`와 PR CI가 맡는다.
 * prettier가 먼저 포맷을 검사하고 eslint가 검사한다. 오류가 있으면 커밋을 중단한다.
 */
export default (stagedFiles) => {
  const relativeFiles = stagedFiles.map((file) =>
    path.relative(process.cwd(), file).replaceAll('\\', '/'),
  );

  // .prettierignore · .gitignore 대상(생성물 · legacy-web · work/done)은 prettier가 알아서 건너뛴다.
  const commands = [`prettier --check --ignore-unknown ${quote(stagedFiles)}`];

  for (const { dir, filter } of ESLINT_TARGETS) {
    const lintFiles = stagedFiles.filter(
      (_, index) =>
        relativeFiles[index].startsWith(`${dir}/`) && LINTABLE_FILE.test(relativeFiles[index]),
    );
    if (lintFiles.length > 0) {
      // --no-warn-ignored: eslint ignores에 걸린 생성물이 staged돼도 경고로 커밋을 막지 않게 한다.
      commands.push(
        `pnpm --filter ${filter} exec eslint --max-warnings=0 --no-warn-ignored ${quote(lintFiles)}`,
      );
    }
  }

  return commands;
};
