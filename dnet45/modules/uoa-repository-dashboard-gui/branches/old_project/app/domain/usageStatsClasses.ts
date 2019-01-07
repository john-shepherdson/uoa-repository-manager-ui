// Generated using typescript-generator version 1.29.366 on 2018-05-11 15:13:15.

export class Contact {
  "E-mail": string;
  Contact: string;
}

export class Customer {
  ID: string;
  ReportItems: ReportItem[];
}

export class Filter {
  Name: string;
  Value: string;
}

export class Filters {
  UsageDateRange: UsageDateRange;
  Filter: Filter[];
  ReportAttribute: Filter[];
}

export class Instance {
  MetricType: string;
  Count: string;
}

export class ItemIdentifier {
  Type: string;
  Value: string;
}

export class ItemPerformance {
  Period: Period;
  Category: string;
  Instance: Instance[];
}

export class Period {
  Begin: string;
  End: string;
}

export class Report {
  "@Created": string;
  "@Version": string;
  "@Name": string;
  Vendor: Vendor;
  Customer: Customer;
}

export class ReportDefinition {
  "@Name": string;
  "@Release": string;
  Filters: Filters;
}

export class ReportException {
  "@Created": string;
  Number: string;
  Severity: string;
  Message: string;
  Data: string;
}

export class ReportItem {
  ItemIdentifier: ItemIdentifier[];
  ItemPublisher: string;
  ItemPlatform: string;
  ItemDataType: string;
  ItemName: string;
  ItemPerformance: ItemPerformance[];
}

export class ReportResponse {
  "@Created": string;
  Exception: ReportException[];
  Requestor: Requestor;
  ReportDefinition: ReportDefinition;
  Report: ReportWrapper;
}

export class ReportResponseWrapper {
  ReportResponse: ReportResponse;
}

export class ReportWrapper {
  Report: Report;
}

export class Requestor {
  ID: string;
}

export class UsageDateRange {
  Begin: string;
  End: string;
}

export class BaseRepository {
}

export class UsageReport extends BaseRepository {
}

export class Vendor {
  Contact: Contact;
  Name: string;
}
