import type { Element, ElementContent, Root } from 'hast';
import { refractor } from 'refractor/core';
import bash from 'refractor/bash';
import css from 'refractor/css';
import docker from 'refractor/docker';
import graphql from 'refractor/graphql';
import http from 'refractor/http';
import java from 'refractor/java';
import javascript from 'refractor/javascript';
import json from 'refractor/json';
import kotlin from 'refractor/kotlin';
import markup from 'refractor/markup';
import nginx from 'refractor/nginx';
import properties from 'refractor/properties';
import python from 'refractor/python';
import sql from 'refractor/sql';
import swift from 'refractor/swift';
import tsx from 'refractor/tsx';
import typescript from 'refractor/typescript';
import yaml from 'refractor/yaml';

/*
  개념노트에서 사용하는 언어만 등록해 번들 크기를 제한한다.
  Vue SFC는 markup 별칭으로 처리하고, 미지원 언어와 ASCII 도식은 원문으로 표시한다.
*/
[
  markup,
  css,
  javascript,
  typescript,
  tsx,
  python,
  java,
  kotlin,
  swift,
  sql,
  bash,
  json,
  yaml,
  http,
  properties,
  nginx,
  graphql,
  docker,
].forEach((language) => refractor.register(language));
refractor.alias({ markup: ['vue'] });

const LANGUAGE_CLASS_PREFIX = 'language-';

/** 언어가 등록된 코드 블록을 Prism 토큰으로 변환하는 rehype 플러그인. */
export function rehypeHighlightCode() {
  return (tree: Root) => {
    visitElements(tree, (element) => {
      if (element.tagName !== 'pre') {
        return;
      }

      const code = element.children.find(
        (child): child is Element => child.type === 'element' && child.tagName === 'code',
      );
      const language = code ? readLanguage(code) : undefined;

      if (!code || !language || !refractor.registered(language)) {
        return;
      }

      code.children = refractor.highlight(readText(code), language).children as ElementContent[];
    });
  };
}

function readLanguage(code: Element): string | undefined {
  const classNames = code.properties.className;

  if (!Array.isArray(classNames)) {
    return undefined;
  }

  const languageClass = classNames.find(
    (className): className is string =>
      typeof className === 'string' && className.startsWith(LANGUAGE_CLASS_PREFIX),
  );

  return languageClass?.slice(LANGUAGE_CLASS_PREFIX.length);
}

function readText(node: Element | ElementContent): string {
  if (node.type === 'text') {
    return node.value;
  }

  if (node.type === 'element') {
    return node.children.map(readText).join('');
  }

  return '';
}

function visitElements(parent: Root | Element, visit: (element: Element) => void) {
  for (const child of parent.children) {
    if (child.type === 'element') {
      visit(child);
      visitElements(child, visit);
    }
  }
}
