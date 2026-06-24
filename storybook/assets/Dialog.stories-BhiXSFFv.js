import{j as e}from"./iframe-B8WsEGHq.js";import{A as g}from"./ArgoInstallDialog-jlQ15Nti.js";import{D as R,c as S,I as y,R as C,E as b,S as p,a as t,b as u,C as E}from"./routing-BwEPs6n6.js";import{W as x}from"./WarningAmberRounded-CtIL2_Bo.js";import{m as v}from"./memory-location-DmpAJHvp.js";import{B as r}from"./Button-CO9sK1fg.js";import{T as d}from"./Typography-BZhPPhck.js";import{S as O}from"./Stack-DjRt2RXZ.js";import"./preload-helper-CZWHLvzI.js";import"./Box-CbO0Nqhl.js";import"./index-DI4pvUGu.js";import"./Alert-DpEbhGFo.js";import"./useSlot-U6_aPKPU.js";import"./mergeSlotProps-CAETWj2Y.js";import"./createSvgIcon-D6VDE93t.js";import"./Close-Tf9DWZwr.js";import"./CircularProgress-DGPOJjrh.js";import"./Paper-BfH9b8vB.js";import"./Cancel-CmtRCNND.js";import"./MenuItem-DVmN25Oo.js";import"./SwitchBase-DB9gsZ7O.js";import"./useFormControl-DU5kopq1.js";import"./useControlled-CO8Qmhc-.js";import"./TextField-Lu4Gza8g.js";import"./ownerDocument-DW-IO8s5.js";import"./useSlotProps-BQNBN2GS.js";import"./Grow-Cfc93Vzc.js";import"./utils-BzYjJIVb.js";import"./index-BIapRzG0.js";import"./index-bF7fSFuN.js";import"./Popper-Djh0oyLU.js";import"./Divider-DSOkfWGd.js";import"./Tooltip-CHS2PaHM.js";import"./Accordion-ixPjHsbE.js";import"./index-D6GmIEuN.js";import"./Chip-DNLVBqnj.js";import"./Card-DqXOohIp.js";import"./CardContent-D7kPBzTw.js";import"./CardHeader-2wH9UmRh.js";import"./CardActions-JBHCnL4c.js";import"./HealthWidget-C7UwckAq.js";const f=`datadog:
  # Enable this only if applications send traces to the agent over TCP:8126
  portEnabled: true
  port: 8126

env:
  - name: DD_APM_DD_URL
    value: "http://dd-collector.mdai.svc.cluster.local:8126"`,me={title:"Display/Dialog",component:R,parameters:{layout:"centered"},args:{open:!0,title:"Update your Datadog agent",onClose:()=>null,children:e.jsxs(O,{gap:1.5,children:[e.jsx(d,{variant:"body2",color:"secondary",children:"Update your Datadog agent config in your Kubernetes cluster or Argo CD project and restart it with the updated manifest changes."}),e.jsx(d,{variant:"body2",color:"secondary",children:"To update, you’ll need to copy and paste the code snippet of the data type(s) you previously selected."}),e.jsx(E,{code:f,maxHeight:"260px"})]}),actions:e.jsx(r,{variant:"contained",size:"small",children:"I've updated my Datadog agent"})}},o={},n={args:{title:"Continue without validation?",icon:e.jsx(x,{color:"warning"}),description:"The install has not completed validation. You can continue, but some connection checks may be unavailable.",children:void 0,actions:e.jsxs(e.Fragment,{children:[e.jsx(r,{variant:"text",color:"secondary",children:"Cancel"}),e.jsx(r,{variant:"contained",children:"Continue"})]})}},a={args:{title:"Collector update failed",icon:e.jsx(b,{color:"error"}),description:"Octant could not finish applying the collector settings. Review the details below, then try again.",children:e.jsx(d,{variant:"body2",color:"secondary",children:"Deployment timed out while waiting for collector pods to become ready."}),actions:e.jsxs(e.Fragment,{children:[e.jsx(r,{variant:"text",color:"secondary",children:"Close"}),e.jsx(r,{variant:"contained",children:"Try again"})]})}},s={render:()=>{const m=S({argoAgreement:!1,lastCompletedStep:1}),{hook:h}=v({path:"/some-other-route"});return e.jsx(y,{value:m,children:e.jsx(C,{hook:h,children:e.jsx(g,{})})})}},i={render:()=>e.jsx(p,{open:!0,onClose:()=>null,errorInfo:{header:"Smarthub setup failed",severity:u.ERROR,body:"An error occurred while setting up the smarthub.",actions:[{text:"Close",act:[t.CLOSE]},{text:"Report bug",act:[t.REPORT_BUG]}]}})},c={render:()=>e.jsx(p,{open:!0,onClose:()=>null,errorInfo:{header:"Smarthub setup warning",severity:u.WARN,body:"Some issues were detected during setup.",actions:[{text:"Visit docs",act:[t.VISIT_DOCS]},{text:"Close",act:[t.CLOSE]}]}})},l={render:()=>e.jsx(p,{open:!0,onClose:()=>null,errorInfo:{header:"Network error",severity:u.ERROR,body:"Could not reach the smarthub.",networkErrorInfo:`Error 503: Service Unavailable
Host: smarthub.local`,actions:[{text:"Close",act:[t.CLOSE]}]}})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:"{}",...o.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
}`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => {
    const store = createInstallAndConnectStore({
      argoAgreement: false,
      lastCompletedStep: 1
    });
    const {
      hook
    } = memoryLocation({
      path: "/some-other-route"
    });
    return <InstallAndConnectContext value={store}>
        <Router hook={hook}>
          <ArgoInstallDialog />
        </Router>
      </InstallAndConnectContext>;
  }
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <SetupSmarthubDialog open={true} onClose={() => null} errorInfo={{
    header: "Smarthub setup failed",
    severity: ERROR_SEVERITY.ERROR,
    body: "An error occurred while setting up the smarthub.",
    actions: [{
      text: "Close",
      act: [ERROR_MODAL_ACT.CLOSE]
    }, {
      text: "Report bug",
      act: [ERROR_MODAL_ACT.REPORT_BUG]
    }]
  }} />
}`,...i.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <SetupSmarthubDialog open={true} onClose={() => null} errorInfo={{
    header: "Smarthub setup warning",
    severity: ERROR_SEVERITY.WARN,
    body: "Some issues were detected during setup.",
    actions: [{
      text: "Visit docs",
      act: [ERROR_MODAL_ACT.VISIT_DOCS]
    }, {
      text: "Close",
      act: [ERROR_MODAL_ACT.CLOSE]
    }]
  }} />
}`,...c.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <SetupSmarthubDialog open={true} onClose={() => null} errorInfo={{
    header: "Network error",
    severity: ERROR_SEVERITY.ERROR,
    body: "Could not reach the smarthub.",
    networkErrorInfo: "Error 503: Service Unavailable\\nHost: smarthub.local",
    actions: [{
      text: "Close",
      act: [ERROR_MODAL_ACT.CLOSE]
    }]
  }} />
}`,...l.parameters?.docs?.source}}};const he=["Default","Warning","Error","ArgoInstall","SetupSmarthubError","SetupSmarthubWarning","SetupSmarthubNetworkError"];export{s as ArgoInstall,o as Default,a as Error,i as SetupSmarthubError,l as SetupSmarthubNetworkError,c as SetupSmarthubWarning,n as Warning,he as __namedExportsOrder,me as default};
