import{j as a}from"./iframe-CUQCihjp.js";import{D as i}from"./day-badge-WSdVQ41L.js";import"./preload-helper-DHFrVIEf.js";import"./cn-oknOcaYA.js";import"./clsx-B-dksMZM.js";import"./index-B8k91cqS.js";const m=["월","화","수","목","금","토","일"],p=["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"];function s({weeklyRecord:n}){const o=(new Date().getDay()+6)%7,l=e=>e===o?"today":e<o&&n?.[p[e]]?"completed":"upcoming";return a.jsx("ul",{className:"flex gap-3 md:gap-2",children:m.map((e,c)=>a.jsx("li",{children:a.jsx(i,{label:e,status:l(c)})},e))})}s.__docgenInfo={description:"",methods:[],displayName:"WeeklyStreak",props:{weeklyRecord:{required:!1,tsType:{name:"WeeklyLearningRecordResponse"},description:""}}};const y={title:"Shared/UI/WeeklyStreak/WeeklyStreak",component:s,tags:["autodocs"],parameters:{layout:"centered"}},t={},r={name:"모바일",globals:{viewport:{value:"mobile2",isRotated:!1}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:"{}",...t.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  name: "모바일",
  globals: {
    viewport: {
      value: "mobile2",
      isRotated: false
    }
  }
}`,...r.parameters?.docs?.source}}};const k=["Default","Mobile"];export{t as Default,r as Mobile,k as __namedExportsOrder,y as default};
