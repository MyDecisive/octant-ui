import{r as u,j as e}from"./iframe-B8WsEGHq.js";import{C as m,a as p}from"./Cancel-CmtRCNND.js";import{T as d,c as f}from"./Table-D4Vpgb0O.js";import{S as b}from"./Stack-DjRt2RXZ.js";import{T as o}from"./Typography-BZhPPhck.js";import{C as g}from"./CircularProgress-DGPOJjrh.js";import"./preload-helper-CZWHLvzI.js";import"./createSvgIcon-D6VDE93t.js";import"./index-D6GmIEuN.js";import"./useSlot-U6_aPKPU.js";import"./mergeSlotProps-CAETWj2Y.js";import"./index-DI4pvUGu.js";import"./RichTooltip-CGAi_WG3.js";import"./Tooltip-CHS2PaHM.js";import"./useControlled-CO8Qmhc-.js";import"./Grow-Cfc93Vzc.js";import"./utils-BzYjJIVb.js";import"./index-BIapRzG0.js";import"./index-bF7fSFuN.js";import"./Popper-Djh0oyLU.js";import"./ownerDocument-DW-IO8s5.js";import"./useSlotProps-BQNBN2GS.js";import"./Button-CO9sK1fg.js";import"./Card-DqXOohIp.js";import"./Paper-BfH9b8vB.js";import"./CardHeader-2wH9UmRh.js";import"./TextField-Lu4Gza8g.js";import"./useFormControl-DU5kopq1.js";import"./Switch-VNOs06Gb.js";import"./SwitchBase-DB9gsZ7O.js";import"./MenuItem-DVmN25Oo.js";import"./Divider-DSOkfWGd.js";import"./Close-Tf9DWZwr.js";import"./Chip-DNLVBqnj.js";import"./Autocomplete-jEjMm1BV.js";import"./Tabs-B6F_ZX9r.js";import"./ClickAwayListener-DqptrDqq.js";const C=f([{align:"left",field:"label",headerClassName:"status-card-header-cell"},{align:"right",field:"value",cellClassName:"status-card-value-cell",headerClassName:"status-card-header-cell",renderCell:({value:r})=>{switch(r){case"loading":return e.jsx(g,{size:"1rem",color:"secondary"});case!1:return e.jsx(p,{color:"error"});case!0:return e.jsx(m,{color:"success"});case null:return"-";default:return r}}}]);function l({label:r,lastSuccessful:i,rows:a}){const n=u.useMemo(()=>a.map((s,c)=>({id:`${s.label}-${c.toString()}`,...s})),[a]);return e.jsx(d,{className:"status-card-table",hideFooter:!0,columnHeaderHeight:0,header:e.jsxs(b,{direction:"row",justifyContent:"space-between",className:"status-card-label-row",children:[e.jsx(o,{variant:"body2","data-bold":"true",children:r}),e.jsx(o,{variant:"body2",color:"secondary",children:`Last successful state on ${i}`})]}),rows:n,columns:C})}l.__docgenInfo={description:"",methods:[],displayName:"StatusCard",props:{label:{required:!0,tsType:{name:"string"},description:""},lastSuccessful:{required:!0,tsType:{name:"string"},description:""},rows:{required:!0,tsType:{name:"Array",elements:[{name:"StatusRowData"}],raw:"StatusRowData[]"},description:""}}};const re={title:"Display/StatusCard",component:l,parameters:{layout:"centered"},args:{}},t={args:{label:"Status",lastSuccessful:"7/2/87",rows:[{label:"Hub Infrastructure",value:!1},{label:"Connection",value:!0},{label:"Filter",value:"loading"},{label:"Integration",value:"Datadog"}]}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Status",
    lastSuccessful: "7/2/87",
    rows: [{
      label: "Hub Infrastructure",
      value: false
    }, {
      label: "Connection",
      value: true
    }, {
      label: "Filter",
      value: "loading"
    }, {
      label: "Integration",
      value: "Datadog"
    }]
  }
}`,...t.parameters?.docs?.source}}};const te=["Default"];export{t as Default,te as __namedExportsOrder,re as default};
