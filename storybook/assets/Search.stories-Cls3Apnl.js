import{r as s,j as i}from"./iframe-B8WsEGHq.js";import{S as o}from"./SearchField-Bw0F6tGM.js";import"./preload-helper-CZWHLvzI.js";import"./Autocomplete-jEjMm1BV.js";import"./TextField-Lu4Gza8g.js";import"./Typography-BZhPPhck.js";import"./useSlot-U6_aPKPU.js";import"./mergeSlotProps-CAETWj2Y.js";import"./useFormControl-DU5kopq1.js";import"./ownerDocument-DW-IO8s5.js";import"./useSlotProps-BQNBN2GS.js";import"./Paper-BfH9b8vB.js";import"./Grow-Cfc93Vzc.js";import"./utils-BzYjJIVb.js";import"./index-BIapRzG0.js";import"./index-bF7fSFuN.js";import"./Popper-Djh0oyLU.js";import"./useControlled-CO8Qmhc-.js";import"./createSvgIcon-D6VDE93t.js";import"./Close-Tf9DWZwr.js";import"./CircularProgress-DGPOJjrh.js";import"./Chip-DNLVBqnj.js";const p=()=>{},k={title:"Control/Search",component:o,parameters:{layout:"centered"},args:{options:["service 1","service 2","Service 10","Service 3"],value:"",onChange:p},argTypes:{value:{table:{disable:!0}},onChange:{table:{disable:!0}}}},e={render:function(r){const[a,n]=s.useState(r.value);return i.jsx(o,{...r,value:a,onChange:t=>{n(t),r.onChange(t)}})}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return <SearchField {...args} value={value} onChange={nextValue => {
      setValue(nextValue);
      args.onChange(nextValue);
    }} />;
  }
}`,...e.parameters?.docs?.source}}};const q=["Default"];export{e as Default,q as __namedExportsOrder,k as default};
