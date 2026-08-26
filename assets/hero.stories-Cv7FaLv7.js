import{j as e}from"./iframe-CkFatluG.js";import{S as p}from"./progress-ring-D3NNei9e.js";import{S as x}from"./Bronze1-liXW121M.js";import{L as c}from"./labeled-progress-ring-D31r4LYC.js";import{c as i}from"./cn-oknOcaYA.js";import"./preload-helper-DHFrVIEf.js";import"./clsx-B-dksMZM.js";const u="/gravit-web/assets/mobile-banner-B9ZqmRAy.png",g="/gravit-web/assets/pcBannerImage-C4ng6bpO.png";function a({children:t}){return e.jsxs("section",{className:"flex relative w-full h-[266px] md:h-[274px] overflow-hidden",children:[e.jsxs("picture",{className:"absolute inset-0 w-full h-full overflow-hidden z-0",children:[e.jsx("source",{media:"(max-width: 768px)",srcSet:u}),e.jsx("img",{src:g,className:"object-cover object-right h-full w-full",alt:"hero section background"})]}),e.jsx("div",{className:"block md:hidden pointer-events-none absolute inset-x-0 bottom-0 z-5 h-16 bg-gradient-to-t from-gray-200 to-transparent"}),t]})}function h({children:t,className:l,spacing:d="header-aligned"}){const m={"header-aligned":"md:px-19 md:pb-14 p-5 pb-12","content-padded":"max-w-300  mx-auto px-5 pb-12 pb-5 xl:px-0"};return e.jsx("div",{className:i("mt-auto z-10 w-full",m[d],l),children:t})}function b({children:t,className:l}){return e.jsx("div",{className:i("absolute top-0 left-0 p-5 z-10 w-full",l),children:t})}a.Content=h;a.Header=b;a.__docgenInfo={description:"",methods:[{name:"Content",docblock:null,modifiers:["static"],params:[{name:`{
  children,
  className,
  spacing = 'header-aligned',
}: {
  children: React.ReactNode;
  className?: string;
  spacing?: 'header-aligned' | 'content-padded';
}`,optional:!1,type:{name:"signature",type:"object",raw:`{
  children: React.ReactNode;
  className?: string;
  spacing?: 'header-aligned' | 'content-padded';
}`,signature:{properties:[{key:"children",value:{name:"ReactReactNode",raw:"React.ReactNode",required:!0}},{key:"className",value:{name:"string",required:!1}},{key:"spacing",value:{name:"union",raw:"'header-aligned' | 'content-padded'",elements:[{name:"literal",value:"'header-aligned'"},{name:"literal",value:"'content-padded'"}],required:!1}}]}}}],returns:null},{name:"Header",docblock:null,modifiers:["static"],params:[{name:"{ children, className }: { children: React.ReactNode; className?: string }",optional:!1,type:{name:"signature",type:"object",raw:"{ children: React.ReactNode; className?: string }",signature:{properties:[{key:"children",value:{name:"ReactReactNode",raw:"React.ReactNode",required:!0}},{key:"className",value:{name:"string",required:!1}}]}}}],returns:null}],displayName:"HeroSection",props:{children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};const R={title:"Shared/Ui/Hero/Hero",component:a,parameters:{layout:"fullscreen"},tags:["autodocs"]},s={render:()=>e.jsx(a,{children:e.jsxs(a.Content,{className:"text-white",children:[e.jsx("p",{className:"text-4xl  mb-2 font-semibold",children:"어서오세요, 땅콩님!"}),e.jsx("p",{className:"text-lg",children:"그래빗과 함께 CS 지식을 마스터해요!"})]})})},n={render:()=>e.jsx(a,{children:e.jsxs(a.Content,{spacing:"content-padded",className:"text-white",children:[e.jsx("p",{className:"text-4xl  mb-2 font-semibold",children:"어서오세요, 땅콩님!"}),e.jsx("p",{className:"text-lg",children:"그래빗과 함께 CS 지식을 마스터해요!"})]})})},r={name:"모바일",globals:{viewport:{value:"mobile2",isRotated:!1}},render:()=>e.jsx(a,{children:e.jsxs(a.Content,{spacing:"content-padded",className:"text-white",children:[e.jsx("p",{className:"text-3xl  mb-1 font-semibold",children:"어서오세요, 땅콩님!"}),e.jsx("p",{className:"text-lg",children:"그래빗과 함께 CS 지식을 마스터해요!"})]})})},o={name:"모바일 + 상단 컨텐츠",globals:{viewport:{value:"mobile2",isRotated:!1}},render:()=>e.jsxs(a,{children:[e.jsx(a.Header,{className:"text-white",children:e.jsxs("div",{className:"flex gap-4 items-center",children:[e.jsx(c,{content:e.jsx(p,{className:"size-8"}),value:60,label:"LV 1",size:"sm"}),e.jsx(c,{content:e.jsx(x,{className:"size-8"}),value:60,label:"브론즈 1"})]})}),e.jsxs(a.Content,{spacing:"content-padded",className:"text-white",children:[e.jsx("p",{className:"text-3xl  mb-1 font-semibold",children:"어서오세요, 땅콩님!"}),e.jsx("p",{className:"text-lg",children:"그래빗과 함께 CS 지식을 마스터해요!"})]})]})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <HeroSection>
      <HeroSection.Content className="text-white">
        <p className="text-4xl  mb-2 font-semibold">어서오세요, 땅콩님!</p>
        <p className="text-lg">그래빗과 함께 CS 지식을 마스터해요!</p>
      </HeroSection.Content>
    </HeroSection>
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <HeroSection>
      <HeroSection.Content spacing="content-padded" className="text-white">
        <p className="text-4xl  mb-2 font-semibold">어서오세요, 땅콩님!</p>
        <p className="text-lg">그래빗과 함께 CS 지식을 마스터해요!</p>
      </HeroSection.Content>
    </HeroSection>
}`,...n.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  name: '모바일',
  globals: {
    viewport: {
      value: 'mobile2',
      isRotated: false
    }
  },
  render: () => <HeroSection>
      <HeroSection.Content spacing="content-padded" className="text-white">
        <p className="text-3xl  mb-1 font-semibold">어서오세요, 땅콩님!</p>
        <p className="text-lg">그래빗과 함께 CS 지식을 마스터해요!</p>
      </HeroSection.Content>
    </HeroSection>
}`,...r.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: '모바일 + 상단 컨텐츠',
  globals: {
    viewport: {
      value: 'mobile2',
      isRotated: false
    }
  },
  render: () => <HeroSection>
      <HeroSection.Header className="text-white">
        <div className="flex gap-4 items-center">
          <LabeledProgressRing content={<Profile className="size-8" />} value={60} label="LV 1" size="sm" />
          <LabeledProgressRing content={<Bronze1 className="size-8" />} value={60} label="브론즈 1" />
        </div>
      </HeroSection.Header>
      <HeroSection.Content spacing="content-padded" className="text-white">
        <p className="text-3xl  mb-1 font-semibold">어서오세요, 땅콩님!</p>
        <p className="text-lg">그래빗과 함께 CS 지식을 마스터해요!</p>
      </HeroSection.Content>
    </HeroSection>
}`,...o.parameters?.docs?.source}}};const C=["Default","SpacingContentPadded","Mobile","MobileWithHeader"];export{s as Default,r as Mobile,o as MobileWithHeader,n as SpacingContentPadded,C as __namedExportsOrder,R as default};
