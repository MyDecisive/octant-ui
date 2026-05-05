import{r as i,j as p}from"./iframe-BLQrpW8o.js";import{S as o}from"./SearchField-Bzrab4ca.js";import"./preload-helper-CZWHLvzI.js";import"./TextField-ytdQnRvh.js";import"./Select-XdGlumWj.js";import"./useFormControl-3Txl3AZy.js";import"./createSimplePaletteValueFilter-4EAdbq0S.js";import"./useSlot-D5iPdcjh.js";import"./mergeSlotProps-D56iNpyO.js";import"./isFocusVisible-CC5yGX_k.js";import"./useSlotProps-BYKxImRh.js";import"./Grow-v8Ib4nUB.js";import"./index-xT9bB6IN.js";import"./index-BUBSTMO-.js";import"./useTheme-Bp_xjIku.js";import"./utils-DjY_ORy6.js";import"./useTimeout-CrPtF72_.js";import"./Paper-BCO45gF-.js";import"./createSvgIcon-BbJ07adR.js";import"./Close-CczcXS1Y.js";import"./Popper-BjqKYi_p.js";import"./Chip-CrkwjSKO.js";import"./ButtonBase-anrEY3YH.js";import"./IconButton-C28kFpnQ.js";import"./CircularProgress-BCdOHeSD.js";import"./Typography-Dsq_sGuc.js";const s=()=>{},A={title:"Control/Search",component:o,parameters:{layout:"centered"},args:{options:["service 1","service 2","Service 10","Service 3"],value:"",onChange:s},argTypes:{value:{table:{disable:!0}},onChange:{table:{disable:!0}}}},e={render:function(r){const[a,n]=i.useState(r.value);return p.jsx(o,{...r,value:a,onChange:t=>{n(t),r.onChange(t)}})}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return <SearchField {...args} value={value} onChange={nextValue => {
      setValue(nextValue);
      args.onChange(nextValue);
    }} />;
  }
}`,...e.parameters?.docs?.source}}};const B=["Default"];export{e as Default,B as __namedExportsOrder,A as default};
