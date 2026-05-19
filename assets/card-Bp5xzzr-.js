import{j as n,L as i}from"./iframe-CMcfv20_.js";import{c as t}from"./cn-NikRBbYi.js";import{c as l}from"./index-B8k91cqS.js";const c=l("box-border flex flex-col bg-white w-full",{variants:{size:{sm:"p-3 rounded-lg gap-2",md:"p-3 rounded-lg gap-2 md:p-5 md:rounded-xl md:gap-4",lg:"p-7 rounded-2xl gap-6"}},defaultVariants:{size:"md"}});function d({children:e,className:a}){return n.jsx("div",{className:t("w-full flex items-center justify-between",a),children:e})}function o({children:e,className:a}){return n.jsx("h3",{className:t("font-normal md:font-medium text-xs md:text-base text-gray-500",a),children:e})}function m({to:e,children:a,className:s}){return n.jsx(i,{to:e,className:t("font-normal md:font-medium text-xs md:text-base text-gray-400 underline underline-offset-2 shadow-[0px_4px_32px_0px_#00000006]",s),children:a})}function r({size:e="md",children:a,className:s}){return n.jsx("div",{className:t(c({size:e}),s),children:a})}r.Header=d;r.Title=o;r.Link=m;r.__docgenInfo={description:"",methods:[{name:"Header",docblock:null,modifiers:["static"],params:[{name:`{
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
}: {
	to: string;
	children: React.ReactNode;
	className?: string;
}`,optional:!1,type:{name:"signature",type:"object",raw:`{
	to: string;
	children: React.ReactNode;
	className?: string;
}`,signature:{properties:[{key:"to",value:{name:"string",required:!0}},{key:"children",value:{name:"ReactReactNode",raw:"React.ReactNode",required:!0}},{key:"className",value:{name:"string",required:!1}}]}}}],returns:null}],displayName:"Card",props:{children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},className:{required:!1,tsType:{name:"string"},description:""},size:{defaultValue:{value:'"md"',computed:!1},required:!1}},composes:["VariantProps"]};export{r as C};
