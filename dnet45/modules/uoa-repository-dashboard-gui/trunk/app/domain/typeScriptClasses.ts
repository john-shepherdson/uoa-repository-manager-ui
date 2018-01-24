// Generated using typescript-generator version 1.29.366 on 2017-12-05 11:43:17.

export class BrowseData {
    data: { [index: string]: FieldData };
    fields: string[];
}

export class DataCollectionAccessProtocol {
    value: string;
    username: string;
    password: string;
}

export class DataCollectionInterface {
    protocol: DataCollectionAccessProtocol;
    baseUrl: string;
    format: string;
    filter: string;
}

export class DataCollectionType {
    dataCollectionInterface: DataCollectionInterface;
    id: string;
    label: string;
    group: string;
}

export class Document {
    map: { [index: string]: string[] };
    fieldNames: string[];
}

export class FieldData {
    fieldRowList: FieldRow[];
    count: number[];
    values: string[];
}

export class FieldRow {
    value: string;
    count: number;
}

export class FormattedSearchResult {
    formattedResult: string;
    resultsNumber: number;
}

export class Hint {
    alternateTerm: string;
    autoFollowHint: boolean;
}

export class DriverResource implements Serializable {
    resourceId: string;
    resourceUri: string;
    resourceKind: string;
    resourceType: string;
    dateOfCreation: Date;
}

export class MDFormatDataStructure extends DriverResource {
    resourceName: string;
    layouts: { [index: string]: LayoutField[] };
}

export class PiwikInfo implements IsSerializable {
    repositoryId: string;
    openaireId: string;
    repositoryName: string;
    country: string;
    siteId: string;
    authenticationToken: string;
    creationDate: Date;
    requestorName: string;
    requestorEmail: string;
    validated: boolean;
    validationDate: Date;
    comment: string;
}

export class Repository extends DriverResource implements IsSerializable {
    id: string;
    officialName: string;
    englishName: string;
    websiteUrl: string;
    logoUrl: string;
    contactEmail: string;
    countryName: string;
    countryCode: string;
    organization: string;
    latitude: number;
    longitude: number;
    timezone: number;
    namespacePrefix: string;
    odNumberOfItems: string;
    odNumberOfItemsDate: string;
    odPolicies: string;
    odLanguages: string;
    odContentTypes: string;
    collectedFrom: string;
    inferred: boolean;
    deletedByInference: boolean;
    trust: number;
    inferenceProvenance: string;
    dateOfValidation: Date;
    datasourceClass: string;
    provenanceActionClass: string;
    dateOfCollection: Date;
    typology: string;
    activationId: string;
    mergehomonyms: boolean;
    description: string;
    releaseStartDate: Date;
    releaseEndDate: Date;
    missionStatementUrl: string;
    dataProvider: boolean;
    serviceProvider: boolean;
    databaseAccessType: string;
    dataUploadType: string;
    databaseAccessRestriction: string;
    dataUploadRestriction: string;
    versioning: boolean;
    citationGuidelineUrl: string;
    qualityManagementKind: string;
    pidSystems: string;
    certificates: string;
    aggregator: string;
    issn: string;
    eissn: string;
    lissn: string;
    interfaces: RepositoryInterface[];
    availableDiskSpace: string;
    securityParameters: string;
    protocol: string;
    registeredBy: string;
    datasourceType: string;
    datasourceAggregatorId: string;
    datasourceOriginalIdValue: string;
    datasourceOriginalIdProvenance: string;
    datasourceAggregated: boolean;
    datasourceComplianceDegreeValue: string;
    datasourceComplianceDegreeEncoding: string;
    numberOfObjects: number;
    maxSizeOfDatastructure: number;
    maxNumberOfDataStructures: number;
    registered: boolean;
    extraFields: { [index: string]: string };
    piwikInfo: PiwikInfo;
    environments: string[];
    registrationDate: Date;
    verified: boolean;
    dataCollectionTypes: DataCollectionType[];
}

export class RepositoryAccessProtocol {
    value: string;
    username: string;
    password: string;
    filter: string;
}

export class RepositoryBlackboard {
    lastrequest: string;
    lastresponse: string;
    messages: RepositoryBlackboardMessage[];
}

export class RepositoryBlackboardMessage {
    id: string;
    action: Action;
    actionStatus: ActionStatus;
    parameters: string[];
}

export class RepositoryComparator implements Comparator<Repository> {
}

export class RepositoryInterface implements Serializable, IsSerializable {
    desiredCompatibilityLevel: string;
    complianceName: string;
    upgradeToV3: string;
    deleteApi: boolean;
    accessSet: string;
    accessFormat: string;
    metadataIdentifierPath: string;
    lastCollectionDate: string;
    nextScheduledExecution: string;
    status: string;
    collectedFrom: string;
    id: string;
    typology: string;
    compliance: string;
    contentDescription: string;
    accessProtocol: string;
    baseUrl: string;
    active: boolean;
    removable: boolean;
    accessParams: { [index: string]: string };
    extraFields: { [index: string]: string };
}

export class SearchCriteriaImpl implements SearchCriteria {
    startsWith: string;
    endsWith: string;
    contains: string;
}

export class RepositorySearchCriteria extends SearchCriteriaImpl implements SearchCriteria {
    haveDocuments: boolean;
    protocolType: string;
    adminInfo: string;
    officialName: string;
    registeredBy: string;
    country: string;
    verified: boolean;
}

export class SearchResult {
    query: string;
    locale: string;
    total: number;
    page: number;
    size: number;
    fields: string[];
    searchResults: string[];
    browseResults: string[];
}

export class SimilarDocument {
    id: string;
    score: number;
}

export class StoreInfo {
    serviceUrl: string;
    storeId: string;
}

export class StoreObjectInfo {
    storeInfo: StoreInfo;
    objectId: string;
}

export class SuggestiveResult {
    epr: EPR;
    alternativeTerm: string;
    autofollow: boolean;
}

export class LayoutField {
    name: string;
    xpath: string;
    type: string;
    indexable: boolean;
    result: boolean;
    stat: boolean;
    tokenizable: boolean;
}

export interface IsSerializable {
}

export interface Serializable {
}

export interface SearchCriteria {
}

export class EPR {
    epr: string;
    address: string;
    serviceName: string;
    endpointName: string;
    parameterNames: string[];
}

export interface Comparator<T> {
}

export type Action = "CREATE" | "DELETE" | "UPDATE" | "MANAGE" | "RELEASE" | "CANCEL";

export type ActionStatus = "DONE" | "ONGOING" | "FAILED" | "WAITING" | "ASSIGNED";


/*ADDITIONAL CLASSES -- added by myrto --*/
export class Country {
  name: string;
  code: string;
}

export class Topic {
  size: number;
  value: string;
}

export class Timezone {
  name: string;
  offset: number;
}
