import{j as e}from"./iframe-B3vk0f3t.js";import{U as d}from"./unit-item-DDXrc1de.js";import"./preload-helper-DHFrVIEf.js";import"./cn-oknOcaYA.js";import"./clsx-B-dksMZM.js";import"./index-B8k91cqS.js";const S={component:d,tags:["autodocs"],parameters:{layout:"padded"},args:{unitId:1,unitTitle:"변수와 자료형",unitStatus:"notStarted"}},i=[r=>e.jsx("div",{className:"w-[480px]",children:e.jsx(r,{})})],t={name:"잠김",decorators:i},a={name:"진행 중",args:{unitStatus:"inProgress"},decorators:i},s={name:"완료",args:{unitStatus:"completed"},decorators:i},o={name:"긴 제목",args:{unitStatus:"inProgress",unitTitle:"함수형 프로그래밍의 핵심 개념과 실전 활용 방법 이해하기"},decorators:i},n={name:"모바일 (375px)",parameters:{layout:"fullscreen",viewport:{defaultViewport:"iphone6"}},decorators:[r=>e.jsx("div",{className:"p-4",children:e.jsx(r,{})})]},c={name:"데스크탑 (768px)",parameters:{layout:"fullscreen",viewport:{defaultViewport:"ipad"}},decorators:[r=>e.jsx("div",{className:"p-4",children:e.jsx(r,{})})]};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  name: "잠김",
  decorators: fixedWidth
}`,...t.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  name: "진행 중",
  args: {
    unitStatus: "inProgress"
  },
  decorators: fixedWidth
}`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  name: "완료",
  args: {
    unitStatus: "completed"
  },
  decorators: fixedWidth
}`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: "긴 제목",
  args: {
    unitStatus: "inProgress",
    unitTitle: "함수형 프로그래밍의 핵심 개념과 실전 활용 방법 이해하기"
  },
  decorators: fixedWidth
}`,...o.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  name: "모바일 (375px)",
  parameters: {
    layout: "fullscreen",
    viewport: {
      defaultViewport: "iphone6"
    }
  },
  decorators: [(Story: React.ComponentType) => <div className="p-4">
                <Story />
            </div>]
}`,...n.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: "데스크탑 (768px)",
  parameters: {
    layout: "fullscreen",
    viewport: {
      defaultViewport: "ipad"
    }
  },
  decorators: [(Story: React.ComponentType) => <div className="p-4">
                <Story />
            </div>]
}`,...c.parameters?.docs?.source}}};const f=["NotStarted","InProgress","Completed","LongTitle","OnMobile","OnDesktop"];export{s as Completed,a as InProgress,o as LongTitle,t as NotStarted,c as OnDesktop,n as OnMobile,f as __namedExportsOrder,S as default};
