import{j as p}from"./iframe-CMcfv20_.js";import{U as d}from"./unit-list-DZlDwHcJ.js";import"./preload-helper-DHFrVIEf.js";import"./unit-item-Ck8M76WL.js";import"./cn-NikRBbYi.js";import"./clsx-B-dksMZM.js";import"./status-badge-EBunLQwW.js";import"./index-B8k91cqS.js";const c=["변수와 자료형","조건문과 반복문","함수와 스코프","배열과 객체","비동기 프로그래밍"],o=s=>c.map((m,i)=>({id:i+1,title:m,status:s===null||i<s?"completed":i===s?"inProgress":"notStarted"})),N={component:d,tags:["autodocs"],parameters:{layout:"centered"},decorators:[s=>p.jsx("div",{className:"w-[480px]",children:p.jsx(s,{})})],argTypes:{units:{table:{disable:!0}}}},r={name:"시작 전",args:{units:c.map((s,m)=>({id:m+1,title:s,status:"notStarted"}))}},e={name:"첫 번째 유닛 진행 중",args:{units:o(0)}},t={name:"중간 유닛 진행 중",args:{units:o(2)}},a={name:"마지막 유닛 진행 중",args:{units:o(c.length-1)}},n={name:"전체 완료",args:{units:o(null)}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  name: "시작 전",
  args: {
    units: UNIT_TITLES.map((title, i) => ({
      id: i + 1,
      title,
      status: "notStarted"
    }))
  }
}`,...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "첫 번째 유닛 진행 중",
  args: {
    units: makeUnits(0)
  }
}`,...e.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  name: "중간 유닛 진행 중",
  args: {
    units: makeUnits(2)
  }
}`,...t.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  name: "마지막 유닛 진행 중",
  args: {
    units: makeUnits(UNIT_TITLES.length - 1)
  }
}`,...a.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  name: "전체 완료",
  args: {
    units: makeUnits(null)
  }
}`,...n.parameters?.docs?.source}}};const k=["AllNotStarted","FirstInProgress","MiddleInProgress","LastInProgress","AllCompleted"];export{n as AllCompleted,r as AllNotStarted,e as FirstInProgress,a as LastInProgress,t as MiddleInProgress,k as __namedExportsOrder,N as default};
