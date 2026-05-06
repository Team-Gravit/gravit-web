import{j as a}from"./iframe-D6zRJniE.js";import{C as n}from"./chapter-card-DX1ObA_Y.js";import"./preload-helper-DHFrVIEf.js";import"./card-bg-DJ9043vn.js";import"./index-lnR2ABT4.js";const p={title:"Features/Learning/ChapterCard",component:n,parameters:{layout:"centered"},decorators:[o=>a.jsx("div",{className:"w-[368px]",children:a.jsx(o,{})})],tags:["autodocs"],argTypes:{title:{control:"text",description:"챕터 제목"},lessonNum:{control:"number",description:"레슨 번호"},status:{control:"radio",options:["locked","unlocked"],description:"잠금 여부",table:{type:{summary:"'locked' | 'unlocked'"},defaultValue:{summary:"unlocked"}}}}},e={name:"잠금 해제",args:{title:"변수와 자료형",lessonNum:1,status:"unlocked",chapterId:1}},s={name:"잠김",args:{title:"조건문과 반복문",lessonNum:2,status:"locked",chapterId:2}},t={name:"긴 제목",args:{title:"객체 지향 프로그래밍의 핵심 개념 이해하기",lessonNum:10,status:"unlocked",chapterId:3}},r={name:"높은 레슨 번호",args:{title:"심화 알고리즘",lessonNum:99,status:"locked",chapterId:4}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "잠금 해제",
  args: {
    title: "변수와 자료형",
    lessonNum: 1,
    status: "unlocked",
    chapterId: 1
  }
}`,...e.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  name: "잠김",
  args: {
    title: "조건문과 반복문",
    lessonNum: 2,
    status: "locked",
    chapterId: 2
  }
}`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  name: "긴 제목",
  args: {
    title: "객체 지향 프로그래밍의 핵심 개념 이해하기",
    lessonNum: 10,
    status: "unlocked",
    chapterId: 3
  }
}`,...t.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  name: "높은 레슨 번호",
  args: {
    title: "심화 알고리즘",
    lessonNum: 99,
    status: "locked",
    chapterId: 4
  }
}`,...r.parameters?.docs?.source}}};const i=["Unlocked","Locked","LongTitle","HighLessonNum"];export{r as HighLessonNum,s as Locked,t as LongTitle,e as Unlocked,i as __namedExportsOrder,p as default};
