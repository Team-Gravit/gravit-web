import{j as e,L as u,f as m,g as d,h as p,i as x,k as g,O as b}from"./iframe-CMcfv20_.js";import"./preload-helper-DHFrVIEf.js";const v=[{to:"/user",label:"요약"},{to:"/user/learning",label:"학습"},{to:"/user/league",label:"리그"},{to:"/user/social",label:"소셜"}];function n(){return e.jsx("nav",{children:e.jsx("ul",{className:"flex items-center w-full gap-1 p-1 md:gap-2 md:p-2 bg-text-1-w rounded-lg md:rounded-xl text-text-3 label1 md:heading2",children:v.map(t=>e.jsx("li",{className:"max-w-1/4 w-full",children:e.jsx(u,{to:t.to,activeOptions:t.to==="/user"?{exact:!0}:void 0,activeProps:{className:"bg-[var(--primitive-purple-700)] text-text-1-w"},inactiveProps:{className:"bg-transparent"},className:"block w-full text-center  py-2.5 md:py-4 rounded-sm md:rounded-lg transition-colors",children:t.label})},t.label))})})}n.__docgenInfo={description:"",methods:[],displayName:"UserTabs"};const f=(t="/user")=>l=>{const a=m({component:()=>e.jsx(b,{})}),c=["/user","/user/learning","/user/league","/user/social"].map(i=>d({getParentRoute:()=>a,path:i,component:()=>e.jsx(l,{})})),o=p({history:x(),routeTree:a.addChildren(c)});return o.navigate({to:t}),e.jsx("div",{className:"bg-text-2-w p-4",children:e.jsx(g,{router:o})})},j={title:"Widgets/User/UI/UserTabs",component:n,decorators:[f()]},r={name:"데스크탑"},s={name:"모바일",globals:{viewport:{value:"mobile2",isRotated:!1}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  name: "데스크탑"
}`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  name: "모바일",
  globals: {
    viewport: {
      value: "mobile2",
      isRotated: false
    }
  }
}`,...s.parameters?.docs?.source}}};const w=["Default","Mobile"];export{r as Default,s as Mobile,w as __namedExportsOrder,j as default};
