export const FIX_CONTENT = {
  notReceiving: {
    title: "Not receiving data",
    content: `Please check to make sure that you have updated and restarted your datadog agent.

Contact us if you need help [docs link]`,
    code: `this should be the datadog agent url copy/paste block`,
  },
  notSending: {
    title: `Not sending data`,
    content: `Please check to make sure that you have correctly input your datadog site URL

conctact us if you need help [docs link]`,
    code: `maybe this is an input`,
  },
  missingFields: {
    title: `You're missing critical fields`,
    content: `You're missing one or more critical fields
<ul>
  <li>service_name</li>
  <li>host</li>
  <li>etc</li>
</ul>
contact us to ensure you have the right settings. [docs link]`,
    code: `copy paste this and send to us`,
  },
  resourceLimit: {
    title: `Additional requirements needed for Datadog setup`,
    content: `You do not have enough resources available in your cluster.

Try to change your cluster settings.

If you need help with this, contact us. [docs link]`,
    code: `last 10-20 log messages`,
  },
  oom: {
    title: `Additional requirements needed for Datadog setup`,
    content: `You do not have enough memory allocated for this resource.

Try to change your collector settings.

If you need help with this, contact us. [docs link]`,
    code: `last 10-20 log messages`,
  },
};
