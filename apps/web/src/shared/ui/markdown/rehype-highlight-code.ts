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
  언어 문법은 이 모듈을 처음 불러올 때 등록한다. 전체 언어 묶음 대신 필요한 문법만 가져온다.
  Vue SFC는 markup 별칭으로 처리한다.
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

/** 등록된 언어의 코드 블록을 문법별 span 요소로 나눈다. 색상은 CodeBlock에서 적용한다. */
export function rehypeHighlightCode() {
  return (tree: Root) => {
    visitElements(tree, (element) => {
      // 인라인 code는 그대로 두고, pre 안에 있는 코드 블록만 강조한다.
      if (element.tagName !== 'pre') {
        return;
      }

      const code = element.children.find(
        (child): child is Element => child.type === 'element' && child.tagName === 'code',
      );
      const language = code ? readLanguage(code) : undefined;

      // 언어 없는 도식이나 미지원 언어도 원문을 읽을 수 있도록 변환하지 않는다.
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
