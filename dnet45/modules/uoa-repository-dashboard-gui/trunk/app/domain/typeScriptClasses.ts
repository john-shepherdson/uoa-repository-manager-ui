// Generated using typescript-generator version 1.29.366 on 2018-02-05 16:06:12.

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

/*export class Repository extends DriverResource implements IsSerializable {
    id: string = null;
    officialName: string = null;
    englishName: string = '';
    websiteUrl: string = '';
    logoUrl: string = '';
    contactEmail: string = '';
    countryName: string = '';
    countryCode: string = '';
    organization: string = '';
    latitude: number = 0;
    longitude: number = 0;
    timezone: number = 0;
    namespacePrefix: string = '';
    odNumberOfItems: string = '';
    odNumberOfItemsDate: string = '';
    odPolicies: string = '';
    odLanguages: string = '';
    odContentTypes: string = '';
    collectedFrom: string = '';
    inferred: boolean = null;
    deletedByInference: boolean = null;
    trust: number = 0;
    inferenceProvenance: string = '';
    dateOfValidation: Date = null;
    datasourceClass: string = '';
    provenanceActionClass: string = '';
    dateOfCollection: Date = null;
    typology: string = '';
    activationId: string = '';
    mergehomonyms: boolean = null;
    description: string = '';
    releaseStartDate: Date = null;
    releaseEndDate: Date = null;
    missionStatementUrl: string = '';
    dataProvider: boolean = null;
    serviceProvider: boolean = null;
    databaseAccessType: string = '';
    dataUploadType: string = '';
    databaseAccessRestriction: string = '';
    dataUploadRestriction: string = '';
    versioning: boolean = null;
    citationGuidelineUrl: string = '';
    qualityManagementKind: string = '';
    pidSystems: string = '';
    certificates: string = '';
    aggregator: string = '';
    issn: string = '';
    eissn: string = '';
    lissn: string = '';
    interfaces: RepositoryInterface[] = [];
    availableDiskSpace: string = '';
    securityParameters: string = '';
    protocol: string = 'oai';
    registeredBy: string = '';
    datasourceType: string = '';
    datasourceAggregatorId: string = '';
    datasourceOriginalIdValue: string = '';
    datasourceOriginalIdProvenance: string = '';
    datasourceAggregated: boolean = false;
    datasourceComplianceDegreeValue: string = '';
    datasourceComplianceDegreeEncoding: string = '';
    numberOfObjects: number = 0;
    maxSizeOfDatastructure: number = 0;
    maxNumberOfDataStructures: number = 0;
    registered: boolean = null;
    extraFields: { [index: string]: string } = {};
    piwikInfo: PiwikInfo = null;
    environments: string[] = [];
    registrationDate: Date = null;
    verified: boolean = false;
    dataCollectionTypes: DataCollectionType[] = [];
}*/

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

/*export class RepositoryInterface implements Serializable, IsSerializable {
    desiredCompatibilityLevel: string = '';
    complianceName: string = null;
    upgradeToV3: string = '';
    deleteApi: boolean = false;
    accessSet: string = '';
    accessFormat: string = '';
    metadataIdentifierPath: string = '';
    lastCollectionDate: string = '';
    nextScheduledExecution: string = '';
    status: string = '';
    collectedFrom: string = '';
    id: string = '';
    typology: string = '';
    compliance: string = 'UNKNOWN';
    contentDescription: string = '';
    accessProtocol: string = 'oai';
    baseUrl: string = '';
    active: boolean = false;
    removable: boolean = false;
    accessParams: { [index: string]: string } = {};
    extraFields: { [index: string]: string } = {};
}*/

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

export class CustomProperties implements IsSerializable {
    properties: { [index: string]: string };
}

export class JobForValidation implements IsSerializable {
    officialName: string;
    baseUrl: string;
    userEmail: string;
    validationSet: string;
    datasourceId: string;
    interfaceId: string;
    desiredCompatibilityLevel: string;
    activationId: string;
    repoType: string;
    interfaceIdOld: string;
    groupByXpath: string;
    metadataPrefix: string;
    records: number;
    registration: boolean;
    updateExisting: boolean;
    cris: boolean;
    crisReferentialChecks: boolean;
    selectedCrisEntities: string[];
    selectedContentRules: number[];
    selectedUsageRules: number[];
    adminEmails: string[];
}

export class JobResultEntry implements IsSerializable {
    name: string;
    description: string;
    successes: string;
    weight: number;
    errors: string[];
    ruleId: number;
    hasErrors: boolean;
    mandatory: boolean;
    type: string;
}

export class Rule implements IsSerializable {
    id: number;
    name: string;
    description: string;
    type: string;
    mandatory: boolean;
    weight: number;
    provider_information: string;
    job_type: string;
    entity_type: string;
    for_cris: boolean;
    configuration: CustomProperties;
}

export class RuleSet implements Serializable, IsSerializable {
    id: number;
    name: string;
    description: string;
    guidelinesAcronym: string;
    shortName: string;
    visibility: string[];
    contentRules: Rule[];
    usageRules: Rule[];
    contentRulesIds: number[];
    usageRulesIds: number[];
}

export class StoredJob extends JobForValidation implements IsSerializable {
    contentJobStatus: string;
    usageJobStatus: string;
    started: string;
    ended: string;
    duration: string;
    error: string;
    validationType: string;
    jobType: string;
    guidelinesShortName: string;
    validationStatus: string;
    recordsTested: number;
    id: number;
    contentJobScore: number;
    usageJobScore: number;
    rules: number[];
    resultEntries: JobResultEntry[];
    filteredScores: { [index: string]: number };
}

export class AdvQueryObject implements IsSerializable {
    datasource: string;
    topic: string;
    titles: string[];
    subjects: string[];
    authors: string[];
    dates: Range[];
    trust: Range;
    page: number;
}

export class BrowseEntry implements Comparable<BrowseEntry>, IsSerializable {
    value: string;
    size: number;
}

export class ConditionParams implements IsSerializable {
    value: string;
    otherValue: string;
}

export class Dataset implements IsSerializable {
    titles: string[];
    collectedFrom: string[];
    pids: Pid[];
    instances: Instance[];
}

export class DatasourcesBroker implements IsSerializable {
    datasourcesOfUser: Tuple<BrowseEntry, string>[];
    sharedDatasources: Tuple<BrowseEntry, string>[];
    datasourcesOfOthers: Tuple<BrowseEntry, string>[];
}

export class EventsPage implements IsSerializable {
    datasource: string;
    topic: string;
    currPage: number;
    totalPages: number;
    total: number;
    values: OpenAireEventPayload[];
}

export class ExternalReference implements IsSerializable {
    url: string;
    sitename: string;
    type: string;
    refidentifier: string;
}

export class Instance implements IsSerializable {
    url: string;
    license: string;
    hostedby: string;
    instancetype: string;
}

export class Journal implements IsSerializable {
    name: string;
    issn: string;
    eissn: string;
    lissn: string;
}

export class MapConditions implements IsSerializable {
    field: string;
    fieldType: MapValueType;
    operator: ConditionOperator;
    listParams: ConditionParams[];
}

export class OpenAireEventPayload implements IsSerializable {
    publication: Publication;
    highlight: Publication;
    provenance: Provenance;
    trust: number;
}

export class OpenaireSubscription implements IsSerializable {
    subscriber: string;
    frequency: NotificationFrequency;
    mode: NotificationMode;
    query: AdvQueryObject;
}

export class Pid implements IsSerializable {
    value: string;
    type: string;
}

export class Project implements IsSerializable {
    code: string;
    acronym: string;
    title: string;
    funder: string;
    fundingProgram: string;
    jurisdiction: string;
}

export class Provenance implements IsSerializable {
    repositoryName: string;
    url: string;
    id: string;
}

export class Publication implements IsSerializable {
    originalId: string;
    titles: string[];
    abstracts: string[];
    language: string;
    subjects: string[];
    creators: string[];
    publicationdate: string;
    publisher: string;
    embargoenddate: string;
    contributor: string[];
    journal: Journal;
    collectedFrom: string[];
    pids: Pid[];
    instances: Instance[];
    externalReferences: ExternalReference[];
    projects: Project[];
    datasets: Dataset[];
}

export class Range implements IsSerializable {
    min: string;
    max: string;
}

export class SimpleSubscriptionDesc implements IsSerializable {
    id: string;
    datasource: string;
    topic: string;
    count: number;
    creationDate: Date;
    lastNotificationDate: Date;
}

export class Subscription implements IsSerializable {
    subscriptionId: string;
    subscriber: string;
    topic: string;
    frequency: NotificationFrequency;
    mode: NotificationMode;
    creationDate: Date;
    lastNotificationDate: Date;
    conditions: string;
    conditionsAsList: MapConditions[];
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

export class Tuple<K, V> implements IsSerializable {
    first: K;
    second: V;
}

export interface Comparator<T> {
}

export interface Comparable<T> {
}

export type ConditionOperator = "EXACT" | "MATCH_ANY" | "MATCH_ALL" | "RANGE";

export type MapValueType = "STRING" | "INTEGER" | "FLOAT" | "DATE" | "BOOLEAN" | "LIST_STRING" | "LIST_INTEGER" | "LIST_FLOAT" | "LIST_DATE" | "LIST_BOOLEAN";

export type NotificationFrequency = "never" | "realtime" | "daily" | "weekly" | "monthly";

export type NotificationMode = "MOCK" | "EMAIL";

export type Action = "CREATE" | "DELETE" | "UPDATE" | "MANAGE" | "RELEASE" | "CANCEL";

export type ActionStatus = "DONE" | "ONGOING" | "FAILED" | "WAITING" | "ASSIGNED";



/*ADDITIONAL CLASSES -- added by myrto --*/

export class Country {
  name: string;
  code: string;
}

export class Term implements IsSerializable {
  englishName: string;
  nativeName: string;
  encoding: string;
  code: string;
}

export class Timezone {
  name: string;
  offset: number;
}

export class InterfaceInformation implements IsSerializable {

  identified: boolean;
  sets: string[];
  adminEmails: string[];
}

export class JobsOfUser implements IsSerializable {
  totalJobs: number;
  totalJobsSuccessful: number;
  totalJobsFailed: number;
  totalJobsOngoing: number;

  jobs: StoredJob[];
}

export class MetricsNumbers implements IsSerializable {
  downloads: string[];
  pageviews: string;
  total_downloads: string;
  total_openaire_downloads: string;
  total_openaire_views: string;
  total_views: string;
  views: string[];
}

export class MetricsInfo implements IsSerializable {
  diagramsBaseURL: string;
  metricsNumbers: MetricsNumbers;
}

export class Typology {
  value: string;
  name: string;
}

export class AggregationDetails implements IsSerializable {
  aggregationStage: string;
  date: Date;
  numberOfRecords: number;
  collectionMode: string;
}

export class Aggregations implements IsSerializable {
  aggregationHistory: AggregationDetails[];
  lastCollection: AggregationDetails[];
  lastTransformation: AggregationDetails[];
}
