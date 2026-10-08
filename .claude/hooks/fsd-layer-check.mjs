#!/usr/bin/env node
/**
 * PreToolUse 가드 — Edit / Write / MultiEdit 직전에 실행된다.
 *
 * 세 가지를 차단한다.
 *   1. apps/legacy-web 편집        (참조 전용 · .claude/rules/legacy-web-policy.md)
 *   2. 자동 생성 파일 직접 수정     (orval / TanStack Router / generate:icons)
 *   3. FSD 레이어 위반 import       (상향 · cross-slice · 레이어를 넘는 상대경로)
 *
 * 설계 메모
 * - bash + jq 대신 Node 로 쓴 이유: 이 프로젝트는 Windows 다. jq 가 없으면 셸 훅은 통째로 죽는다.
 * - 이 훅은 **새로 쓰는 내용의 import 구문만** 본다. 기존 파일에 이미 있는 위반은 못 잡는다.
 *   그건 `pnpm --filter @repo/web lint:fsd` (steiger) 가 사후에 전수로 잡는다. 깊이 방어다.
 * - 내부 오류가 나면 **막지 않고 통과**시킨다(fail-open). 가드가 고장 났다고 모든 작업이
 *   멈추는 게 더 나쁘다. 대신 stderr 에 남겨 눈에 띄게 한다.
 */

import path from 'node:path';

/** apps/web/src 아래의 레이어. 숫자가 클수록 상위. 하위 → 상위 import 는 금지. */
const LAYERS = {
  shared: { num: 0, hasSlice: false },
  entities: { num: 1, hasSlice: true },
  features: { num: 2, hasSlice: true },
  widgets: { num: 3, hasSlice: true },
  pages: { num: 4, hasSlice: true },
  app: { num: 5, hasSlice: false },
};

/** 직접 수정하면 안 되는 자동 생성 산출물. [경로 조각, 재생성 명령] */
const GENERATED = [
  ['apps/web/src/shared/api/generated/', 'pnpm --filter @repo/web generate:api'],
  ['apps/web/src/app/routeTree.gen.ts', 'dev/build 시 자동 생성'],
  ['apps/web/src/shared/ui/icon/icons.generated.ts', 'pnpm generate:icons'],
];

const WEB_SRC = 'apps/web/src/';

function allow() {
  process.exit(0);
}

function deny(reason) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: reason,
      },
    }),
  );
  process.exit(0);
}

/** 경로를 저장소 기준 posix 형태로 정규화한다. */
function normalize(filePath) {
  const posix = filePath.replace(/\\/g, '/');
  const idx = posix.indexOf('/apps/');
  return idx === -1 ? posix.replace(/^\/+/, '') : posix.slice(idx + 1);
}

/**
 * apps/web/src 기준 경로에서 레이어와 슬라이스를 판정한다.
 * 레이어 밖(main.tsx, stories/ 등)이면 null.
 */
function locate(relPath) {
  const [layer, second] = relPath.split('/');
  const meta = LAYERS[layer];
  if (!meta) return null;
  return {
    layer,
    num: meta.num,
    slice: meta.hasSlice ? (second ?? null) : null,
  };
}

/** import 대상 문자열을 apps/web/src 기준 경로로 바꾼다. 외부 패키지면 null. */
function resolveTarget(spec, currentRelPath) {
  if (spec.startsWith('@/')) return spec.slice(2);
  if (spec.startsWith('.')) {
    const dir = path.posix.dirname(currentRelPath);
    return path.posix.normalize(path.posix.join(dir, spec));
  }
  return null; // 외부 패키지
}

/** 편집 내용에서 import 대상 목록을 뽑는다. */
function extractImports(content) {
  const specs = [];
  const patterns = [
    /\bfrom\s+['"]([^'"]+)['"]/g, // import x from '...' / export x from '...'
    /\bimport\s+['"]([^'"]+)['"]/g, // import '...' (side effect)
    /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g, // await import('...')
    /\brequire\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(content)) !== null) specs.push(m[1]);
  }
  return specs;
}

function main(input) {
  const toolInput = input.tool_input ?? {};
  const rawPath = toolInput.file_path;
  if (typeof rawPath !== 'string' || rawPath.length === 0) allow();

  const filePath = normalize(rawPath);

  // ── 1. legacy-web 편집 차단 ──────────────────────────────────────────────
  if (filePath.includes('apps/legacy-web/')) {
    deny(
      `apps/legacy-web 은 참조 전용입니다. 편집하지 마세요.\n` +
        `  · 워크스페이스에서 제외되어 있어 turbo 가 lint/build/check-types 를 돌리지 않습니다. 깨져도 CI 가 못 잡습니다.\n` +
        `  · 새 코드는 apps/web 에 씁니다. 이전 작업이면 work/ 에 MIG- 항목을 만드세요.\n` +
        `  · 정말 고쳐야 하면 사용자에게 확인을 받으세요. (.claude/rules/legacy-web-policy.md)`,
    );
  }

  // ── 2. 자동 생성 파일 차단 ──────────────────────────────────────────────
  for (const [fragment, howto] of GENERATED) {
    if (filePath.includes(fragment)) {
      deny(`자동 생성 파일은 직접 수정하지 않습니다: ${fragment}\n` + `  · 재생성 방법: ${howto}`);
    }
  }

  // ── 3. FSD 레이어 검사 (apps/web/src 의 ts/tsx 만) ───────────────────────
  if (!filePath.includes(WEB_SRC)) allow();
  if (!/\.(ts|tsx)$/.test(filePath)) allow();
  // 테스트는 다른 슬라이스를 참조하는 게 자연스러울 수 있어 검사 대상에서 뺀다.
  if (/\.test\.(ts|tsx)$/.test(filePath)) allow();

  const relPath = filePath.slice(filePath.indexOf(WEB_SRC) + WEB_SRC.length);
  const current = locate(relPath);
  if (!current) allow(); // main.tsx, stories/ 등 레이어 밖

  const content =
    toolInput.content ??
    toolInput.new_string ??
    (Array.isArray(toolInput.edits)
      ? toolInput.edits.map((e) => e?.new_string ?? '').join('\n')
      : '');
  if (typeof content !== 'string' || content.length === 0) allow();

  const violations = [];

  for (const spec of extractImports(content)) {
    const targetPath = resolveTarget(spec, relPath);
    if (!targetPath) continue;

    const target = locate(targetPath);
    if (!target) continue;

    if (target.num > current.num) {
      violations.push(
        `상향 import: ${current.layer}(${current.num}) → ${target.layer}(${target.num})   '${spec}'\n` +
          `    아래 레이어는 위 레이어를 참조할 수 없습니다. 공통이 필요하면 아래 레이어로 내리세요.`,
      );
      continue;
    }

    if (
      target.num === current.num &&
      current.slice &&
      target.slice &&
      current.slice !== target.slice
    ) {
      violations.push(
        `cross-slice import: ${current.layer}/${current.slice} → ${target.layer}/${target.slice}   '${spec}'\n` +
          `    같은 레이어의 다른 슬라이스를 직접 참조할 수 없습니다. 공통은 아래 레이어(shared 등)로 내리세요.`,
      );
      continue;
    }

    if (spec.startsWith('.') && target.layer !== current.layer) {
      violations.push(
        `레이어를 넘는 상대경로: '${spec}'\n` +
          `    다른 레이어는 '@/${target.layer}/...' 형태의 별칭으로 참조하세요.`,
      );
    }
  }

  if (violations.length > 0) {
    deny(
      `FSD 레이어 위반 — ${relPath}\n` +
        violations.map((v, i) => `  ${i + 1}. ${v}`).join('\n') +
        `\n\n레이어 방향: shared(0) → entities(1) → features(2) → widgets(3) → pages(4) → app(5)\n` +
        `상세: .claude/rules/ · CLAUDE.md 의 "FSD 아키텍처"`,
    );
  }

  allow();
}

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  raw += chunk;
});
process.stdin.on('end', () => {
  try {
    main(JSON.parse(raw || '{}'));
  } catch (error) {
    // 가드가 고장 났다고 작업 전체를 막지는 않는다. 대신 조용히 넘어가지도 않는다.
    process.stderr.write(`[fsd-layer-check] 훅 내부 오류로 검사를 건너뜁니다: ${error}\n`);
    process.exit(0);
  }
});
