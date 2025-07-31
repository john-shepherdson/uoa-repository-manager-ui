export interface Datasource {
  id: string
  openaireId: string
  officialname: string
  englishname?: string
  websiteurl?: string
  logourl?: string
  contactemail?: string
  latitude?: number
  longitude?: number
  timezone: number
  namespaceprefix: string
  languages?: string
  dateofvalidation?: number
  eoscDatasourceType: string
  dateofcollection: number
  platform?: string
  activationId?: string
  description?: string
  issn?: string
  eissn?: string
  lissn?: string
  registeredby?: string
  subjects: string
  aggregator: string
  collectedfrom?: string
  managed: boolean
  consentTermsOfUse?: boolean
  fullTextDownload?: boolean
  consentTermsOfUseDate?: number
  lastConsentTermsOfUseDate?: number
  organizations: Organization[]
  identities: Identity[]
  status: string
  typology: string
  registrationdate?: number
  interfaces: any[]
  piwikInfo: any
  dataCollectionTypes: any[]
}

export interface Organization {
  legalshortname?: string
  legalname: string
  websiteurl?: string
  logourl?: string
  country: string
}

export interface Identity {
  pid: string
  issuertype: string
}
