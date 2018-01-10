
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

export let validationSetDesc = {
  desc: 'Field to choose a validation set for the repository interface or create a new one',
  label: 'Validation Set',
  mandatory: true,
  recommended: false
};

export let  interfaceFormDesc = {
  desc : 'form for adding new interfaces of the repository',
  label : 'Interface',
  mandatory: true,
  recommended: false
}
