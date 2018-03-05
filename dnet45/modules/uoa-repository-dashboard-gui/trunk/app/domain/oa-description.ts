/*
*  created by myrto 12/2017
*/

/* class copied from omtd-platform git repository */

/* THE DESCRIPTION TEXTS PROBABLY NEED REVIEWING ! */

export class Description {
  desc : string;
  label : string;
  mandatory : boolean;
  recommended : boolean;
}


/* Description of the repository interface repeating form */
export let interfaceFormDesc = {
  desc : 'Form for updating or creating new interfaces for your repository/journal',
  label : 'Interface',
  mandatory : true,
  recommended : false
};


/* Desription of the Datasource Info Forms Fields */
export let softwarePlatformDesc = {
  desc : 'The typology used by your repository/journal.\nIf you use a typology not found in the drop-down list,\nyou can enter a custom name in the field below.',
  label : 'Software Platform (*)',
  mandatory: true,
  recommended: false
};

export let platformNameDesc = {
  desc : 'The typology used by your repository/journal.\nIf you use a typology not found in the above drop-down list,\nyou can enter a custom name here.',
  label : '',
  mandatory: true,
  recommended: false
};

export let officialNameDesc = {
  desc : 'Your repository\'s/journal\'s official name.',
  label : 'Official Name (*)',
  mandatory : true,
  recommended : false
};

export let issnDesc = {
  desc : 'Input your journal\'s issn (www.issn.org)',
  label : 'ISSN (*)',
  mandatory : true,
  recommended : false
};

export let eissnDesc = {
  desc : 'Input your journal\'s eissn, if it has one (www.issn.org)',
  label : 'EISSN',
  mandatory : false,
  recommended : false
};

export let lissnDesc = {
  desc : 'Input your journal\'s lissn, if it has one (www.issn.org)',
  label : 'LISSN',
  mandatory : false,
  recommended : false
};

export let repoDescriptionDesc = {
  desc : 'A description of your repository/journal',
  label : 'Description (*)',
  mandatory : true,
  recommended : false
};

export let countryDesc = {
  desc : 'The country where your repository/journal is located',
  label : 'Country (*)',
  mandatory : true,
  recommended : false
};

export let longtitudeDesc = {
  desc : 'The (approximate) longtitude of your repository/journal\'s location',
  label : 'Longtitude (*)',
  mandatory : true,
  recommended : false
};

export let latitudeDesc = {
  desc : 'The (approximate) latitude of your repository/journal\'s location',
  label : 'Latitude (*)',
  mandatory : true,
  recommended : false
};

export let websiteUrlDesc = {
  desc : 'The main page of your repository/journal\'s website',
  label : 'Entry URL (*)',
  mandatory : true,
  recommended : false
};

export let institutionNameDesc = {
  desc : 'The institution that your repository belongs to',
  label : 'Institution (*)',
  mandatory : true,
  recommended : false
};

export let englishNameDesc = {
  desc : 'Your repository/journal\'s name in english',
  label : 'English Name (*)',
  mandatory : true,
  recommended : false
};

export let logoUrlDesc = {
  desc : 'A link to an image file containing your repository/journal\'s logo',
  label : 'Logo URL',
  mandatory : false,
  recommended : false
};

export let timezoneDesc = {
  desc : 'The timezone of the area where your repository/ journal is located',
  label : 'Timezone (*)',
  mandatory : true,
  recommended : false
};

export let datasourceTypeDesc = {
  desc : 'The type of your repository',
  label : 'Datasource Type (*)',
  mandatory : true,
  recommended : false
};

export let journalTypeDesc = {
  desc : 'The type of your journal',
  label : 'Journal Type (*)',
  mandatory : true,
  recommended : false
};

export let aggregatorTypeDesc = {
  desc : 'The type of your aggregator',
  label : 'Aggregator Type (*)',
  mandatory : true,
  recommended : false
};

export let adminEmailDesc = {
  desc : 'The email address of the repository/journal\'s administrator',
  label : 'Admin Email (*)',
  mandatory : true,
  recommended : false
};

export let baseUrlDesc = {
  desc : 'The url that handles the external OAI-PMH requests for the repository/journal.\nIf you are not sure about the base URL of the repository/journal you want to register,\nplease contact the repository/journal\s administrator.',
  label : 'Base URL',
  mandatory : true,
  recommended : false
};

export let existingValSetDesc = {
  desc : 'The main set that contains EC or other funder records and will be used for validation.\nIf you are using the OJS plugin make sure to specify it correctly.',
  label : 'Available validation sets',
  mandatory : false,
  recommended : false
};

export let customValSetDesc = {
  desc : 'If the validation set you want to use is not in the drop list above, enter a custom one here.',
  label : 'Custom validation set',
  mandatory : false,
  recommended : false
};

export let compatibilityLevelDesc = {
  desc : 'Choose your desired compatibility level from the list',
  label : 'Desired Compatibility Level',
  mandatory : true,
  recommended : false
};
