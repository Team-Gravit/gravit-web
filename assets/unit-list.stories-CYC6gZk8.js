import{j as m}from"./iframe-B3vk0f3t.js";import{U as p}from"./unit-list-DRBiL5Nv.js";import"./preload-helper-DHFrVIEf.js";import"./unit-item-DDXrc1de.js";import"./cn-oknOcaYA.js";import"./clsx-B-dksMZM.js";import"./index-B8k91cqS.js";const i=["변수와 자료형","조건문과 반복문","함수와 스코프","배열과 객체","비동기 프로그래밍"],a=n=>i.map((c,o)=>({unitId:o+1,title:c,isCompleted:o<n})),C={component:p,tags:["autodocs"],parameters:{layout:"centered"},decorators:[n=>m.jsx("div",{className:"w-[480px]",children:m.jsx(n,{})})],argTypes:{units:{table:{disable:!0}}}},e={name:"시작 전",args:{units:a(0)}},s={name:"첫 번째 완료",args:{units:a(1)}},r={name:"절반 완료",args:{units:a(3)}},t={name:"전체 완료",args:{units:a(i.length)}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "시작 전",
  args: {
    units: makeUnits(0)
  }
}`,...e.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  name: "첫 번째 완료",
  args: {
    units: makeUnits(1)
  }
}`,...s.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  name: "절반 완료",
  args: {
    units: makeUnits(3)
  }
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  name: "전체 완료",
  args: {
    units: makeUnits(UNIT_TITLES.length)
  }
}`,...t.parameters?.docs?.source}}};const T=["AllNotStarted","FirstCompleted","MiddleCompleted","AllCompleted"];export{t as AllCompleted,e as AllNotStarted,s as FirstCompleted,r as MiddleCompleted,T as __namedExportsOrder,C as default};
