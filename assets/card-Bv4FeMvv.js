import{j as n,L as l}from"./iframe-B3vk0f3t.js";import{c as r}from"./cn-oknOcaYA.js";import{c}from"./index-B8k91cqS.js";const d=c("box-border flex flex-col bg-white w-full",{variants:{size:{sm:"p-3 rounded-lg gap-2",md:"p-3 rounded-lg gap-2 md:p-5 md:rounded-xl md:gap-4",lg:"p-7 rounded-2xl gap-6"}},defaultVariants:{size:"md"}});function o({children:e,className:a}){return n.jsx("div",{className:r("w-full flex items-center justify-between",a),children:e})}function m({children:e,className:a}){return n.jsx("h3",{className:r("text-label2 md:text-body1-normal text-gray-500",a),children:e})}function u({to:e,children:a,className:t,params:i}){return n.jsx(l,{to:e,params:i,className:r("text-label2 md:text-body1-normal text-gray-400 underline underline-offset-2 shadow-[0px_4px_32px_0px_#00000006]",t),children:a})}function s({size:e="md",children:a,className:t}){return n.jsx("div",{className:r(d({size:e}),t),children:a})}s.Header=o;s.Title=m;s.Link=u;s.__docgenInfo={description:"",methods:[{name:"Header",docblock:null,modifiers:["static"],params:[{name:`{
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}`,optional:!1,type:{name:"signature",type:"object",raw:`{
	children: React.ReactNode;
	className?: string;
}`,signature:{properties:[{key:"children",value:{name:"ReactReactNode",raw:"React.ReactNode",required:!0}},{key:"className",value:{name:"string",required:!1}}]}}}],returns:null},{name:"Title",docblock:null,modifiers:["static"],params:[{name:`{
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}`,optional:!1,type:{name:"signature",type:"object",raw:`{
	children: React.ReactNode;
	className?: string;
}`,signature:{properties:[{key:"children",value:{name:"ReactReactNode",raw:"React.ReactNode",required:!0}},{key:"className",value:{name:"string",required:!1}}]}}}],returns:null},{name:"Link",docblock:null,modifiers:["static"],params:[{name:`{
	to,
	children,
	className,
	params,
}: LinkProps & { className?: string }`,optional:!1,type:{name:"intersection",raw:"LinkProps & { className?: string }",elements:[{name:"LinkProps"},{name:"signature",type:"object",raw:"{ className?: string }",signature:{properties:[{key:"className",value:{name:"string",required:!1}}]}}]}}],returns:null}],displayName:"Card",props:{children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},className:{required:!1,tsType:{name:"string"},description:""},size:{defaultValue:{value:'"md"',computed:!1},required:!1}},composes:["VariantProps"]};export{s as C};
