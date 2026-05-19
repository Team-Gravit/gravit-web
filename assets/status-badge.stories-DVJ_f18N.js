import{S as n}from"./status-badge-EBunLQwW.js";import"./iframe-CMcfv20_.js";import"./preload-helper-DHFrVIEf.js";import"./index-B8k91cqS.js";import"./clsx-B-dksMZM.js";const g={title:"Shared/UI/Badge/StatusBadge",component:n,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{status:{control:"select",options:["completed","inProgress","notStarted"],description:"배지 상태",table:{type:{summary:"'completed' | 'inProgress' | 'notStarted'"}}},size:{control:"select",options:["sm","md","lg"],description:"배지 크기",table:{type:{summary:"'sm' | 'md' | 'lg'"},defaultValue:{summary:"md"}}},text:{control:"text",description:"배지에 표시할 텍스트"}}},e={name:"완료",args:{status:"completed",text:"완료"}},s={name:"진행중",args:{status:"inProgress",text:"진행중"}},t={name:"시작 전",args:{status:"notStarted",text:"시작 전"}},r={name:"크기 - sm",args:{status:"inProgress",size:"sm",text:"진행중"}},a={name:"크기 - md (기본)",args:{status:"inProgress",size:"md",text:"진행중"}},o={name:"크기 - lg",args:{status:"inProgress",size:"lg",text:"진행중"}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "완료",
  args: {
    status: "completed",
    text: "완료"
  }
}`,...e.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  name: "진행중",
  args: {
    status: "inProgress",
    text: "진행중"
  }
}`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  name: "시작 전",
  args: {
    status: "notStarted",
    text: "시작 전"
  }
}`,...t.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  name: "크기 - sm",
  args: {
    status: "inProgress",
    size: "sm",
    text: "진행중"
  }
}`,...r.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  name: "크기 - md (기본)",
  args: {
    status: "inProgress",
    size: "md",
    text: "진행중"
  }
}`,...a.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: "크기 - lg",
  args: {
    status: "inProgress",
    size: "lg",
    text: "진행중"
  }
}`,...o.parameters?.docs?.source}}};const u=["Completed","InProgress","NotStarted","SizeSmall","SizeMedium","SizeLarge"];export{e as Completed,s as InProgress,t as NotStarted,o as SizeLarge,a as SizeMedium,r as SizeSmall,u as __namedExportsOrder,g as default};
