import{j}from"./jsx-runtime-D_zvdyIk.js";function b(t){var s,e,r="";if(typeof t=="string"||typeof t=="number")r+=t;else if(typeof t=="object")if(Array.isArray(t)){var n=t.length;for(s=0;s<n;s++)t[s]&&(e=b(t[s]))&&(r&&(r+=" "),r+=e)}else for(e in t)t[e]&&(r&&(r+=" "),r+=e);return r}function A(){for(var t,s,e=0,r="",n=arguments.length;e<n;e++)(t=arguments[e])&&(s=b(t))&&(r&&(r+=" "),r+=s);return r}const f=t=>typeof t=="boolean"?`${t}`:t===0?"0":t,P=A,_=(t,s)=>e=>{var r;if(s?.variants==null)return P(t,e?.class,e?.className);const{variants:n,defaultVariants:l}=s,V=Object.keys(n).map(a=>{const o=e?.[a],m=l?.[a];if(o===null)return null;const i=f(o)||f(m);return n[a][i]}),y=e&&Object.entries(e).reduce((a,o)=>{let[m,i]=o;return i===void 0||(a[m]=i),a},{}),C=s==null||(r=s.compoundVariants)===null||r===void 0?void 0:r.reduce((a,o)=>{let{class:m,className:i,...N}=o;return Object.entries(N).every(h=>{let[S,x]=h;return Array.isArray(x)?x.includes({...l,...y}[S]):{...l,...y}[S]===x})?[...a,m,i]:a},[]);return P(t,V,C,e?.class,e?.className)},w=_("inline-flex items-center rounded-full font-medium",{variants:{status:{completed:"bg-white border border-main-1 text-main-1",inProgress:"bg-main-1 text-white",notStarted:"bg-white border border-[#C6C6C6] text-[#A8A8A8]"},size:{sm:"px-3 py-0.5 text-xs",md:"px-4 py-1 text-base",lg:"px-5 py-2 text-lg"}},defaultVariants:{size:"md"}});function z({status:t,size:s="md",text:e}){return j.jsx("span",{className:w({status:t,size:s}),children:e})}z.__docgenInfo={description:"",methods:[],displayName:"StatusBadge",props:{status:{required:!0,tsType:{name:"union",raw:'"completed" | "inProgress" | "notStarted"',elements:[{name:"literal",value:'"completed"'},{name:"literal",value:'"inProgress"'},{name:"literal",value:'"notStarted"'}]},description:""},size:{required:!1,tsType:{name:"union",raw:'"sm" | "md" | "lg"',elements:[{name:"literal",value:'"sm"'},{name:"literal",value:'"md"'},{name:"literal",value:'"lg"'}]},description:"",defaultValue:{value:'"md"',computed:!1}},text:{required:!1,tsType:{name:"string"},description:""}}};const T={title:"Shared/UI/Badge/StatusBadge",component:z,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{status:{control:"select",options:["completed","inProgress","notStarted"],description:"배지 상태",table:{type:{summary:"'completed' | 'inProgress' | 'notStarted'"}}},size:{control:"select",options:["sm","md","lg"],description:"배지 크기",table:{type:{summary:"'sm' | 'md' | 'lg'"},defaultValue:{summary:"md"}}},text:{control:"text",description:"배지에 표시할 텍스트"}}},d={name:"완료",args:{status:"completed",text:"완료"}},u={name:"진행중",args:{status:"inProgress",text:"진행중"}},c={name:"시작 전",args:{status:"notStarted",text:"시작 전"}},g={name:"크기 - sm",args:{status:"inProgress",size:"sm",text:"진행중"}},p={name:"크기 - md (기본)",args:{status:"inProgress",size:"md",text:"진행중"}},v={name:"크기 - lg",args:{status:"inProgress",size:"lg",text:"진행중"}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: "완료",
  args: {
    status: "completed",
    text: "완료"
  }
}`,...d.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  name: "진행중",
  args: {
    status: "inProgress",
    text: "진행중"
  }
}`,...u.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: "시작 전",
  args: {
    status: "notStarted",
    text: "시작 전"
  }
}`,...c.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: "크기 - sm",
  args: {
    status: "inProgress",
    size: "sm",
    text: "진행중"
  }
}`,...g.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  name: "크기 - md (기본)",
  args: {
    status: "inProgress",
    size: "md",
    text: "진행중"
  }
}`,...p.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  name: "크기 - lg",
  args: {
    status: "inProgress",
    size: "lg",
    text: "진행중"
  }
}`,...v.parameters?.docs?.source}}};const B=["Completed","InProgress","NotStarted","SizeSmall","SizeMedium","SizeLarge"];export{d as Completed,u as InProgress,c as NotStarted,v as SizeLarge,p as SizeMedium,g as SizeSmall,B as __namedExportsOrder,T as default};
