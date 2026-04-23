import{j as e,r as u}from"./iframe-Bq5F8R2A.js";import{c as g}from"./useTimeout-BG8ktd3Z.js";import{S as r}from"./Stack-D20fMUwC.js";import{T as x}from"./Tooltip-CMRLsTdj.js";import{T as a}from"./Typography-BDGmkVcT.js";import{D as T}from"./Divider-BO103as7.js";import"./preload-helper-PPVm8Dsz.js";import"./createSimplePaletteValueFilter-DN32wl-V.js";import"./useTheme-DPBzlcun.js";import"./useSlot-GLWRGkZZ.js";import"./mergeSlotProps-B-azXoBS.js";import"./isFocusVisible-BGAfa7XH.js";import"./useSlotProps-D0avlht8.js";import"./Grow-6QFaMN_8.js";import"./index-B-Oj3rGR.js";import"./index-CF_rmhYK.js";import"./dividerClasses-CejtYPgv.js";const D=g(e.jsx("path",{d:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m-1-4h2v2h-2zm1.61-9.96c-2.06-.3-3.88.97-4.43 2.79-.18.58.26 1.17.87 1.17h.2c.41 0 .74-.29.88-.67.32-.89 1.27-1.5 2.3-1.28.95.2 1.65 1.13 1.57 2.1-.1 1.34-1.62 1.63-2.45 2.88 0 .01-.01.01-.01.02-.01.02-.02.03-.03.05-.09.15-.18.32-.25.5-.01.03-.03.05-.04.08-.01.02-.01.04-.02.07-.12.34-.2.75-.2 1.25h2c0-.42.11-.77.28-1.07.02-.03.03-.06.05-.09.08-.14.18-.27.28-.39.01-.01.02-.03.03-.04.1-.12.21-.23.33-.34.96-.91 2.26-1.65 1.99-3.56-.24-1.74-1.61-3.21-3.35-3.47"}));function d({title:l,helperText:c,metrics:p}){const m=p.length===2;return e.jsxs(r,{gap:2,className:"data-card-container",children:[e.jsxs(r,{gap:1,direction:"row",className:"data-card-header",alignItems:"center",children:[l,c&&e.jsx(x,{title:c,placement:"top",arrow:!0,children:e.jsx(D,{color:"secondary"})})]}),e.jsx(r,{className:"data-card-metrics-row",gap:2,direction:"row",alignItems:"stretch",children:p.map(({label:t,value:n,unit:o},h)=>e.jsxs(u.Fragment,{children:[e.jsxs(r,{className:"data-card-metric-container",gap:1,children:[t&&e.jsx(a,{variant:"chipLabel",children:t}),e.jsxs(r,{gap:.5,direction:"row",alignItems:"flex-end",children:[e.jsx(a,{variant:"metric",children:n}),e.jsx(a,{variant:"chipLabel",children:o})]})]},`${t}-${n}-${o}-data-card-metric`),m&&h===0&&e.jsx(T,{orientation:"vertical",flexItem:!0,className:"data-card-metrics-row-divider"})]},`${t}-${n}-${o}-data-card-metric`))})]})}d.__docgenInfo={description:"",methods:[],displayName:"DataCard",props:{title:{required:!0,tsType:{name:"ReactNode"},description:""},helperText:{required:!1,tsType:{name:"string"},description:""},metrics:{required:!0,tsType:{name:"union",raw:"[DataCardMetric] | [DataCardMetric, DataCardMetric]",elements:[{name:"tuple",raw:"[DataCardMetric]",elements:[{name:"DataCardMetric"}]},{name:"tuple",raw:"[DataCardMetric, DataCardMetric]",elements:[{name:"DataCardMetric"},{name:"DataCardMetric"}]}]},description:""}}};const E={title:"Display/DataCard",component:d,parameters:{layout:"centered"},args:{}},s={args:{title:e.jsx(a,{children:"% Savings"}),helperText:"this should show up in a tooltip",metrics:[{value:0,unit:"%"}]}},i={args:{title:e.jsxs(a,{children:["Total ",e.jsx("strong",{children:"DATA Received"})]}),helperText:"this should show up in a tooltip",metrics:[{label:"Logs",value:100,unit:"GB"},{label:"Traces",value:45,unit:"MM Spans"}]}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    title: <Typography>% Savings</Typography>,
    helperText: "this should show up in a tooltip",
    metrics: [{
      value: 0,
      unit: "%"
    }]
  }
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    title: <Typography>
        Total <strong>DATA Received</strong>
      </Typography>,
    helperText: "this should show up in a tooltip",
    metrics: [{
      label: "Logs",
      value: 100,
      unit: "GB"
    }, {
      label: "Traces",
      value: 45,
      unit: "MM Spans"
    }]
  }
}`,...i.parameters?.docs?.source}}};const B=["Single","Double"];export{i as Double,s as Single,B as __namedExportsOrder,E as default};
