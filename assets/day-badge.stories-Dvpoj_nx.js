import{D as o}from"./day-badge-DwX9pOj5.js";import"./iframe-B3vk0f3t.js";import"./preload-helper-DHFrVIEf.js";import"./cn-oknOcaYA.js";import"./clsx-B-dksMZM.js";import"./index-B8k91cqS.js";const d={title:"Shared/UI/Badge/DayBadge",component:o,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{status:{control:"select",options:["completed","today","upcoming"],description:"배지 상태",table:{type:{summary:"'completed' | 'today' | 'upcoming'"}}},label:{control:"text",description:"배지 라벨"}},args:{label:"월",status:"completed"}},e={args:{status:"today"}},t={args:{status:"completed"}},a={args:{status:"upcoming"}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    status: "today"
  }
}`,...e.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    status: "completed"
  }
}`,...t.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    status: "upcoming"
  }
}`,...a.parameters?.docs?.source}}};const u=["Today","Completed","Upcoming"];export{t as Completed,e as Today,a as Upcoming,u as __namedExportsOrder,d as default};
