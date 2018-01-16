
/* class copied from omtd-platform git repository */

export class Description {
  desc : string;
  label : string;
  mandatory : boolean;
  recommended : boolean;
}


/* Description of the repository interface repeating form */
export let interfaceFormDesc = {
  desc : 'form for adding new interfaces of the repository',
  label : 'Interface',
  mandatory: true,
  recommended: false
};


/* Desription of the Datasource Update Form fields */
export let softwarePlatformDesc = {
  desc : 'the software platform that the repository uses',
  label: 'Software Platform (*)',
  mandatory: true,
  recommended: false
};

export let platformNameDesc = {
  desc : 'the name of the software platform that the repository uses',
  label : '',
  mandatory: true,
  recommended: false
};

export let officialNameDesc = {
  desc : 'the official name of the repository',
  label : 'Official Name (*)',
  mandatory : true,
  recommended : false
};

export let repoDescriptionDesc = {
  desc : 'a description for the repository',
  label : 'Description (*)',
  mandatory : true,
  recommended : false
};

export let countryDesc = {
  desc : 'the name of a country',
  label : 'Country (*)',
  mandatory : true,
  recommended : false
};

export let longtitudeDesc = {
  desc : 'longtitude of the repository position',
  label : 'Longtitude (*)',
  mandatory : true,
  recommended : false
};

export let latitudeDesc = {
  desc : 'latitude of the repository position',
  label : 'Latitude (*)',
  mandatory : true,
  recommended : false
};

export let websiteUrlDesc = {
  desc : 'the repository\'s web address',
  label : 'Entry URL (*)',
  mandatory : true,
  recommended : false
};

export let institutionNameDesc = {
  desc : 'the name of the institution that the repository belongs to',
  label : 'Institution (*)',
  mandatory : true,
  recommended : false
};

export let englishNameDesc = {
  desc : 'the name of the repository in english',
  label : 'English Name (*)',
  mandatory : true,
  recommended : false
};

export let logoUrlDesc = {
  desc : 'the url of a logo for the repository',
  label : 'Logo URL',
  mandatory : false,
  recommended : false
};

export let timezoneDesc = {
  desc : 'timezone of the repository country',
  label : 'Timezone (*)',
  mandatory : true,
  recommended : false
};

export let datasourceTypeDesc = {
  desc : 'the type of the datasource',
  label : 'Datasource Type (*)',
  mandatory : true,
  recommended : false
};

export let adminEmailDesc = {
  desc : 'the email address of the datasource administrator',
  label : 'Admin Email (*)',
  mandatory : true,
  recommended : false
};
