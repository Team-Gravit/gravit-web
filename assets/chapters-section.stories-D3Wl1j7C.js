import{j as e}from"./iframe-CMcfv20_.js";import{C as u}from"./chapter-card-DIewirSL.js";import{C as t}from"./card-Bp5xzzr-.js";import"./preload-helper-DHFrVIEf.js";import"./card-bg-BDvUrx1B.js";import"./cn-NikRBbYi.js";import"./clsx-B-dksMZM.js";import"./index-B8k91cqS.js";function m({chapters:s}){return e.jsxs(t,{children:[e.jsxs(t.Header,{children:[e.jsx(t.Title,{children:"새 주제 시작하기"}),e.jsx(t.Link,{to:"./",children:"전체 보기"})]}),e.jsx("div",{className:"w-full flex-1 grid grid-cols-2 gap-4",children:s.map(r=>e.jsx(u,{title:r.title,status:r.status,lessonNum:r.lessonNum,chapterId:r.id},r.id))})]})}m.__docgenInfo={description:"",methods:[],displayName:"ChaptersSection",props:{chapters:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
	id: number;
	title: string;
	status: "locked" | "unlocked";
	lessonNum: number;
}`,signature:{properties:[{key:"id",value:{name:"number",required:!0}},{key:"title",value:{name:"string",required:!0}},{key:"status",value:{name:"union",raw:'"locked" | "unlocked"',elements:[{name:"literal",value:'"locked"'},{name:"literal",value:'"unlocked"'}],required:!0}},{key:"lessonNum",value:{name:"number",required:!0}}]}}],raw:`{
	id: number;
	title: string;
	status: "locked" | "unlocked";
	lessonNum: number;
}[]`},description:""}}};const N={title:"Widgets/MainPage/ChaptersSection",component:m,parameters:{layout:"centered"},decorators:[s=>e.jsx("div",{className:"w-[720px]",children:e.jsx(s,{})})],tags:["autodocs"],argTypes:{chapters:{table:{disable:!0}}}},l=[{id:1,title:"변수와 자료형",status:"unlocked",lessonNum:1},{id:2,title:"조건문과 반복문",status:"unlocked",lessonNum:2},{id:3,title:"함수와 스코프",status:"locked",lessonNum:3},{id:4,title:"객체와 배열",status:"locked",lessonNum:4}],a={name:"기본",args:{chapters:l}},n={name:"전체 잠금 해제",args:{chapters:l.map(s=>({...s,status:"unlocked"}))}},o={name:"전체 잠김",args:{chapters:l.map(s=>({...s,status:"locked"}))}},c={name:"챕터 1개",args:{chapters:[l[0]]}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  name: "기본",
  args: {
    chapters: mockChapters
  }
}`,...a.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
}`,...c.parameters?.docs?.source}}};const j=["Default","AllUnlocked","AllLocked","SingleChapter"];export{o as AllLocked,n as AllUnlocked,a as Default,c as SingleChapter,j as __namedExportsOrder,N as default};
