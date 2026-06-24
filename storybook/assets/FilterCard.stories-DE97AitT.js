import{j as e,r as j}from"./iframe-B8WsEGHq.js";import{A as M}from"./Accordion-ixPjHsbE.js";import{S as z}from"./SliderControl-rHRNVLL7.js";import{S as s}from"./Stack-DjRt2RXZ.js";import{T as l}from"./Typography-BZhPPhck.js";import{C as b}from"./Chip-DNLVBqnj.js";import{f as D,C as i}from"./Clarity.copy-BMdnQUo2.js";import{D as v}from"./Divider-DSOkfWGd.js";import{S as H}from"./Switch-VNOs06Gb.js";import{B as S}from"./Button-CO9sK1fg.js";import{C as G}from"./Card-DqXOohIp.js";import{C as K}from"./CardContent-D7kPBzTw.js";import{C as O}from"./CardHeader-2wH9UmRh.js";import{B as U}from"./Box-CbO0Nqhl.js";import"./preload-helper-CZWHLvzI.js";import"./createSvgIcon-D6VDE93t.js";import"./index-D6GmIEuN.js";import"./useSlot-U6_aPKPU.js";import"./mergeSlotProps-CAETWj2Y.js";import"./useControlled-CO8Qmhc-.js";import"./utils-BzYjJIVb.js";import"./index-BIapRzG0.js";import"./index-bF7fSFuN.js";import"./Paper-BfH9b8vB.js";import"./CircularProgress-DGPOJjrh.js";import"./ownerDocument-DW-IO8s5.js";import"./useSlotProps-BQNBN2GS.js";import"./SwitchBase-DB9gsZ7O.js";import"./useFormControl-DU5kopq1.js";const C={size:"small",variant:"filled",clickable:!1};function P({title:n,includeErr:r,pctSampled:t}){return e.jsxs(s,{direction:"row",alignItems:"center",gap:2,children:[e.jsx(l,{variant:"body1",children:n}),e.jsxs(s,{direction:"row",alignItems:"center",gap:1,children:[!r&&!t&&e.jsx(b,{label:"None applied",disabled:!0,...C}),r&&e.jsx(b,{label:"Keep errors",color:"success",...C}),t&&e.jsx(b,{label:`${t.toLocaleString()}%`,color:"success",...C})]})]})}P.__docgenInfo={description:"",methods:[],displayName:"FilterCardTitle",props:{pctSampled:{required:!1,tsType:{name:"number"},description:""},includeErr:{required:!1,tsType:{name:"boolean"},description:""},title:{required:!0,tsType:{name:"string"},description:""}}};function u({label:n,value:r,unit:t}){return e.jsxs(s,{className:"filter-card-metric-row",direction:"row",justifyContent:"flex-end",alignItems:"flex-end",children:[e.jsx(l,{variant:"chipLabel",className:"filter-card-metric-row-label",children:n}),e.jsx(l,{variant:"body1",children:D(r)}),e.jsx(l,{className:"filter-card-metric-row-unit",color:"secondary",variant:"chipLabel",children:t})]})}u.__docgenInfo={description:"",methods:[],displayName:"MetricRow",props:{label:{required:!0,tsType:{name:"string"},description:""},value:{required:!1,tsType:{name:"number"},description:""},unit:{required:!0,tsType:{name:"string"},description:""}}};function w({title:n,defaultExpanded:r,received:t,sent:a,filtered:c,pctSampled:o,loading:d,includeErr:T,unit:f,onApplyFilter:R}){const y=o??0,g=T??!1,[h,E]=j.useState(y),[x,F]=j.useState(g),_=A=>F(A.target.checked),L=(A,B)=>E(B),q=h===y&&x===g,I=()=>{E(y),F(g)},k=()=>{R(h,x)};return e.jsx(M,{className:"filter-card-container",defaultExpanded:r,title:e.jsx(P,{title:n,pctSampled:o,includeErr:T}),content:e.jsxs(s,{gap:2,children:[e.jsxs(s,{gap:1,children:[e.jsx(u,{label:i.filterCard.rows.ingested,value:t,unit:f}),e.jsx(u,{label:i.filterCard.rows.routed,value:a,unit:f}),e.jsx(u,{label:i.filterCard.rows.dropped,value:c,unit:f})]}),e.jsx(v,{}),e.jsx(z,{value:h,label:i.filterCard.slider,valueUnits:"%",size:"small",onChange:L}),e.jsx(v,{}),e.jsxs(s,{direction:"row",justifyContent:"space-between",alignItems:"center",children:[e.jsx(l,{variant:"chipLabel",children:i.filterCard.toggle}),e.jsx(H,{checked:x,onChange:_})]}),e.jsx(v,{}),e.jsxs(s,{className:"filter-widget-button-container",direction:"row",gap:1,justifyContent:"flex-end",children:[e.jsx(S,{disabled:q,loading:d,onClick:I,variant:"text",color:"inherit",size:"small",children:i.filterCard.ctas.cancel}),e.jsx(S,{disabled:q,loading:d,onClick:k,variant:"text",size:"small",children:i.filterCard.ctas.apply})]})]})})}w.__docgenInfo={description:"",methods:[],displayName:"FilterCard",props:{title:{required:!0,tsType:{name:"string"},description:""},defaultExpanded:{required:!1,tsType:{name:"boolean"},description:""},received:{required:!1,tsType:{name:"number"},description:""},sent:{required:!1,tsType:{name:"number"},description:""},filtered:{required:!1,tsType:{name:"number"},description:""},unit:{required:!0,tsType:{name:"string"},description:""},pctSampled:{required:!1,tsType:{name:"number"},description:""},includeErr:{required:!1,tsType:{name:"boolean"},description:""},loading:{required:!1,tsType:{name:"boolean"},description:""},onApplyFilter:{required:!0,tsType:{name:"signature",type:"function",raw:"(pctSampled: number, includeErr: boolean) => Promise<void>",signature:{arguments:[{type:{name:"number"},name:"pctSampled"},{type:{name:"boolean"},name:"includeErr"}],return:{name:"Promise",elements:[{name:"void"}],raw:"Promise<void>"}}},description:""}}};function N({title:n,description:r,actionLabel:t,onAction:a}){return e.jsx(G,{className:"filter-card-empty-state-container",children:e.jsxs(K,{className:"filter-card-empty-state-content",children:[e.jsx(O,{title:n,subheader:r,slotProps:{title:{variant:"h6"},subheader:{variant:"body2"}}}),e.jsx(S,{variant:"contained",size:"small",onClick:a,children:t})]})})}N.__docgenInfo={description:"",methods:[],displayName:"FilterEmptyStateCard",props:{title:{required:!0,tsType:{name:"string"},description:""},description:{required:!0,tsType:{name:"string"},description:""},actionLabel:{required:!0,tsType:{name:"string"},description:""},onAction:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""}}};const Ce={title:"Components/FilterCard",component:w,decorators:[n=>e.jsx(U,{maxWidth:400,children:e.jsx(n,{})})],parameters:{layout:"centered"},args:{}},p={args:{title:"Log Filtering",unit:"GB",received:89.12345,sent:32.501245,filtered:50.2,onApplyFilter:(n,r)=>(console.log("apply trace filter changes ",{volume:n,persist:r}),new Promise(t=>t()))},render:function(r){const[t,a]=j.useState({pctSampled:r.pctSampled,includeErr:r.includeErr});return e.jsx(w,{...r,pctSampled:t.pctSampled,includeErr:t.includeErr,onApplyFilter:(c,o)=>(a({pctSampled:c,includeErr:o}),r.onApplyFilter(c,o),new Promise(d=>d()))})}},m={args:{title:"Traces filters",unit:"MM Spans",received:0,sent:0,filtered:0,onApplyFilter:(n,r)=>(console.log("apply trace filter changes ",{volume:n,persist:r}),new Promise(t=>t()))},render:function(){return e.jsx(N,{title:"Here is why you need traces",description:"Enable traces to see what's actually happening.",actionLabel:"Turn on traces",onAction:()=>{console.log("turn on traces")}})}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
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
}`,...m.parameters?.docs?.source}}};const je=["Default","EmptyState"];export{p as Default,m as EmptyState,je as __namedExportsOrder,Ce as default};
