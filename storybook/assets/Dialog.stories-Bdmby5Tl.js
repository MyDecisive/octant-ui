import{j as e}from"./iframe-Cr7zBGH4.js";import{D as v,a as b,b as j,c as C,d as D,E as T,C as w}from"./CodeSnippet-D7o3ENTj.js";import{W as R}from"./WarningAmberRounded-B_UaBAT8.js";import{c as B}from"./createSvgIcon-DyRFfMV-.js";import{S as d}from"./Stack-DybawtqF.js";import{T as r}from"./Typography-BTnrTbuF.js";import{I}from"./IconButton-CWlHFbhE.js";import{B as o}from"./Button-Dk1XK6QB.js";import"./preload-helper-CZWHLvzI.js";import"./styled-CMcOnYei.js";import"./useSlot-CzltthvI.js";import"./Paper-2oGUyTlV.js";import"./Modal-D_PHrWM4.js";import"./ownerDocument-DW-IO8s5.js";import"./Portal-DVFF4eS7.js";import"./index-C1reNYPM.js";import"./index-CEEwDAWx.js";import"./getReactElementRef-CRE5T1BE.js";import"./utils-CzPDRJhk.js";import"./Box-Bkj_Kqu3.js";import"./CircularProgress-D7flg9L-.js";const q=B(e.jsx("path",{d:"M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59 7.11 5.7a.996.996 0 0 0-1.41 0c-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41s1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0s.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4"}));function p({open:u,title:m,description:i,children:s,actions:c,icon:g,onClose:l,showCloseButton:h=!1,closeOnBackdropClick:y=!0}){const f=(N,x)=>{!y&&x==="backdropClick"||l()};return e.jsxs(v,{open:u,onClose:f,slotProps:{paper:{className:"mdai-dialog-paper"}},children:[e.jsxs(b,{children:[e.jsxs(d,{direction:"row",alignItems:"flex-start",gap:1,children:[g,e.jsx(r,{variant:"body2","data-bold":"true",component:"span",children:m})]}),h&&e.jsx(I,{"aria-label":"Close dialog",onClick:l,size:"small",disableRipple:!0,children:e.jsx(q,{fontSize:"small"})})]}),(i||s)&&e.jsxs(j,{className:"mdai-dialog-content",children:[i&&e.jsx(C,{children:i}),s]}),c&&e.jsx(D,{className:"mdai-dialog-actions",children:c})]})}p.__docgenInfo={description:"",methods:[],displayName:"Dialog",props:{open:{required:!0,tsType:{name:"boolean"},description:""},title:{required:!0,tsType:{name:"ReactNode"},description:""},description:{required:!1,tsType:{name:"ReactNode"},description:""},children:{required:!1,tsType:{name:"ReactNode"},description:""},actions:{required:!1,tsType:{name:"ReactNode"},description:""},icon:{required:!1,tsType:{name:"ReactNode"},description:""},onClose:{required:!0,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},showCloseButton:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},closeOnBackdropClick:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}}}};const E=`datadog:
  # Enable this only if applications send traces to the agent over TCP:8126
  portEnabled: true
  port: 8126

env:
  - name: DD_APM_DD_URL
    value: "http://dd-collector.mdai.svc.cluster.local:8126"`,Z={title:"Display/Dialog",component:p,parameters:{layout:"centered"},args:{open:!0,title:"Update your Datadog agent",onClose:()=>null,children:e.jsxs(d,{gap:1.5,children:[e.jsx(r,{variant:"body2",color:"secondary",children:"Update your Datadog agent config in your Kubernetes cluster or Argo CD project and restart it with the updated manifest changes."}),e.jsx(r,{variant:"body2",color:"secondary",children:"To update, you’ll need to copy and paste the code snippet of the data type(s) you previously selected."}),e.jsx(w,{code:E,maxHeight:"260px"})]}),actions:e.jsx(o,{variant:"contained",size:"small",children:"I've updated my Datadog agent"})}},t={},n={args:{title:"Continue without validation?",icon:e.jsx(R,{color:"warning"}),description:"The install has not completed validation. You can continue, but some connection checks may be unavailable.",children:void 0,actions:e.jsxs(e.Fragment,{children:[e.jsx(o,{variant:"text",color:"secondary",children:"Cancel"}),e.jsx(o,{variant:"contained",children:"Continue"})]})}},a={args:{title:"Collector update failed",icon:e.jsx(T,{color:"error"}),description:"Octant could not finish applying the collector settings. Review the details below, then try again.",children:e.jsx(r,{variant:"body2",color:"secondary",children:"Deployment timed out while waiting for collector pods to become ready."}),actions:e.jsxs(e.Fragment,{children:[e.jsx(o,{variant:"text",color:"secondary",children:"Close"}),e.jsx(o,{variant:"contained",children:"Try again"})]})}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:"{}",...t.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    title: "Continue without validation?",
    icon: <WarningAmberRoundedIcon color="warning" />,
    description: "The install has not completed validation. You can continue, but some connection checks may be unavailable.",
    children: undefined,
    actions: <>
        <Button variant="text" color="secondary">
          Cancel
        </Button>
        <Button variant="contained">Continue</Button>
      </>
  }
}`,...n.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    title: "Collector update failed",
    icon: <ErrorOutlineRoundedIcon color="error" />,
    description: "Octant could not finish applying the collector settings. Review the details below, then try again.",
    children: <Typography variant="body2" color="secondary">
        Deployment timed out while waiting for collector pods to become ready.
      </Typography>,
    actions: <>
        <Button variant="text" color="secondary">
          Close
        </Button>
        <Button variant="contained">Try again</Button>
      </>
  }
}`,...a.parameters?.docs?.source}}};const ee=["Default","Warning","Error"];export{t as Default,a as Error,n as Warning,ee as __namedExportsOrder,Z as default};
