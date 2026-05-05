import{j as e,r as u}from"./iframe-BLQrpW8o.js";import{c as l}from"./createSvgIcon-BbJ07adR.js";import{T as p,c as d}from"./Table-BEc_Yt9p.js";import{S as f}from"./Stack-B79iIa_7.js";import{T as o}from"./Typography-Dsq_sGuc.js";import{C as b}from"./CircularProgress-BCdOHeSD.js";import"./preload-helper-CZWHLvzI.js";import"./createSimplePaletteValueFilter-4EAdbq0S.js";import"./index-BDnZ-3D0.js";import"./RichTooltip-SbZH8o4E.js";import"./Tooltip-MlaCjB5G.js";import"./useTheme-Bp_xjIku.js";import"./useSlot-D5iPdcjh.js";import"./mergeSlotProps-D56iNpyO.js";import"./isFocusVisible-CC5yGX_k.js";import"./useTimeout-CrPtF72_.js";import"./useSlotProps-BYKxImRh.js";import"./Grow-v8Ib4nUB.js";import"./index-xT9bB6IN.js";import"./index-BUBSTMO-.js";import"./utils-DjY_ORy6.js";import"./Popper-BjqKYi_p.js";import"./Button-DBnPYqPO.js";import"./ButtonBase-anrEY3YH.js";import"./index-Blq960vM.js";import"./Card-Bzf9bDrw.js";import"./Paper-BCO45gF-.js";import"./CardHeader-OUWme1E0.js";import"./Select-XdGlumWj.js";import"./useFormControl-3Txl3AZy.js";import"./Switch-DbTr-oDu.js";import"./MenuItem-sv4k10xa.js";import"./dividerClasses-CYHXc-TN.js";import"./IconButton-C28kFpnQ.js";import"./TextField-ytdQnRvh.js";import"./Close-CczcXS1Y.js";import"./Chip-CrkwjSKO.js";import"./Divider-tK2qnDQz.js";import"./Tabs-CpEERqxg.js";const g=l(e.jsx("path",{d:"M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2m5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12z"})),h=l(e.jsx("path",{d:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8z"})),C=d([{align:"left",field:"label",headerClassName:"status-card-header-cell"},{align:"right",field:"value",cellClassName:"status-card-value-cell",headerClassName:"status-card-header-cell",renderCell:({value:r})=>{switch(r){case"loading":return e.jsx(b,{size:"1rem",color:"secondary"});case!1:return e.jsx(g,{color:"error"});case!0:return e.jsx(h,{color:"success"});case null:return"-";default:return r}}}]);function n({label:r,lastSuccessful:i,rows:a}){const c=u.useMemo(()=>a.map((s,m)=>({id:`${s.label}-${m.toString()}`,...s})),[a]);return e.jsx(p,{className:"status-card-table",hideFooter:!0,columnHeaderHeight:0,header:e.jsxs(f,{direction:"row",justifyContent:"space-between",className:"status-card-label-row",children:[e.jsx(o,{variant:"body2",bold:!0,children:r}),e.jsx(o,{variant:"body2",color:"secondary",children:`Last successful state on ${i}`})]}),rows:c,columns:C})}n.__docgenInfo={description:"",methods:[],displayName:"StatusCard",props:{label:{required:!0,tsType:{name:"string"},description:""},lastSuccessful:{required:!0,tsType:{name:"string"},description:""},rows:{required:!0,tsType:{name:"Array",elements:[{name:"StatusRowData"}],raw:"StatusRowData[]"},description:""}}};const se={title:"Display/StatusCard",component:n,parameters:{layout:"centered"},args:{}},t={args:{label:"Status",lastSuccessful:"7/2/87",rows:[{label:"Hub Infrastructure",value:!1},{label:"Connection",value:!0},{label:"Filter",value:"loading"},{label:"Integration",value:"Datadog"}]}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
}`,...t.parameters?.docs?.source}}};const oe=["Default"];export{t as Default,oe as __namedExportsOrder,se as default};
