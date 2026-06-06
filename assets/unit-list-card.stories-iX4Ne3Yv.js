import{r as _,j as r,L as N}from"./iframe-DpgK7c53.js";import{b as P,i as R}from"./button.variants-DVtoWReC.js";import{C as p}from"./card-CttwSoxv.js";import{L as W}from"./labeled-progress-bar-BrWljLQC.js";import{U as E}from"./unit-list-CW1Ux5KN.js";import{S as z}from"./scroll-area-CKzl6KEZ.js";import"./preload-helper-DHFrVIEf.js";import"./index-B8k91cqS.js";import"./clsx-B-dksMZM.js";import"./cn-oknOcaYA.js";import"./progress-bar-DM6bfB5O.js";import"./unit-item-aP2NbcPm.js";function U(e,t){const s={...e};for(const o of t)delete s[o];return s}const y=_.forwardRef(({className:e,target:t,rel:s,children:o,...a},c)=>{const I=t==="_blank"?s??"noopener noreferrer":s;if(a.display==="block"){const{variant:L,size:b}=a,w=U(a,["display","variant","size"]);return r.jsx(N,{ref:c,target:t,rel:I,className:P({variant:L,size:b,className:e}),...w,children:o})}const{variant:A,size:k}=a,C=U(a,["display","variant","size"]);return r.jsx(N,{ref:c,target:t,rel:I,className:R({variant:A,size:k,className:e}),...C,children:o})});y.displayName="LinkButton";y.__docgenInfo={description:"",methods:[],displayName:"LinkButton"};function v({units:e}){return r.jsx(z,{orientation:"vertical",className:"h-[232px] md:h-[184px]",viewportClassName:"px-3 md:px-5 pb-3 md:pb-5 overscroll-contain",children:r.jsx(E,{units:e})})}v.__docgenInfo={description:"",methods:[],displayName:"UnitListScrollArea",props:{units:{required:!0,tsType:{name:"Array",elements:[{name:"UnitProgress"}],raw:"UnitProgress[]"},description:""}}};function T({chapterId:e,chapterTitle:t,chapterProgressRate:s,units:o}){const a=o.find(c=>!c.isCompleted);return r.jsxs(p,{className:"px-0 md:px-0",children:[r.jsxs(p.Header,{className:"px-3 md:px-5",children:[r.jsx(p.Title,{children:"이어서 학습하기"}),a&&r.jsx(p.Link,{to:"/learning/$chapterId/$unitId",params:{chapterId:String(e),unitId:String(a.unitId)},children:"전체 학습화면 보기"})]}),r.jsx("div",{className:"w-full px-3 md:px-5",children:r.jsx(W,{label:t,value:s})}),r.jsx(v,{units:o}),r.jsx("div",{className:"w-full px-3 md:px-5",children:a&&r.jsx(y,{to:"/learning/$chapterId/$unitId",display:"block",params:{chapterId:String(e),unitId:String(a.unitId)},className:"",children:"이어서 학습하기"})})]})}T.__docgenInfo={description:"",methods:[],displayName:"UnitListCard",props:{chapterId:{required:!0,tsType:{name:"number"},description:""},chapterTitle:{required:!0,tsType:{name:"string"},description:""},chapterProgressRate:{required:!0,tsType:{name:"number"},description:""},units:{required:!0,tsType:{name:"Array",elements:[{name:"UnitProgress"}],raw:"UnitProgress[]"},description:""}}};const j=["변수와 자료형","조건문과 반복문","함수와 스코프","배열과 객체","비동기 프로그래밍"],B=["변수와 자료형","조건문과 반복문","함수와 스코프","배열과 객체","비동기 프로그래밍","클로저와 스코프 체인","프로토타입과 클래스","모듈 시스템","에러 핸들링","TypeScript 기초"],i=e=>j.map((t,s)=>({unitId:s+1,title:t,isCompleted:s<e})),n={chapterId:1,chapterTitle:"프로그래밍 기초",chapterProgressRate:40},Q={title:"Widgets/MainPage/UnitListCard",component:T,tags:["autodocs"],parameters:{layout:"padded"},argTypes:{units:{table:{disable:!0}}}},d=[e=>r.jsx("div",{className:"w-[480px]",children:r.jsx(e,{})})],l={name:"기본 (진행 중 포함)",args:{...n,units:i(2)},decorators:d},m={name:"시작 전",args:{...n,chapterProgressRate:0,units:i(0)},decorators:d},u={name:"첫 번째 완료",args:{...n,chapterProgressRate:20,units:i(1)},decorators:d},g={name:"전체 완료",args:{...n,chapterProgressRate:100,units:i(j.length)},decorators:d},f={name:"유닛 1개",args:{...n,units:[{unitId:1,title:"변수와 자료형",isCompleted:!1}]},decorators:d},x={name:"스크롤 (유닛 10개)",args:{...n,units:B.map((e,t)=>({unitId:t+1,title:e,isCompleted:t<3}))},decorators:d},h={name:"모바일 (375px)",parameters:{layout:"fullscreen",viewport:{defaultViewport:"iphone6"}},decorators:[e=>r.jsx("div",{className:"p-4",children:r.jsx(e,{})})],args:{...n,units:i(2)}},S={name:"데스크탑 (768px)",parameters:{layout:"fullscreen",viewport:{defaultViewport:"ipad"}},decorators:[e=>r.jsx("div",{className:"p-4",children:r.jsx(e,{})})],args:{...n,units:i(2)}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  name: '기본 (진행 중 포함)',
  args: {
    ...defaultArgs,
    units: makeUnits(2)
  },
  decorators: fixedWidth
}`,...l.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: '시작 전',
  args: {
    ...defaultArgs,
    chapterProgressRate: 0,
    units: makeUnits(0)
  },
  decorators: fixedWidth
}`,...m.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  name: '첫 번째 완료',
  args: {
    ...defaultArgs,
    chapterProgressRate: 20,
    units: makeUnits(1)
  },
  decorators: fixedWidth
}`,...u.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: '전체 완료',
  args: {
    ...defaultArgs,
    chapterProgressRate: 100,
    units: makeUnits(UNIT_TITLES.length)
  },
  decorators: fixedWidth
}`,...g.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: '유닛 1개',
  args: {
    ...defaultArgs,
    units: [{
      unitId: 1,
      title: '변수와 자료형',
      isCompleted: false
    }]
  },
  decorators: fixedWidth
}`,...f.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: '스크롤 (유닛 10개)',
  args: {
    ...defaultArgs,
    units: MANY_UNIT_TITLES.map((title, i) => ({
      unitId: i + 1,
      title,
      isCompleted: i < 3
    }))
  },
  decorators: fixedWidth
}`,...x.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  name: '모바일 (375px)',
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'iphone6'
    }
  },
  decorators: [(Story: React.ComponentType) => <div className="p-4">
        <Story />
      </div>],
  args: {
    ...defaultArgs,
    units: makeUnits(2)
  }
}`,...h.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  name: '데스크탑 (768px)',
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'ipad'
    }
  },
  decorators: [(Story: React.ComponentType) => <div className="p-4">
        <Story />
      </div>],
  args: {
    ...defaultArgs,
    units: makeUnits(2)
  }
}`,...S.parameters?.docs?.source}}};const X=["Default","AllNotStarted","FirstCompleted","AllCompleted","SingleUnit","Scrollable","OnMobile","OnDesktop"];export{g as AllCompleted,m as AllNotStarted,l as Default,u as FirstCompleted,S as OnDesktop,h as OnMobile,x as Scrollable,f as SingleUnit,X as __namedExportsOrder,Q as default};
