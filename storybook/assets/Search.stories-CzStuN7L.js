import{r as i,j as p}from"./iframe-Cr7zBGH4.js";import{S as o}from"./SearchField-B5GcKuux.js";import"./preload-helper-CZWHLvzI.js";import"./Autocomplete-W5Q7UWff.js";import"./TextField-BKa7Tr_r.js";import"./styled-CMcOnYei.js";import"./useSlot-CzltthvI.js";import"./Typography-BTnrTbuF.js";import"./useFormControl-CEfaY_mb.js";import"./Modal-D_PHrWM4.js";import"./ownerDocument-DW-IO8s5.js";import"./Portal-DVFF4eS7.js";import"./index-C1reNYPM.js";import"./index-CEEwDAWx.js";import"./getReactElementRef-CRE5T1BE.js";import"./utils-CzPDRJhk.js";import"./useSlotProps-BbNWoeNR.js";import"./Grow-BzGLxtYT.js";import"./Paper-2oGUyTlV.js";import"./useControlled-Nu0l2aNg.js";import"./createSvgIcon-DyRFfMV-.js";import"./Close-DgPuxw0p.js";import"./Popper-CVpIypLr.js";import"./Chip-COA1rOXO.js";import"./CircularProgress-D7flg9L-.js";import"./IconButton-CWlHFbhE.js";const s=()=>{},A={title:"Control/Search",component:o,parameters:{layout:"centered"},args:{options:["service 1","service 2","Service 10","Service 3"],value:"",onChange:s},argTypes:{value:{table:{disable:!0}},onChange:{table:{disable:!0}}}},e={render:function(r){const[a,n]=i.useState(r.value);return p.jsx(o,{...r,value:a,onChange:t=>{n(t),r.onChange(t)}})}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return <SearchField {...args} value={value} onChange={nextValue => {
      setValue(nextValue);
      args.onChange(nextValue);
    }} />;
  }
}`,...e.parameters?.docs?.source}}};const B=["Default"];export{e as Default,B as __namedExportsOrder,A as default};
