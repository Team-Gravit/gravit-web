// REF-054 #355 티어 아이콘 SVG 정리용 일회성 설정. 모양을 바꾸지 않는 선에서 줄인다.
export default {
  multipass: true,
  floatPrecision: 2,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          // <img src>로만 쓰여 id 충돌은 없지만, 그라데이션 참조를 그대로 두려고 id 정리는 줄이기만 한다
          cleanupIds: { minify: true, remove: true },
        },
      },
    },
  ],
};
