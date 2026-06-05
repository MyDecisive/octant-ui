import{j as e,r as j}from"./iframe-Cr7zBGH4.js";import{A as B}from"./Accordion-BurHD1r7.js";import{S as M}from"./SliderControl-BTTHvpfX.js";import{S as s}from"./Stack-DybawtqF.js";import{T as c}from"./Typography-BTnrTbuF.js";import{C as b}from"./Chip-COA1rOXO.js";import{f as z,C as i}from"./Clarity.copy-BMdnQUo2.js";import{D as v}from"./Divider-CgBAP-NK.js";import{S as D}from"./Switch-Dc7liqaL.js";import{B as S}from"./Button-Dk1XK6QB.js";import{C as H}from"./Card-By4v8Nh1.js";import{C as G}from"./CardContent-Csj1l_a8.js";import{C as K}from"./CardHeader-B-SosgTY.js";import{B as O}from"./Box-Bkj_Kqu3.js";import"./preload-helper-CZWHLvzI.js";import"./createSvgIcon-DyRFfMV-.js";import"./styled-CMcOnYei.js";import"./index-2liZRfFu.js";import"./useSlot-CzltthvI.js";import"./useControlled-Nu0l2aNg.js";import"./utils-CzPDRJhk.js";import"./index-C1reNYPM.js";import"./index-CEEwDAWx.js";import"./Paper-2oGUyTlV.js";import"./CircularProgress-D7flg9L-.js";import"./ownerDocument-DW-IO8s5.js";import"./useSlotProps-BbNWoeNR.js";import"./SwitchBase-DgdfxMME.js";import"./useFormControl-CEfaY_mb.js";const C={size:"small",variant:"filled",clickable:!1};function A({title:n,includeErr:r,pctSampled:t}){return e.jsxs(s,{direction:"row",alignItems:"center",gap:2,children:[e.jsx(c,{variant:"body1",children:n}),e.jsxs(s,{direction:"row",alignItems:"center",gap:1,children:[!r&&!t&&e.jsx(b,{label:"None applied",disabled:!0,...C}),r&&e.jsx(b,{label:"Keep errors",color:"success",...C}),t&&e.jsx(b,{label:`${t.toLocaleString()}%`,color:"success",...C})]})]})}A.__docgenInfo={description:"",methods:[],displayName:"FilterCardTitle",props:{pctSampled:{required:!1,tsType:{name:"number"},description:""},includeErr:{required:!1,tsType:{name:"boolean"},description:""},title:{required:!0,tsType:{name:"string"},description:""}}};function u({label:n,value:r,unit:t}){return e.jsxs(s,{className:"filter-card-metric-row",direction:"row",justifyContent:"flex-end",alignItems:"flex-end",children:[e.jsx(c,{variant:"chipLabel",className:"filter-card-metric-row-label",children:n}),e.jsx(c,{variant:"body1",children:z(r)}),e.jsx(c,{className:"filter-card-metric-row-unit",color:"secondary",variant:"chipLabel",children:t})]})}u.__docgenInfo={description:"",methods:[],displayName:"MetricRow",props:{label:{required:!0,tsType:{name:"string"},description:""},value:{required:!1,tsType:{name:"number"},description:""},unit:{required:!0,tsType:{name:"string"},description:""}}};function w({title:n,received:r,sent:t,filtered:a,pctSampled:o,loading:l,includeErr:d,unit:f,onApplyFilter:N}){const y=o??0,g=d??!1,[h,T]=j.useState(y),[x,E]=j.useState(g),R=q=>E(q.target.checked),_=(q,k)=>T(k),F=h===y&&x===g,L=()=>{T(y),E(g)},I=()=>{N(h,x)};return e.jsx(B,{className:"filter-card-container",title:e.jsx(A,{title:n,pctSampled:o,includeErr:d}),content:e.jsxs(s,{gap:2,children:[e.jsxs(s,{gap:1,children:[e.jsx(u,{label:i.filterCard.rows.ingested,value:r,unit:f}),e.jsx(u,{label:i.filterCard.rows.routed,value:t,unit:f}),e.jsx(u,{label:i.filterCard.rows.dropped,value:a,unit:f})]}),e.jsx(v,{}),e.jsx(M,{value:h,label:i.filterCard.slider,valueUnits:"%",size:"small",onChange:_}),e.jsx(v,{}),e.jsxs(s,{direction:"row",justifyContent:"space-between",alignItems:"center",children:[e.jsx(c,{variant:"chipLabel",children:i.filterCard.toggle}),e.jsx(D,{checked:x,onChange:R})]}),e.jsx(v,{}),e.jsxs(s,{className:"filter-widget-button-container",direction:"row",gap:1,justifyContent:"flex-end",children:[e.jsx(S,{disabled:F,loading:l,onClick:L,variant:"text",color:"inherit",size:"small",children:i.filterCard.ctas.cancel}),e.jsx(S,{disabled:F,loading:l,onClick:I,variant:"text",size:"small",children:i.filterCard.ctas.apply})]})]})})}w.__docgenInfo={description:"",methods:[],displayName:"FilterCard",props:{title:{required:!0,tsType:{name:"string"},description:""},received:{required:!1,tsType:{name:"number"},description:""},sent:{required:!1,tsType:{name:"number"},description:""},filtered:{required:!1,tsType:{name:"number"},description:""},unit:{required:!0,tsType:{name:"string"},description:""},pctSampled:{required:!1,tsType:{name:"number"},description:""},includeErr:{required:!1,tsType:{name:"boolean"},description:""},loading:{required:!1,tsType:{name:"boolean"},description:""},onApplyFilter:{required:!0,tsType:{name:"signature",type:"function",raw:"(pctSampled: number, includeErr: boolean) => Promise<void>",signature:{arguments:[{type:{name:"number"},name:"pctSampled"},{type:{name:"boolean"},name:"includeErr"}],return:{name:"Promise",elements:[{name:"void"}],raw:"Promise<void>"}}},description:""}}};function P({title:n,description:r,actionLabel:t,onAction:a}){return e.jsx(H,{className:"filter-card-empty-state-container",children:e.jsxs(G,{className:"filter-card-empty-state-content",children:[e.jsx(K,{title:n,subheader:r,slotProps:{title:{variant:"h6"},subheader:{variant:"body2"}}}),e.jsx(S,{variant:"contained",size:"small",onClick:a,children:t})]})})}P.__docgenInfo={description:"",methods:[],displayName:"FilterEmptyStateCard",props:{title:{required:!0,tsType:{name:"string"},description:""},description:{required:!0,tsType:{name:"string"},description:""},actionLabel:{required:!0,tsType:{name:"string"},description:""},onAction:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""}}};const ve={title:"Components/FilterCard",component:w,decorators:[n=>e.jsx(O,{maxWidth:400,children:e.jsx(n,{})})],parameters:{layout:"centered"},args:{}},p={args:{title:"Log Filtering",unit:"GB",received:89.12345,sent:32.501245,filtered:50.2,onApplyFilter:(n,r)=>(console.log("apply trace filter changes ",{volume:n,persist:r}),new Promise(t=>t()))},render:function(r){const[t,a]=j.useState({pctSampled:r.pctSampled,includeErr:r.includeErr});return e.jsx(w,{...r,pctSampled:t.pctSampled,includeErr:t.includeErr,onApplyFilter:(o,l)=>(a({pctSampled:o,includeErr:l}),r.onApplyFilter(o,l),new Promise(d=>d()))})}},m={args:{title:"Traces filters",unit:"MM Spans",received:0,sent:0,filtered:0,onApplyFilter:(n,r)=>(console.log("apply trace filter changes ",{volume:n,persist:r}),new Promise(t=>t()))},render:function(){return e.jsx(P,{title:"Here is why you need traces",description:"Enable traces to see what's actually happening.",actionLabel:"Turn on traces",onAction:()=>{console.log("turn on traces")}})}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    title: "Log Filtering",
    unit: "GB",
    received: 89.12345,
    sent: 32.501245,
    filtered: 50.2,
    onApplyFilter: (volume, persist) => {
      console.log("apply trace filter changes ", {
        volume,
        persist
      });
      return new Promise(resolve => resolve());
    }
  },
  render: function Render(args) {
    const [filters, setFilters] = useState<{
      pctSampled?: number;
      includeErr?: boolean;
    }>({
      pctSampled: args.pctSampled,
      includeErr: args.includeErr
    });
    return <FilterCard {...args} pctSampled={filters.pctSampled} includeErr={filters.includeErr} onApplyFilter={(volume, persist) => {
      setFilters({
        pctSampled: volume,
        includeErr: persist
      });
      void args.onApplyFilter(volume, persist);
      return new Promise(resolve => resolve());
    }} />;
  }
}`,...p.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    title: "Traces filters",
    unit: "MM Spans",
    received: 0,
    sent: 0,
    filtered: 0,
    onApplyFilter: (volume, persist) => {
      console.log("apply trace filter changes ", {
        volume,
        persist
      });
      return new Promise(resolve => resolve());
    }
  },
  render: function Render() {
    return <FilterEmptyStateCard title="Here is why you need traces" description="Enable traces to see what's actually happening." actionLabel="Turn on traces" onAction={() => {
      console.log("turn on traces");
    }} />;
  }
}`,...m.parameters?.docs?.source}}};const Ce=["Default","EmptyState"];export{p as Default,m as EmptyState,Ce as __namedExportsOrder,ve as default};
