import{j as t}from"./iframe-CMcfv20_.js";import{U as i}from"./unit-item-Ck8M76WL.js";function s({units:r,className:n}){return t.jsx("div",{className:`flex flex-col gap-2 ${n??""}`,children:r.map(e=>t.jsx(i,{unitId:e.id,unitTitle:e.title,unitStatus:e.status},e.id))})}s.__docgenInfo={description:"",methods:[],displayName:"UnitList",props:{units:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
	id: number;
	title: string;
	status: "completed" | "inProgress" | "notStarted";
}`,signature:{properties:[{key:"id",value:{name:"number",required:!0}},{key:"title",value:{name:"string",required:!0}},{key:"status",value:{name:"union",raw:'"completed" | "inProgress" | "notStarted"',elements:[{name:"literal",value:'"completed"'},{name:"literal",value:'"inProgress"'},{name:"literal",value:'"notStarted"'}],required:!0}}]}}],raw:`{
	id: number;
	title: string;
	status: "completed" | "inProgress" | "notStarted";
}[]`},description:""},className:{required:!1,tsType:{name:"string"},description:""}}};export{s as U};
