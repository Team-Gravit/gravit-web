import expoConfigBase from 'eslint-config-expo/flat.js';
import eslintConfigPrettier from 'eslint-config-prettier';

/** @type {import('eslint').Linter.Config[]} */
export const expoConfig = [
  ...expoConfigBase,
  {
    ignores: ['dist/**', '.expo/**', 'android/**', 'ios/**'],
  },
  eslintConfigPrettier,
];
