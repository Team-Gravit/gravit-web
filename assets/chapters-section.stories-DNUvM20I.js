import{j as e}from"./iframe-DpgK7c53.js";import{U as d}from"./unit-card-CQd7iFHc.js";import{C as r}from"./card-CttwSoxv.js";import"./preload-helper-DHFrVIEf.js";import"./bg-card-CKqCdx7v.js";import"./index-B8k91cqS.js";import"./clsx-B-dksMZM.js";import"./cn-oknOcaYA.js";function c({units:i}){return e.jsxs(r,{children:[e.jsxs(r.Header,{children:[e.jsx(r.Title,{children:"새 주제 시작하기"}),e.jsx(r.Link,{to:"/learning",children:"전체 보기"})]}),e.jsx("div",{className:"w-full flex-1 grid grid-cols-2 gap-4",children:i.map(t=>e.jsx(d,{title:t.chapterTitle,lessonNum:t.unitId,chapterId:t.chapterId},t.unitId))})]})}c.__docgenInfo={description:"",methods:[],displayName:"RecommendedUnitsSection",props:{units:{required:!0,tsType:{name:"Array",elements:[{name:"RecommendedUnit"}],raw:"RecommendedUnit[]"},description:""}}};const I={title:"Widgets/MainPage/ChaptersSection",component:c,parameters:{layout:"centered"},decorators:[i=>e.jsx("div",{className:"w-[720px]",children:e.jsx(i,{})})],tags:["autodocs"],argTypes:{units:{table:{disable:!0}}}},o=[{unitId:1,unitTitle:"변수와 자료형",chapterId:1,chapterTitle:"프로그래밍 기초"},{unitId:2,unitTitle:"조건문과 반복문",chapterId:1,chapterTitle:"프로그래밍 기초"},{unitId:3,unitTitle:"함수와 스코프",chapterId:2,chapterTitle:"함수형 프로그래밍"},{unitId:4,unitTitle:"객체와 배열",chapterId:2,chapterTitle:"함수형 프로그래밍"}],n={name:"기본",args:{units:o}},s={name:"유닛 1개",args:{units:[o[0]]}},a={name:"유닛 4개",args:{units:o}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  name: '기본',
  args: {
    units: mockUnits
  }
}`,...n.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  name: '유닛 1개',
  args: {
    units: [mockUnits[0]]
  }
}`,...s.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  name: '유닛 4개',
  args: {
    units: mockUnits
  }
}`,...a.parameters?.docs?.source}}};const T=["Default","SingleUnit","ManyUnits"];export{n as Default,a as ManyUnits,s as SingleUnit,T as __namedExportsOrder,I as default};
