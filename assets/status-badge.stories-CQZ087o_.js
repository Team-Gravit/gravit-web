import{j as c}from"./iframe-D6zRJniE.js";import{c as l}from"./index-lnR2ABT4.js";import"./preload-helper-DHFrVIEf.js";const u=l("inline-flex items-center rounded-full font-medium",{variants:{status:{completed:"bg-white border border-main-1 text-main-1",inProgress:"bg-main-1 text-white",notStarted:"bg-white border border-[#C6C6C6] text-[#A8A8A8]"},size:{sm:"px-3 py-0.5 text-xs",md:"px-4 py-1 text-base",lg:"px-5 py-2 text-lg"}},defaultVariants:{size:"md"}});function o({status:m,size:i="md",text:d}){return c.jsx("span",{className:u({status:m,size:i}),children:d})}o.__docgenInfo={description:"",methods:[],displayName:"StatusBadge",props:{status:{required:!0,tsType:{name:"union",raw:'"completed" | "inProgress" | "notStarted"',elements:[{name:"literal",value:'"completed"'},{name:"literal",value:'"inProgress"'},{name:"literal",value:'"notStarted"'}]},description:""},size:{required:!1,tsType:{name:"union",raw:'"sm" | "md" | "lg"',elements:[{name:"literal",value:'"sm"'},{name:"literal",value:'"md"'},{name:"literal",value:'"lg"'}]},description:"",defaultValue:{value:'"md"',computed:!1}},text:{required:!1,tsType:{name:"string"},description:""}}};const S={title:"Shared/UI/Badge/StatusBadge",component:o,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{status:{control:"select",options:["completed","inProgress","notStarted"],description:"배지 상태",table:{type:{summary:"'completed' | 'inProgress' | 'notStarted'"}}},size:{control:"select",options:["sm","md","lg"],description:"배지 크기",table:{type:{summary:"'sm' | 'md' | 'lg'"},defaultValue:{summary:"md"}}},text:{control:"text",description:"배지에 표시할 텍스트"}}},e={name:"완료",args:{status:"completed",text:"완료"}},t={name:"진행중",args:{status:"inProgress",text:"진행중"}},s={name:"시작 전",args:{status:"notStarted",text:"시작 전"}},r={name:"크기 - sm",args:{status:"inProgress",size:"sm",text:"진행중"}},a={name:"크기 - md (기본)",args:{status:"inProgress",size:"md",text:"진행중"}},n={name:"크기 - lg",args:{status:"inProgress",size:"lg",text:"진행중"}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "완료",
  args: {
    status: "completed",
    text: "완료"
  }
}`,...e.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  name: "진행중",
  args: {
    status: "inProgress",
    text: "진행중"
  }
}`,...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  name: "시작 전",
  args: {
    status: "notStarted",
    text: "시작 전"
  }
}`,...s.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
}`,...a.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  name: "크기 - lg",
  args: {
    status: "inProgress",
    size: "lg",
    text: "진행중"
  }
}`,...n.parameters?.docs?.source}}};const z=["Completed","InProgress","NotStarted","SizeSmall","SizeMedium","SizeLarge"];export{e as Completed,t as InProgress,s as NotStarted,n as SizeLarge,a as SizeMedium,r as SizeSmall,z as __namedExportsOrder,S as default};
