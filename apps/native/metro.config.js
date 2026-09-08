const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// SDK 57의 on-demand filesystem이 감시 범위 밖 의존성도 읽는다.
// Windows에서 루트 node_modules 전체의 감시 준비가 시간 초과되는 것을 피한다.
config.watchFolders = config.watchFolders.filter(
  (folder) => !/[\\/]node_modules$/.test(folder) && !/[\\/]apps[\\/]legacy-web$/.test(folder),
);

const legacyWebPattern = /[\\/]apps[\\/]legacy-web(?:[\\/]|$)/;
// Windows fallback watcher는 절대 경로로 검사하므로 기본 상대 경로 패턴만으로는 부족하다.
const nativeBuildPattern = /[\\/]apps[\\/]native[\\/](?:android|ios)(?:[\\/]|$)/;

const defaultBlockList = config.resolver.blockList;
config.resolver.blockList = Array.isArray(defaultBlockList)
  ? [...defaultBlockList, legacyWebPattern, nativeBuildPattern]
  : [defaultBlockList, legacyWebPattern, nativeBuildPattern].filter(Boolean);

module.exports = config;
