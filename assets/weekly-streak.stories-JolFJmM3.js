import{j as o}from"./iframe-CMcfv20_.js";import{D as m}from"./day-badge-CaW3at-x.js";import"./preload-helper-DHFrVIEf.js";import"./cn-NikRBbYi.js";import"./clsx-B-dksMZM.js";import"./index-B8k91cqS.js";const c=["월","화","수","목","금","토","일"];function s(){const n=(new Date().getDay()+6)%7,l=(e,t)=>e===t?"today":e<t?"completed":"upcoming";return o.jsx("ul",{className:"flex gap-3 md:gap-2",children:c.map((e,t)=>o.jsx("li",{children:o.jsx(m,{label:e,status:l(t,n)})},e))})}s.__docgenInfo={description:"",methods:[],displayName:"WeeklyStreak"};const S={title:"Shared/UI/WeeklyStreak/WeeklyStreak",component:s,tags:["autodocs"],parameters:{layout:"centered"}},a={},r={name:"모바일",globals:{viewport:{value:"mobile2",isRotated:!1}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:"{}",...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  name: "모바일",
  globals: {
    viewport: {
      value: "mobile2",
      isRotated: false
    }
  }
}`,...r.parameters?.docs?.source}}};const k=["Default","Mobile"];export{a as Default,r as Mobile,k as __namedExportsOrder,S as default};
