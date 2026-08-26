import{j as e,r as f}from"./iframe-D7_fNYdL.js";import{c as u}from"./cn-oknOcaYA.js";import{F as h}from"./field-label-CyC1JQVH.js";import"./preload-helper-DHFrVIEf.js";import"./clsx-B-dksMZM.js";function p(a){const{value:l,label:s,className:i,id:c,inputClassName:m,labelClassName:x,...b}=a,g=s&&l&&l.trim().length>0;return e.jsxs("div",{className:u("bg-white h-[54px] md:h-[74px] flex flex-col justify-center rounded-lg px-4 md:px-6 py-2.5 border border-divider-1",i),children:[g&&e.jsx(h,{id:c,className:x,label:s}),e.jsx("input",{id:c,value:l??"",...b,className:u("w-full outline-none text-label1 md:text-headline2","placeholder:text-label1 md:placeholder:text-headline2 placeholder:text-text-4",m)})]})}p.__docgenInfo={description:"",methods:[],displayName:"Input",props:{value:{required:!1,tsType:{name:"string"},description:""},label:{required:!1,tsType:{name:"string"},description:""},className:{required:!1,tsType:{name:"string"},description:""},id:{required:!0,tsType:{name:"string"},description:""},inputClassName:{required:!1,tsType:{name:"string"},description:""},labelClassName:{required:!1,tsType:{name:"string"},description:""}}};const N={title:"Components/Input/Input",component:p,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{label:{control:"text"},placeholder:{control:"text"},disabled:{control:"boolean"}},args:{id:"input",label:"제목",placeholder:"제목을 입력하세요",disabled:!1}};function r(a){const[l,s]=f.useState(a.value??"");return e.jsx(p,{...a,value:l,onChange:i=>s(i.target.value)})}const t={name:"기본 (빈 상태)",render:a=>e.jsx(r,{...a})},o={name:"값 입력됨 (라벨 표시)",render:a=>e.jsx(r,{...a,value:"텍스트"})},d={name:"비활성화",render:a=>e.jsx(r,{...a,value:"수정 불가 텍스트",disabled:!0})},n={name:"상태별",parameters:{controls:{disable:!0}},render:()=>e.jsxs("div",{className:"flex flex-col gap-4 w-[320px]",children:[e.jsx(r,{id:"empty",label:"제목",placeholder:"제목을 입력하세요"}),e.jsx(r,{id:"filled",label:"제목",placeholder:"제목을 입력하세요",value:"텍스트"}),e.jsx(r,{id:"disabled",label:"제목",placeholder:"제목을 입력하세요",value:"수정 불가 텍스트",disabled:!0})]})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  name: '기본 (빈 상태)',
  render: args => <ControlledInput {...args} />
}`,...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: '값 입력됨 (라벨 표시)',
  render: args => <ControlledInput {...args} value="텍스트" />
}`,...o.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: '비활성화',
  render: args => <ControlledInput {...args} value="수정 불가 텍스트" disabled />
}`,...d.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  name: '상태별',
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <div className="flex flex-col gap-4 w-[320px]">
      <ControlledInput id="empty" label="제목" placeholder="제목을 입력하세요" />
      <ControlledInput id="filled" label="제목" placeholder="제목을 입력하세요" value="텍스트" />
      <ControlledInput id="disabled" label="제목" placeholder="제목을 입력하세요" value="수정 불가 텍스트" disabled />
    </div>
}`,...n.parameters?.docs?.source}}};const S=["Default","WithValue","Disabled","AllStates"];export{n as AllStates,t as Default,d as Disabled,o as WithValue,S as __namedExportsOrder,N as default};
