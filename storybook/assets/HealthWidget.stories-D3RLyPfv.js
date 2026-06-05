import{H as r}from"./HealthWidget-CFVJki1r.js";import"./iframe-Cr7zBGH4.js";import"./preload-helper-CZWHLvzI.js";import"./Accordion-BurHD1r7.js";import"./createSvgIcon-DyRFfMV-.js";import"./Typography-BTnrTbuF.js";import"./styled-CMcOnYei.js";import"./index-2liZRfFu.js";import"./useSlot-CzltthvI.js";import"./useControlled-Nu0l2aNg.js";import"./utils-CzPDRJhk.js";import"./index-C1reNYPM.js";import"./index-CEEwDAWx.js";import"./Paper-2oGUyTlV.js";import"./CircularProgress-D7flg9L-.js";import"./Card-By4v8Nh1.js";import"./CardHeader-B-SosgTY.js";import"./CardContent-Csj1l_a8.js";import"./CardActions-B3LZsFlb.js";import"./Button-Dk1XK6QB.js";import"./Cancel-C3rABeId.js";import"./Stack-DybawtqF.js";import"./Chip-COA1rOXO.js";import"./Divider-CgBAP-NK.js";const W={title:"Components/HealthWidget",component:r,parameters:{layout:"centered"},args:{}},e={args:{simple:!0,status:"operational",title:"Smarthub Infrastructure"}},t={args:{simple:!0,status:"loading",title:"Smarthub Infrastructure"}},n={args:{simple:!0,status:"error",title:"Smarthub Infrastructure",fix:{label:"How to fix",description:"{Generic description}",actions:[{text:"See our docs",onClick:()=>console.log("clicked the thing")}]}}},o={args:{status:"operational",title:"Datadog connection",facets:[{label:"Clients connected",health:!0},{label:"Receiving data",health:!0},{label:"Sending data",health:!0},{label:"Data integrity",health:!0}]}},a={args:{status:"loading",title:"Datadog connection",facets:[{label:"Clients connected",loading:!0},{label:"Receiving data",loading:!0},{label:"Sending data",loading:!0},{label:"Data integrity",loading:!0}]}},i={args:{status:"error",title:"Datadog connection",facets:[{label:"Clients connected",health:!1,fix:{label:"How to fix",description:"{Generic description}",actions:[{text:"See our docs",onClick:()=>console.log("clicked the thing")}]}},{label:"Receiving data",health:!1,fix:{label:"How to fix",description:"{Generic description}",actions:[{text:"See our docs",onClick:()=>console.log("clicked the thing")}]}},{label:"Sending data",health:!1,fix:{label:"How to fix",description:"{Generic description}",actions:[{text:"See our docs",onClick:()=>console.log("clicked the thing")}]}},{label:"Data integrity",health:!1,fix:{label:"How to fix",description:"{Generic description}",actions:[{text:"See our docs",onClick:()=>console.log("clicked the thing")}]}}]}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    simple: true,
    status: "operational",
    title: "Smarthub Infrastructure"
  }
}`,...e.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    simple: true,
    status: "loading",
    title: "Smarthub Infrastructure"
  }
}`,...t.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    simple: true,
    status: "error",
    title: "Smarthub Infrastructure",
    fix: {
      label: "How to fix",
      description: "{Generic description}",
      actions: [{
        text: "See our docs",
        onClick: () => console.log("clicked the thing")
      }]
    }
  }
}`,...n.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    status: "operational",
    title: "Datadog connection",
    facets: [{
      label: "Clients connected",
      health: true
    }, {
      label: "Receiving data",
      health: true
    }, {
      label: "Sending data",
      health: true
    }, {
      label: "Data integrity",
      health: true
    }]
  }
}`,...o.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    status: "loading",
    title: "Datadog connection",
    facets: [{
      label: "Clients connected",
      loading: true
    }, {
      label: "Receiving data",
      loading: true
    }, {
      label: "Sending data",
      loading: true
    }, {
      label: "Data integrity",
      loading: true
    }]
  }
}`,...a.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    status: "error",
    title: "Datadog connection",
    facets: [{
      label: "Clients connected",
      health: false,
      fix: {
        label: "How to fix",
        description: "{Generic description}",
        actions: [{
          text: "See our docs",
          onClick: () => console.log("clicked the thing")
        }]
      }
    }, {
      label: "Receiving data",
      health: false,
      fix: {
        label: "How to fix",
        description: "{Generic description}",
        actions: [{
          text: "See our docs",
          onClick: () => console.log("clicked the thing")
        }]
      }
    }, {
      label: "Sending data",
      health: false,
      fix: {
        label: "How to fix",
        description: "{Generic description}",
        actions: [{
          text: "See our docs",
          onClick: () => console.log("clicked the thing")
        }]
      }
    }, {
      label: "Data integrity",
      health: false,
      fix: {
        label: "How to fix",
        description: "{Generic description}",
        actions: [{
          text: "See our docs",
          onClick: () => console.log("clicked the thing")
        }]
      }
    }]
  }
}`,...i.parameters?.docs?.source}}};const _=["SimpleGreen","SimpleLoading","SimpleRed","ComplexGreen","ComplexLoading","ComplexRed"];export{o as ComplexGreen,a as ComplexLoading,i as ComplexRed,e as SimpleGreen,t as SimpleLoading,n as SimpleRed,_ as __namedExportsOrder,W as default};
