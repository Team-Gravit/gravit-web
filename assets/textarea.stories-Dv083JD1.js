import{j as e,r as g}from"./iframe-C5rLq9m9.js";import{c as p}from"./cn-oknOcaYA.js";import{F as h}from"./field-label-O2TQOwP3.js";import"./preload-helper-DHFrVIEf.js";import"./clsx-B-dksMZM.js";function c(a){const{value:l,label:s,className:i,textareaClassName:u,labelClassName:x,id:m,...b}=a,f=s&&l&&l.trim().length>0;return e.jsxs("div",{className:p("bg-white flex flex-col  justify-start rounded-lg p-4 md:p-6 border border-divider-1 overflow-hidden",i),children:[f&&e.jsx(h,{id:m,className:x,label:s}),e.jsx("textarea",{id:m,value:l??"",...b,className:p("h-full w-full outline-none resize-none text-label1 md:text-headline2 ","placeholder:text-label1 md:placeholder:text-headline2 placeholder:text-text-4",u)})]})}c.__docgenInfo={description:"",methods:[],displayName:"TextArea",props:{value:{required:!1,tsType:{name:"string"},description:""},label:{required:!1,tsType:{name:"string"},description:""},className:{required:!1,tsType:{name:"string"},description:""},id:{required:!0,tsType:{name:"string"},description:""},textareaClassName:{required:!1,tsType:{name:"string"},description:""},labelClassName:{required:!1,tsType:{name:"string"},description:""}}};const N={title:"Components/Input/TextArea",component:c,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{label:{control:"text"},placeholder:{control:"text"},disabled:{control:"boolean"}},args:{id:"textarea",label:"내용",placeholder:"내용을 입력하세요",disabled:!1}};function r(a){const[l,s]=g.useState(a.value??"");return e.jsx(c,{...a,value:l,onChange:i=>s(i.target.value)})}const t={name:"기본 (빈 상태)",render:a=>e.jsx(r,{...a})},o={name:"값 입력됨 (라벨 표시)",render:a=>e.jsx(r,{...a,value:"텍스트"})},d={name:"비활성화",render:a=>e.jsx(r,{...a,value:"수정 불가 텍스트입니다.",disabled:!0})},n={name:"상태별",parameters:{controls:{disable:!0}},render:()=>e.jsxs("div",{className:"flex flex-col gap-4 w-[320px]",children:[e.jsx(r,{id:"empty",label:"내용",placeholder:"내용을 입력하세요"}),e.jsx(r,{id:"filled",label:"내용",placeholder:"내용을 입력하세요",value:"텍스트"}),e.jsx(r,{id:"disabled",label:"내용",placeholder:"내용을 입력하세요",value:"수정 불가 텍스트입니다.",disabled:!0})]})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  name: '기본 (빈 상태)',
  render: args => <ControlledTextarea {...args} />
}`,...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: '값 입력됨 (라벨 표시)',
  render: args => <ControlledTextarea {...args} value="텍스트" />
}`,...o.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: '비활성화',
  render: args => <ControlledTextarea {...args} value="수정 불가 텍스트입니다." disabled />
}`,...d.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  name: '상태별',
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <div className="flex flex-col gap-4 w-[320px]">
      <ControlledTextarea id="empty" label="내용" placeholder="내용을 입력하세요" />
      <ControlledTextarea id="filled" label="내용" placeholder="내용을 입력하세요" value="텍스트" />
      <ControlledTextarea id="disabled" label="내용" placeholder="내용을 입력하세요" value="수정 불가 텍스트입니다." disabled />
    </div>
}`,...n.parameters?.docs?.source}}};const S=["Default","WithValue","Disabled","AllStates"];export{n as AllStates,t as Default,d as Disabled,o as WithValue,S as __namedExportsOrder,N as default};
