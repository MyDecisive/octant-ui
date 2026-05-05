import{j as t}from"./iframe-BLQrpW8o.js";import{S as d}from"./Stack-B79iIa_7.js";import{B as n}from"./Box-CL6oez6V.js";import{L as p,T as u,c as m}from"./Table-BEc_Yt9p.js";import{T as h}from"./Typography-Dsq_sGuc.js";import"./preload-helper-CZWHLvzI.js";import"./createSimplePaletteValueFilter-4EAdbq0S.js";import"./index-BDnZ-3D0.js";import"./RichTooltip-SbZH8o4E.js";import"./Tooltip-MlaCjB5G.js";import"./useTheme-Bp_xjIku.js";import"./useSlot-D5iPdcjh.js";import"./mergeSlotProps-D56iNpyO.js";import"./isFocusVisible-CC5yGX_k.js";import"./useTimeout-CrPtF72_.js";import"./useSlotProps-BYKxImRh.js";import"./Grow-v8Ib4nUB.js";import"./index-xT9bB6IN.js";import"./index-BUBSTMO-.js";import"./utils-DjY_ORy6.js";import"./Popper-BjqKYi_p.js";import"./createSvgIcon-BbJ07adR.js";import"./Button-DBnPYqPO.js";import"./ButtonBase-anrEY3YH.js";import"./CircularProgress-BCdOHeSD.js";import"./index-Blq960vM.js";import"./Card-Bzf9bDrw.js";import"./Paper-BCO45gF-.js";import"./CardHeader-OUWme1E0.js";import"./Select-XdGlumWj.js";import"./useFormControl-3Txl3AZy.js";import"./Switch-DbTr-oDu.js";import"./MenuItem-sv4k10xa.js";import"./dividerClasses-CYHXc-TN.js";import"./IconButton-C28kFpnQ.js";import"./TextField-ytdQnRvh.js";import"./Close-CczcXS1Y.js";import"./Chip-CrkwjSKO.js";import"./Divider-tK2qnDQz.js";import"./Tabs-CpEERqxg.js";function c({value:e,showLabel:r}){return t.jsxs(d,{direction:"row",alignItems:"center",gap:1,className:"progress-line-with-label-container",children:[t.jsx(n,{sx:{width:"100%"},children:t.jsx(p,{color:"secondary",variant:"determinate",value:e})}),r&&t.jsx(n,{sx:{minWidth:35},children:t.jsx(h,{variant:"body2",color:"secondary",children:`${Math.round(e)}%`})})]})}c.__docgenInfo={description:"",methods:[],displayName:"ProgressLineWithLabel",props:{value:{required:!0,tsType:{name:"number"},description:""},showLabel:{required:!1,tsType:{name:"boolean"},description:""}}};const ne={title:"Display/Table",component:u,parameters:{layout:"centered"},args:{}},g=m([{headerName:"Root spans",field:"span"},{headerName:"Span breadth",field:"breadth"},{headerName:"Invocations",field:"invocations"},{headerName:"Span depth",field:"depth"},{headerName:"Estimated cost",field:"cost",cellClassName:"bold",valueFormatter:e=>`$${e.toLocaleString()}`,align:"right",headerAlign:"right"}]);function b(){const e=[];for(let r=0;r<40;r++){const a={id:`row-${r.toString()}`,span:`/Service${r.toString()}`,breadth:r%10,invocations:r%7,depth:r%9,cost:r*Math.floor(Math.random()*10)};e.push(a)}return e}const o={args:{label:"Traces - Top Talkers",columns:g,rows:b(),showToolbar:!0,footerLabel:"Total estimated cost",calculateTotal:e=>e.reduce((r,a)=>r+a.cost,0)}},f=m([{headerName:"service name",field:"name"},{headerName:"Logs sent (GB)",field:"sent",type:"number"},{headerName:"% of Total",field:"percent",renderCell:({value:e})=>t.jsx(c,{value:e,showLabel:!0})},{headerName:"Estimated cost",field:"cost",cellClassName:"bold",valueFormatter:e=>`$${e.toLocaleString()}`,align:"right",headerAlign:"right"}]);function T(){const e=[];for(let r=0;r<40;r++){const a={id:`row-${r.toString()}`,name:`service ${r.toString()}`,sent:r%10,percent:Math.floor(Math.random()*100),cost:r*Math.floor(Math.random()*10)};e.push(a)}return e}const s={args:{label:"Logs - Top Talkers",columns:f,rows:T(),showToolbar:!0,footerLabel:"Total estimated cost",calculateTotal:e=>e.reduce((r,a)=>r+a.cost,0)}};function i(e,{type:r}){return`${e.toLocaleString()} ${r==="logs"?"GB":"MM Events"}`}function y(e,{type:r}){return`$${e.toLocaleString()}/${r==="logs"?"GB":"MM Events"}`}const w=m([{headerName:"Type",field:"type",headerClassName:"bold",cellClassName:"bold",valueFormatter:e=>`${e[0].toLocaleUpperCase()}${e.slice(1)}`},{headerName:"Received",headerClassName:"bold",field:"received",valueFormatter:i},{headerName:"Sent",headerClassName:"bold",field:"sent",valueFormatter:i},{headerName:"Rate",headerClassName:"bold",field:"rate",valueFormatter:y},{headerName:"% of Total",headerClassName:"bold",field:"percent",valueFormatter:e=>`${e} %`},{headerName:"Est. Cost",headerClassName:"bold",field:"cost",valueFormatter:e=>`$${e}`,cellClassName:"bold"}]),N=[{id:"logs",type:"logs",cost:700,received:100,sent:100,rate:.1,percent:70},{id:"traces",type:"traces",cost:300,received:4.2,sent:4.2,rate:1.27,percent:30}],l={args:{label:"Overall Estimated Cost",columns:w,rows:N,showToolbar:!0,footerLabel:"the last 24h",calculateTotal:e=>e.reduce((r,a)=>r+a.cost,0),summaryTable:!0}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Traces - Top Talkers",
    columns: traceColumns,
    rows: createDummySpanData(),
    showToolbar: true,
    footerLabel: "Total estimated cost",
    calculateTotal: rows => rows.reduce((sum, r) => sum + r.cost, 0)
  }
}`,...o.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Logs - Top Talkers",
    columns: logsColumns,
    rows: createDummyLogData(),
    showToolbar: true,
    footerLabel: "Total estimated cost",
    calculateTotal: rows => rows.reduce((sum, r) => sum + r.cost, 0)
  }
}`,...s.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Overall Estimated Cost",
    columns: summaryColumns,
    rows: summaryData,
    showToolbar: true,
    footerLabel: "the last 24h",
    calculateTotal: rows => rows.reduce((sum, r) => sum + r.cost, 0),
    summaryTable: true
  }
}`,...l.parameters?.docs?.source}}};const ie=["Traces","Logs","Summary"];export{s as Logs,l as Summary,o as Traces,ie as __namedExportsOrder,ne as default};
