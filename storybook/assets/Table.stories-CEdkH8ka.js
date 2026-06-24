import{L as f,c,T}from"./Table-D4Vpgb0O.js";import{j as a,r as y}from"./iframe-B8WsEGHq.js";import{S as w}from"./Stack-DjRt2RXZ.js";import{B as u}from"./Box-CbO0Nqhl.js";import{T as v}from"./Typography-BZhPPhck.js";import{C as o,f as r}from"./Clarity.copy-BMdnQUo2.js";import"./index-D6GmIEuN.js";import"./useSlot-U6_aPKPU.js";import"./mergeSlotProps-CAETWj2Y.js";import"./index-DI4pvUGu.js";import"./RichTooltip-CGAi_WG3.js";import"./Tooltip-CHS2PaHM.js";import"./useControlled-CO8Qmhc-.js";import"./Grow-Cfc93Vzc.js";import"./utils-BzYjJIVb.js";import"./index-BIapRzG0.js";import"./index-bF7fSFuN.js";import"./Popper-Djh0oyLU.js";import"./ownerDocument-DW-IO8s5.js";import"./useSlotProps-BQNBN2GS.js";import"./createSvgIcon-D6VDE93t.js";import"./Button-CO9sK1fg.js";import"./CircularProgress-DGPOJjrh.js";import"./Card-DqXOohIp.js";import"./Paper-BfH9b8vB.js";import"./CardHeader-2wH9UmRh.js";import"./TextField-Lu4Gza8g.js";import"./useFormControl-DU5kopq1.js";import"./Switch-VNOs06Gb.js";import"./SwitchBase-DB9gsZ7O.js";import"./MenuItem-DVmN25Oo.js";import"./Divider-DSOkfWGd.js";import"./Close-Tf9DWZwr.js";import"./Chip-DNLVBqnj.js";import"./Autocomplete-jEjMm1BV.js";import"./Tabs-B6F_ZX9r.js";import"./ClickAwayListener-DqptrDqq.js";import"./preload-helper-CZWHLvzI.js";function g({value:e,showLabel:t}){return a.jsxs(w,{direction:"row",alignItems:"center",gap:1,className:"progress-line-with-label-container",children:[a.jsx(u,{sx:{width:"100%"},children:a.jsx(f,{color:"secondary",variant:"determinate",value:e})}),t&&a.jsx(u,{sx:{minWidth:35},children:a.jsx(v,{variant:"body2",color:"secondary",children:`${Math.round(e)}%`})})]})}g.__docgenInfo={description:"",methods:[],displayName:"ProgressLineWithLabel",props:{value:{required:!0,tsType:{name:"number"},description:""},showLabel:{required:!1,tsType:{name:"boolean"},description:""}}};const d=e=>r(e,{minimumDecimalPlaces:2,prefix:"$"}),m=e=>r(e),N=c([{headerName:o.traceTable.columns.rootSpans,field:"span"},{headerName:o.traceTable.columns.spanBreadth,field:"breadth",valueFormatter:m},{headerName:o.traceTable.columns.invocations,field:"invocations",valueFormatter:m},{headerName:o.traceTable.columns.spanDepth,field:"depth",valueFormatter:m},{headerName:o.traceTable.columns.estimatedCost,field:"cost",cellClassName:"bold",valueFormatter:d,align:"right",headerAlign:"right"}]),C=c([{headerName:o.logsTable.columns.service,field:"name"},{headerName:o.logsTable.columns.sent,field:"sent",type:"number",valueFormatter:m},{headerName:o.logsTable.columns.pTotal,field:"percent",renderCell:({value:e})=>y.createElement(g,{value:e,showLabel:!0})},{headerName:o.logsTable.columns.estimatedCost,field:"cost",cellClassName:"bold",valueFormatter:d,align:"right",headerAlign:"right"}]);function x(e,{type:t}){return r(e,{suffix:` ${t==="logs"?"GB":"MM Events"}`})}function L(e,{type:t}){return r(e,{decimalPlaces:2,minimumDecimalPlaces:2,prefix:"$",suffix:`/${t==="logs"?"GB":"MM Events"}`})}const S=c([{headerName:o.overall.columns.type,field:"type",headerClassName:"bold",cellClassName:"bold",valueFormatter:e=>`${e[0].toLocaleUpperCase()}${e.slice(1)}`},{headerName:o.overall.columns.export,headerClassName:"bold",field:"sent",valueFormatter:x},{headerName:o.overall.columns.rate,headerClassName:"bold",field:"rate",valueFormatter:L},{headerName:o.overall.columns.pTotal,headerClassName:"bold",field:"pct",valueFormatter:e=>r(e,{decimalPlaces:0,suffix:" %"})},{headerName:o.overall.columns.total,headerClassName:"bold",field:"cost",valueFormatter:d,cellClassName:"bold"}]),F=["bottom","bottom-end","bottom-start","left","left-end","left-start","right","right-end","right-start","top","top-end","top-start"],he={title:"Display/Table",component:T,parameters:{layout:"centered"},argTypes:{"toolbarTooltip.placement":{control:"select",options:F}},args:{}};function D(){const e=[];for(let t=0;t<40;t++){const i={id:`row-${t.toString()}`,span:`/Service-${t.toString()}`,breadth:1.1234+t*.3311,invocations:125.9876+t*42.4321,depth:2.8765+t%9*.2456,cost:4.5678+t*1.2345};e.push(i)}return e}const p=D(),s={args:{label:"Traces - Top Talkers",toolbarTooltip:{body:"Showing top 250 results. Refine your search to narrow down results.",placement:"right"},columns:N,rows:p,showToolbar:!0,footerLabel:"Total estimated cost",total:r(p.reduce((e,{cost:t})=>e+t,0))}};function E(){const e=[];for(let t=0;t<40;t++){const i={id:`row-${t.toString()}`,name:`service-${t.toString()}`,sent:12.3456+t*3.2109,percent:Math.min(100,1.2345+t*2.3456),cost:2.3456+t*.9876};e.push(i)}return e}const h=E(),l={args:{label:"Logs - Top Talkers",toolbarTooltip:{body:"Showing top 250 results. Refine your search to narrow down results.",placement:"right"},columns:C,rows:h,showToolbar:!0,footerLabel:"Total estimated cost",total:r(h.reduce((e,{cost:t})=>e+t,0))}},b=[{id:"logs",type:"logs",cost:87.9345,sent:320.5678,rate:.2245,pct:68.4567},{id:"traces",type:"traces",cost:40.4987,sent:75.3344,rate:.5376,pct:31.5432}],n={args:{label:"Overall Estimated Cost",columns:S,rows:b,showToolbar:!0,footerLabel:"the last 24h",toolbarTooltip:{header:"Estimated data charges is based on average rates",body:"This also reflects only the data sent to this hub. Your total costs may be higher.",cta:"See full production costs",ctaHref:"https://docs.mydecisive.ai/",ctaExternal:!0,placement:"bottom"},total:r(b.reduce((e,{cost:t})=>e+(t??0),0)),summaryTable:!0}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Traces - Top Talkers",
    toolbarTooltip: {
      body: "Showing top 250 results. Refine your search to narrow down results.",
      placement: "right"
    },
    columns: traceColumns,
    rows: spanRows,
    showToolbar: true,
    footerLabel: "Total estimated cost",
    total: formatNumber(spanRows.reduce((sum, {
      cost
    }) => sum + cost, 0))
  }
}`,...s.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Logs - Top Talkers",
    toolbarTooltip: {
      body: "Showing top 250 results. Refine your search to narrow down results.",
      placement: "right"
    },
    columns: logsColumns,
    rows: logRows,
    showToolbar: true,
    footerLabel: "Total estimated cost",
    total: formatNumber(logRows.reduce((sum, {
      cost
    }) => sum + cost, 0))
  }
}`,...l.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Overall Estimated Cost",
    columns: summaryColumns,
    rows: summaryData,
    showToolbar: true,
    footerLabel: "the last 24h",
    toolbarTooltip: {
      header: "Estimated data charges is based on average rates",
      body: "This also reflects only the data sent to this hub. Your total costs may be higher.",
      cta: "See full production costs",
      ctaHref: "https://docs.mydecisive.ai/",
      ctaExternal: true,
      placement: "bottom"
    },
    total: formatNumber(summaryData.reduce((sum, {
      cost
    }) => sum + (cost ?? 0), 0)),
    summaryTable: true
  }
}`,...n.parameters?.docs?.source}}};const be=["Traces","Logs","Summary"];export{l as Logs,n as Summary,s as Traces,be as __namedExportsOrder,he as default};
