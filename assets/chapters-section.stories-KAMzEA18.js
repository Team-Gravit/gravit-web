import{j as e}from"./iframe-D6zRJniE.js";import{C as m}from"./chapter-card-DX1ObA_Y.js";import{C as a}from"./card-bg-DJ9043vn.js";import"./preload-helper-DHFrVIEf.js";import"./index-lnR2ABT4.js";function u({chapters:s}){return e.jsxs(a,{children:[e.jsxs(a.Header,{children:[e.jsx(a.Title,{children:"새 주제 시작하기"}),e.jsx(a.Link,{to:"./",children:"전체 보기"})]}),e.jsx("div",{className:"w-full flex-1 grid grid-cols-2 gap-4",children:s.map(r=>e.jsx(m,{title:r.title,status:r.status,lessonNum:r.lessonNum,chapterId:r.id},r.id))})]})}u.__docgenInfo={description:"",methods:[],displayName:"ChaptersSection",props:{chapters:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
	id: number;
	title: string;
	status: "locked" | "unlocked";
	lessonNum: number;
}`,signature:{properties:[{key:"id",value:{name:"number",required:!0}},{key:"title",value:{name:"string",required:!0}},{key:"status",value:{name:"union",raw:'"locked" | "unlocked"',elements:[{name:"literal",value:'"locked"'},{name:"literal",value:'"unlocked"'}],required:!0}},{key:"lessonNum",value:{name:"number",required:!0}}]}}],raw:`{
	id: number;
	title: string;
	status: "locked" | "unlocked";
	lessonNum: number;
}[]`},description:""}}};const h={title:"Widgets/MainPage/ChaptersSection",component:u,parameters:{layout:"centered"},decorators:[s=>e.jsx("div",{className:"w-[720px]",children:e.jsx(s,{})})],tags:["autodocs"],argTypes:{chapters:{table:{disable:!0}}}},l=[{id:1,title:"변수와 자료형",status:"unlocked",lessonNum:1},{id:2,title:"조건문과 반복문",status:"unlocked",lessonNum:2},{id:3,title:"함수와 스코프",status:"locked",lessonNum:3},{id:4,title:"객체와 배열",status:"locked",lessonNum:4}],t={name:"기본",args:{chapters:l}},n={name:"전체 잠금 해제",args:{chapters:l.map(s=>({...s,status:"unlocked"}))}},o={name:"전체 잠김",args:{chapters:l.map(s=>({...s,status:"locked"}))}},c={name:"챕터 1개",args:{chapters:[l[0]]}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  name: "기본",
  args: {
    chapters: mockChapters
  }
}`,...t.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  name: "전체 잠금 해제",
  args: {
    chapters: mockChapters.map(c => ({
      ...c,
      status: "unlocked" as const
    }))
  }
}`,...n.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: "전체 잠김",
  args: {
    chapters: mockChapters.map(c => ({
      ...c,
      status: "locked" as const
    }))
  }
}`,...o.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: "챕터 1개",
  args: {
    chapters: [mockChapters[0]]
  }
}`,...c.parameters?.docs?.source}}};const C=["Default","AllUnlocked","AllLocked","SingleChapter"];export{o as AllLocked,n as AllUnlocked,t as Default,c as SingleChapter,C as __namedExportsOrder,h as default};
