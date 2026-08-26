import{r as _,j as e,L as y}from"./iframe-CkFatluG.js";import{b as R,i as V}from"./button.variants-DVtoWReC.js";import{C as m}from"./card-DRftWhn5.js";import{L as z}from"./labeled-progress-bar-CJt_biIk.js";import{P as B}from"./progress-bar-Co2Lj2xW.js";import{S as p}from"./skeleton-BfEbqAs6.js";import{U as W}from"./unit-list-BT6tf-52.js";import{S as E}from"./scroll-area-51Rg6XR5.js";import"./preload-helper-DHFrVIEf.js";import"./index-B8k91cqS.js";import"./clsx-B-dksMZM.js";import"./cn-oknOcaYA.js";import"./unit-item-BTuveTC1.js";function I(r,s){const a={...r};for(const o of s)delete a[o];return a}const N=_.forwardRef(({className:r,target:s,rel:a,children:o,...t},i)=>{const c=s==="_blank"?a??"noopener noreferrer":a;if(t.display==="block"){const{variant:C,size:L}=t,P=I(t,["display","variant","size"]);return e.jsx(y,{ref:i,target:s,rel:c,className:R({variant:C,size:L,className:r}),...P,children:o})}const{variant:k,size:w}=t,A=I(t,["display","variant","size"]);return e.jsx(y,{ref:i,target:s,rel:c,className:V({variant:k,size:w,className:r}),...A,children:o})});N.displayName="LinkButton";N.__docgenInfo={description:"",methods:[],displayName:"LinkButton"};function U({units:r}){return e.jsx(E,{orientation:"vertical",className:"h-[168px] md:h-[184px]",viewportClassName:"px-3 md:px-5 pb-3 md:pb-5 overscroll-contain",children:e.jsx(W,{units:r})})}U.__docgenInfo={description:"",methods:[],displayName:"UnitListScrollArea",props:{units:{required:!0,tsType:{name:"Array",elements:[{name:"UnitProgress"}],raw:"UnitProgress[]"},description:""}}};function b({chapterId:r=0,chapterTitle:s="",chapterProgressRate:a=0,units:o=[],isLoading:t=!1}){const i=o.find(c=>!c.isCompleted);return e.jsxs(m,{className:"px-0 md:px-0",children:[e.jsxs(m.Header,{className:"min-h-[19px] px-3 md:min-h-6 md:px-5",children:[e.jsx(m.Title,{children:"이어서 학습하기"}),!t&&i&&e.jsx(m.Link,{to:"/learning/$chapterId/$unitId",params:{chapterId:String(r),unitId:String(i.unitId)},children:"전체 학습화면 보기"})]}),t?e.jsx(q,{}):e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"w-full px-3 md:px-5",children:e.jsx(z,{label:s,value:a})}),e.jsx(U,{units:o}),e.jsx("div",{className:"min-h-[37px] w-full px-3 md:min-h-[56px] md:px-5",children:i&&e.jsx(N,{to:"/learning/$chapterId/$unitId",display:"block",params:{chapterId:String(r),unitId:String(i.unitId)},children:"이어서 학습하기"})})]})]})}function q(){return e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"w-full px-3 md:px-5",children:e.jsxs("div",{className:"flex flex-col gap-1 md:gap-1.5",children:[e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx(p,{variant:"text",width:120,textSize:"heading1",className:"h-[1lh]"}),e.jsx(p,{variant:"text",width:36,textSize:"body1Normal",className:"h-[1lh]"})]}),e.jsx(B,{value:0})]})}),e.jsx("div",{className:"h-[168px] overflow-hidden md:h-[184px]",children:e.jsx("div",{className:"flex h-fit w-full flex-col gap-2 px-3 pb-3 md:px-5 md:pb-5",children:Array.from({length:3}).map((r,s)=>e.jsx(p,{variant:"block",className:"h-[42px] w-full rounded-sm md:h-14 md:rounded-lg"},s))})}),e.jsx("div",{className:"min-h-[37px] w-full px-3 md:min-h-[56px] md:px-5",children:e.jsx(p,{variant:"block",className:"block h-[37px] w-full rounded-sm md:h-[56px] md:rounded-lg"})})]})}b.__docgenInfo={description:"",methods:[],displayName:"UnitListCard",props:{chapterId:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"0",computed:!1}},chapterTitle:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}},chapterProgressRate:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"0",computed:!1}},units:{required:!1,tsType:{name:"Array",elements:[{name:"UnitProgress"}],raw:"UnitProgress[]"},description:"",defaultValue:{value:"[]",computed:!1}},isLoading:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};const T=["변수와 자료형","조건문과 반복문","함수와 스코프","배열과 객체","비동기 프로그래밍"],M=["변수와 자료형","조건문과 반복문","함수와 스코프","배열과 객체","비동기 프로그래밍","클로저와 스코프 체인","프로토타입과 클래스","모듈 시스템","에러 핸들링","TypeScript 기초"],d=r=>T.map((s,a)=>({unitId:a+1,title:s,isCompleted:a<r})),n={chapterId:1,chapterTitle:"프로그래밍 기초",chapterProgressRate:40},re={title:"Widgets/MainPage/UnitListCard",component:b,tags:["autodocs"],parameters:{layout:"padded"},argTypes:{units:{table:{disable:!0}}}},l=[r=>e.jsx("div",{className:"w-[480px]",children:e.jsx(r,{})})],u={name:"기본 (진행 중 포함)",args:{...n,units:d(2)},decorators:l},x={name:"시작 전",args:{...n,chapterProgressRate:0,units:d(0)},decorators:l},f={name:"첫 번째 완료",args:{...n,chapterProgressRate:20,units:d(1)},decorators:l},g={name:"전체 완료",args:{...n,chapterProgressRate:100,units:d(T.length)},decorators:l},h={name:"유닛 1개",args:{...n,units:[{unitId:1,title:"변수와 자료형",isCompleted:!1}]},decorators:l},v={name:"스크롤 (유닛 10개)",args:{...n,units:M.map((r,s)=>({unitId:s+1,title:r,isCompleted:s<3}))},decorators:l},j={name:"모바일 (375px)",parameters:{layout:"fullscreen",viewport:{defaultViewport:"iphone6"}},decorators:[r=>e.jsx("div",{className:"p-4",children:e.jsx(r,{})})],args:{...n,units:d(2)}},S={name:"데스크탑 (768px)",parameters:{layout:"fullscreen",viewport:{defaultViewport:"ipad"}},decorators:[r=>e.jsx("div",{className:"p-4",children:e.jsx(r,{})})],args:{...n,units:d(2)}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  name: '기본 (진행 중 포함)',
  args: {
    ...defaultArgs,
    units: makeUnits(2)
  },
  decorators: fixedWidth
}`,...u.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: '시작 전',
  args: {
    ...defaultArgs,
    chapterProgressRate: 0,
    units: makeUnits(0)
  },
  decorators: fixedWidth
}`,...x.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: '첫 번째 완료',
  args: {
    ...defaultArgs,
    chapterProgressRate: 20,
    units: makeUnits(1)
  },
  decorators: fixedWidth
}`,...f.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: '전체 완료',
  args: {
    ...defaultArgs,
    chapterProgressRate: 100,
    units: makeUnits(UNIT_TITLES.length)
  },
  decorators: fixedWidth
}`,...g.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
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
}`,...h.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
}`,...v.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
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
}`,...j.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
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
}`,...S.parameters?.docs?.source}}};const se=["Default","AllNotStarted","FirstCompleted","AllCompleted","SingleUnit","Scrollable","OnMobile","OnDesktop"];export{g as AllCompleted,x as AllNotStarted,u as Default,f as FirstCompleted,S as OnDesktop,j as OnMobile,v as Scrollable,h as SingleUnit,se as __namedExportsOrder,re as default};
