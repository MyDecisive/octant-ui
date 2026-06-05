import{r as c,j as r}from"./iframe-Cr7zBGH4.js";import{C as u,a as p}from"./Cancel-C3rABeId.js";import{T as d,c as f}from"./Table-D3AFj7LM.js";import{S as b}from"./Stack-DybawtqF.js";import{T as s}from"./Typography-BTnrTbuF.js";import{C as g}from"./CircularProgress-D7flg9L-.js";import"./preload-helper-CZWHLvzI.js";import"./createSvgIcon-DyRFfMV-.js";import"./styled-CMcOnYei.js";import"./index-2liZRfFu.js";import"./useSlot-CzltthvI.js";import"./index-BQKt3FMM.js";import"./RichTooltip-KtYzq5Iq.js";import"./Tooltip-DPCa7STV.js";import"./useControlled-Nu0l2aNg.js";import"./getReactElementRef-CRE5T1BE.js";import"./Grow-BzGLxtYT.js";import"./utils-CzPDRJhk.js";import"./index-C1reNYPM.js";import"./index-CEEwDAWx.js";import"./Popper-CVpIypLr.js";import"./ownerDocument-DW-IO8s5.js";import"./Portal-DVFF4eS7.js";import"./useSlotProps-BbNWoeNR.js";import"./Button-Dk1XK6QB.js";import"./Card-By4v8Nh1.js";import"./Paper-2oGUyTlV.js";import"./CardHeader-B-SosgTY.js";import"./TextField-BKa7Tr_r.js";import"./useFormControl-CEfaY_mb.js";import"./Modal-D_PHrWM4.js";import"./Switch-Dc7liqaL.js";import"./SwitchBase-DgdfxMME.js";import"./MenuItem-DdkrPPzV.js";import"./Divider-CgBAP-NK.js";import"./IconButton-CWlHFbhE.js";import"./Chip-COA1rOXO.js";import"./Autocomplete-W5Q7UWff.js";import"./Close-DgPuxw0p.js";import"./Tabs-Bfe-qL1T.js";import"./ClickAwayListener-DBZFuTOd.js";const C=f([{align:"left",field:"label",headerClassName:"status-card-header-cell"},{align:"right",field:"value",cellClassName:"status-card-value-cell",headerClassName:"status-card-header-cell",renderCell:({value:e})=>{switch(e){case"loading":return r.jsx(g,{size:"1rem",color:"secondary"});case!1:return r.jsx(p,{color:"error"});case!0:return r.jsx(u,{color:"success"});case null:return"-";default:return e}}}]);function l({label:e,lastSuccessful:i,rows:a}){const n=c.useMemo(()=>a.map((o,m)=>({id:`${o.label}-${m.toString()}`,...o})),[a]);return r.jsx(d,{className:"status-card-table",hideFooter:!0,columnHeaderHeight:0,header:r.jsxs(b,{direction:"row",justifyContent:"space-between",className:"status-card-label-row",children:[r.jsx(s,{variant:"body2","data-bold":"true",children:e}),r.jsx(s,{variant:"body2",color:"secondary",children:`Last successful state on ${i}`})]}),rows:n,columns:C})}l.__docgenInfo={description:"",methods:[],displayName:"StatusCard",props:{label:{required:!0,tsType:{name:"string"},description:""},lastSuccessful:{required:!0,tsType:{name:"string"},description:""},rows:{required:!0,tsType:{name:"Array",elements:[{name:"StatusRowData"}],raw:"StatusRowData[]"},description:""}}};const sr={title:"Display/StatusCard",component:l,parameters:{layout:"centered"},args:{}},t={args:{label:"Status",lastSuccessful:"7/2/87",rows:[{label:"Hub Infrastructure",value:!1},{label:"Connection",value:!0},{label:"Filter",value:"loading"},{label:"Integration",value:"Datadog"}]}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
}`,...t.parameters?.docs?.source}}};const lr=["Default"];export{t as Default,lr as __namedExportsOrder,sr as default};
