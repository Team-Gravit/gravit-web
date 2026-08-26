import{j as t,L as b,f as y,g,h as T,i as x,k as v,O as f}from"./iframe-Dro4ontE.js";import{c as p}from"./cn-oknOcaYA.js";import"./preload-helper-DHFrVIEf.js";import"./clsx-B-dksMZM.js";function m({children:e,className:a}){return t.jsx("div",{role:"tablist",className:p("flex items-center w-full gap-1 p-1 md:gap-2 md:p-2 bg-text-1-w rounded-lg md:rounded-xl text-text-3 text-label1 md:text-heading2",a),children:e})}function R(e){const a="bg-[var(--primitive-purple-700)] text-text-1-w",o="bg-transparent",r=p("block flex-1 text-center py-2.5 md:py-4 rounded-sm md:rounded-lg transition-colors");if(e.as==="link"){const{as:c,to:n,children:s,...u}=e;return t.jsx(b,{to:n,activeProps:{className:a,"aria-current":"page"},inactiveProps:{className:o},className:r,...u,children:s})}if(e.as==="button"){const{as:c,active:n,children:s,...u}=e;return t.jsx("button",{type:"button",className:p(r,n?a:o),...u,children:s})}}m.Tab=R;m.__docgenInfo={description:"",methods:[{name:"Tab",docblock:null,modifiers:["static"],params:[{name:"props",optional:!1,type:{name:"union",raw:"ButtonTabProps | LinkTabProps",elements:[{name:"intersection",raw:`BaseTabProps &
ButtonHTMLAttributes<HTMLButtonElement> & {
  active: boolean;
  as: 'button';
}`,elements:[{name:"BaseTabProps"},{name:"ButtonHTMLAttributes",elements:[{name:"HTMLButtonElement"}],raw:"ButtonHTMLAttributes<HTMLButtonElement>"},{name:"signature",type:"object",raw:`{
  active: boolean;
  as: 'button';
}`,signature:{properties:[{key:"active",value:{name:"boolean",required:!0}},{key:"as",value:{name:"literal",value:"'button'",required:!0}}]}}]},{name:"intersection",raw:`BaseTabProps &
LinkProps & {
  as: 'link';
}`,elements:[{name:"BaseTabProps"},{name:"LinkProps"},{name:"signature",type:"object",raw:`{
  as: 'link';
}`,signature:{properties:[{key:"as",value:{name:"literal",value:"'link'",required:!0}}]}}]}],alias:"TabProps"}}],returns:null}],displayName:"Tabs",props:{children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},className:{required:!1,tsType:{name:"string"},description:""}}};const k=[{to:"/my/summary",label:"요약"},{to:"/my/learning",label:"학습"},{to:"/my/league",label:"리그"},{to:"/my/social",label:"소셜"}];function d(){return t.jsx(m,{children:k.map(e=>t.jsx(m.Tab,{activeOptions:{exact:!0},to:e.to,as:"link",children:e.label},`${e.label}-${e.to}`))})}d.__docgenInfo={description:"",methods:[],displayName:"UserTabs"};const P=(e="/my/summary")=>{function a(o){const r=y({component:()=>t.jsx(f,{})}),c=["/my/summary","/my/learning","/my/league","/my/social"].map(s=>g({getParentRoute:()=>r,path:s,component:()=>t.jsx(o,{})})),n=T({history:x(),routeTree:r.addChildren(c)});return n.navigate({to:e}),t.jsx("div",{className:"bg-text-2-w p-4",children:t.jsx(v,{router:n})})}return a},L={title:"Widgets/User/UI/UserTabs",component:d,decorators:[P()]},i={name:"데스크탑"},l={name:"모바일",globals:{viewport:{value:"mobile2",isRotated:!1}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  name: '데스크탑'
}`,...i.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  name: '모바일',
  globals: {
    viewport: {
      value: 'mobile2',
      isRotated: false
    }
  }
}`,...l.parameters?.docs?.source}}};const N=["Default","Mobile"];export{i as Default,l as Mobile,N as __namedExportsOrder,L as default};
