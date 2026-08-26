import{j as e}from"./iframe-CkFatluG.js";import{U as c}from"./unit-card-BAcuQMmg.js";import{C as a}from"./card-DRftWhn5.js";import"./preload-helper-DHFrVIEf.js";import"./bg-card-xfshpir8.js";import"./index-B8k91cqS.js";import"./clsx-B-dksMZM.js";import"./cn-oknOcaYA.js";import"./skeleton-BfEbqAs6.js";const l=2;function d({units:i=[],isLoading:m=!1}){return e.jsxs(a,{children:[e.jsxs(a.Header,{children:[e.jsx(a.Title,{children:"새 주제 시작하기"}),e.jsx(a.Link,{to:"/learning",children:"전체 보기"})]}),e.jsx("div",{className:"w-full flex-1 grid grid-cols-2 gap-4",children:m?Array.from({length:l}).map((t,p)=>e.jsx(c,{isLoading:!0},p)):i.map(t=>e.jsx(c,{title:t.chapterTitle,unitId:t.unitId,chapterId:t.chapterId},t.unitId))})]})}d.__docgenInfo={description:"",methods:[],displayName:"RecommendedUnitsList",props:{units:{required:!1,tsType:{name:"Array",elements:[{name:"RecommendedUnit"}],raw:"RecommendedUnit[]"},description:"",defaultValue:{value:"[]",computed:!1}},isLoading:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};const y={title:"Widgets/MainPage/ChaptersSection",component:d,parameters:{layout:"centered"},decorators:[i=>e.jsx("div",{className:"w-[720px]",children:e.jsx(i,{})})],tags:["autodocs"],argTypes:{units:{table:{disable:!0}}}},o=[{unitId:1,unitTitle:"변수와 자료형",chapterId:1,chapterTitle:"프로그래밍 기초"},{unitId:2,unitTitle:"조건문과 반복문",chapterId:1,chapterTitle:"프로그래밍 기초"},{unitId:3,unitTitle:"함수와 스코프",chapterId:2,chapterTitle:"함수형 프로그래밍"},{unitId:4,unitTitle:"객체와 배열",chapterId:2,chapterTitle:"함수형 프로그래밍"}],r={name:"기본",args:{units:o}},s={name:"유닛 1개",args:{units:[o[0]]}},n={name:"유닛 4개",args:{units:o}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  name: '기본',
  args: {
    units: mockUnits
  }
}`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  name: '유닛 1개',
  args: {
    units: [mockUnits[0]]
  }
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  name: '유닛 4개',
  args: {
    units: mockUnits
  }
}`,...n.parameters?.docs?.source}}};const S=["Default","SingleUnit","ManyUnits"];export{r as Default,n as ManyUnits,s as SingleUnit,S as __namedExportsOrder,y as default};
