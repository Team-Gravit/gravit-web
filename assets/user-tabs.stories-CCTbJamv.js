import{j as e,L as u,f as d,g as p,h as x,i as g,k as b,O as v}from"./iframe-DpgK7c53.js";import"./preload-helper-DHFrVIEf.js";const f=[{to:"/my/summary",label:"요약"},{to:"/my/learning",label:"학습"},{to:"/my/league",label:"리그"},{to:"/my/social",label:"소셜"}];function l(){return e.jsx("nav",{children:e.jsx("ul",{className:"flex items-center w-full gap-1 p-1 md:gap-2 md:p-2 bg-text-1-w rounded-lg md:rounded-xl text-text-3 label1 md:heading2",children:f.map(t=>e.jsx("li",{className:"max-w-1/4 w-full",children:e.jsx(u,{to:t.to,activeOptions:t.to==="/user"?{exact:!0}:void 0,activeProps:{className:"bg-[var(--primitive-purple-700)] text-text-1-w"},inactiveProps:{className:"bg-transparent"},className:"block w-full text-center  py-2.5 md:py-4 rounded-sm md:rounded-lg transition-colors",children:t.label})},t.label))})})}l.__docgenInfo={description:"",methods:[],displayName:"UserTabs"};const R=(t="/user")=>{const s=i=>{const o=d({component:()=>e.jsx(v,{})}),c=["/user","/user/learning","/user/league","/user/social"].map(m=>p({getParentRoute:()=>o,path:m,component:()=>e.jsx(i,{})})),n=x({history:g(),routeTree:o.addChildren(c)});return n.navigate({to:t}),e.jsx("div",{className:"bg-text-2-w p-4",children:e.jsx(b,{router:n})})};return s.displayName="WithUserTabRouter",s},j={title:"Widgets/User/UI/UserTabs",component:l,decorators:[R()]},r={name:"데스크탑"},a={name:"모바일",globals:{viewport:{value:"mobile2",isRotated:!1}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  name: '데스크탑'
}`,...r.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  name: '모바일',
  globals: {
    viewport: {
      value: 'mobile2',
      isRotated: false
    }
  }
}`,...a.parameters?.docs?.source}}};const w=["Default","Mobile"];export{r as Default,a as Mobile,w as __namedExportsOrder,j as default};
