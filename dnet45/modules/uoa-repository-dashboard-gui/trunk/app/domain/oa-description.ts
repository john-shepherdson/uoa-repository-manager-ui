
/* copied from omtd-platform git repository */

export class Description {
  desc : string;
  label : string;
  mandatory : boolean;
  recommended : boolean;
}

export let baseUrlDesc = {
  desc: 'Base Url',
  label: 'Base OAI-PMH URL (*)',
  mandatory: true,
  recommended: false
};
