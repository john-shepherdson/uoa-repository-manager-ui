/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 2.16.538 on 2023-03-29 16:52:47.

export class Alert {
  Date_Time: string;
  Alert: string;
}

export class COUNTER_Dataset_Attributes {
  Type: string;
  Value: string;
}

export class COUNTER_Dataset_Contributors {
  Type: string;
  Name: string;
  Identifier: string;
}

export class COUNTER_Dataset_Dates {
  Type: string;
  Value: string;
}

export class COUNTER_Dataset_Identifiers {
  Type: string;
  Value: string;
}

export class COUNTER_Dataset_Performance {
  Period: Period;
  Instance: Instance[];
}

export class COUNTER_Dataset_Report {
  Report_Header: SUSHI_Report_Header_DSR;
  Report_Datasets: COUNTER_Dataset_Usage[];
}

export class COUNTER_Dataset_Usage {
  Dataset_Title: string;
  Publisher: string;
  YOP: string;
  Access_Method: string;
  Performance: COUNTER_Dataset_Performance[];
  Dataset_ID: COUNTER_Dataset_Identifiers[];
  Dataset_Contributors: COUNTER_Dataset_Contributors[];
  Dataset_Dates: COUNTER_Dataset_Dates[];
  Dataset_Attributes: COUNTER_Dataset_Attributes[];
  Publisher_ID: COUNTER_Publisher_Identifiers[];
  Item_Parent: COUNTER_Item_Parent;
  Item_Component: COUNTER_Item_Component[];
  Data_Type: string;
  Platform: string;
}

export class COUNTER_Item_Attributes {
  Type: string;
  Value: string;
}

export class COUNTER_Item_Component {
  Data_Type: string;
}

export class COUNTER_Item_Contributors {
  Type: string;
  Name: string;
  Identifier: string;
}

export class COUNTER_Item_Dates {
  Type: string;
  Value: string;
}

export class COUNTER_Item_Identifiers {
  Type: string;
  Value: string;
}

export class COUNTER_Item_Parent {
  Data_Type: string;
}

export class COUNTER_Item_Performance {
  Period: Period;
  Instance: Instance[];
}

export class COUNTER_Item_Report {
  Report_Header: SUSHI_Report_Header;
  Report_Items: COUNTER_Item_Usage[];
}

export class COUNTER_Item_Usage {
  Platform: string;
  Data_Type: string;
  Access_Method: string;
  Performance: COUNTER_Item_Performance[];
  Item: string;
  Item_ID: COUNTER_Item_Identifiers[];
  Item_Contributors: COUNTER_Item_Contributors[];
  Item_Dates: COUNTER_Item_Dates[];
  Item_Attributes: COUNTER_Item_Attributes[];
  Publisher_ID: COUNTER_Publisher_Identifiers[];
  Item_Parent: COUNTER_Item_Parent;
  Item_Component: COUNTER_Item_Component[];
  YOP: string;
  Access_Type: string;
  Publisher: string;
}

export class COUNTER_Platform_Report {
  Report_Header: SUSHI_Report_Header;
  Report_Items: COUNTER_Platform_Usage[];
}

export class COUNTER_Platform_Usage {
  Platform: string;
  Data_Type: string;
  Access_Method: string;
  Performance: COUNTER_Item_Performance[];
}

export class COUNTER_Publisher_Identifiers {
  Type: string;
  Value: string;
}

export class COUNTER_Title_Report {
  Report_Header: SUSHI_Report_Header;
  Report_Items: COUNTER_Platform_Usage[];
}

export class COUNTER_Title_Usage {
  Title: string;
  Item_ID: COUNTER_Item_Identifiers[];
  Platform: string;
  Publisher: string;
  Data_Type: string;
  Section_Type: string;
  YOP: string;
  Access_Type: string;
  Access_Method: string;
  Performance: COUNTER_Item_Performance[];
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

export class Period {
  Begin_Date: string;
  End_Date: string;
}

export class ReportAttribute {
  Name: string;
  Value: string;
}

export class ReportDefinition {
  "@Name": string;
  "@Release": string;
  Filters: Filters;
}

export class ReportSupported {
  Report_Name: string;
  Report_ID: string;
  Release: string;
  Report_Description: string;
  Path: string;
}

export class Requestor {
  ID: string;
}

export class SUSHI_Consortium_Member_List {
  Customer_ID: string;
  Requestor_ID: string;
  Name: string;
  Notes: string;
  Institution_ID: SUSHI_Org_Identifiers[];
}

export class SUSHI_Error_Model {
  Code: string;
  Severity: string;
  Message: string;
  Help_URL: string;
  Data: string;
}

export class SUSHI_Org_Identifiers {
  Type: string;
  Value: string;
}

export class SUSHI_Report_Header {
  Created: string;
  Created_By: string;
  Customer_ID: string;
  Report_ID: string;
  Report_Name: string;
  Institution_Name: string;
  Institution_ID: SUSHI_Org_Identifiers[];
  Report_Filters: Filter[];
  Report_Attributes: ReportAttribute[];
  Exceptions: SUSHI_Error_Model[];
}

export class SUSHI_Report_Header_DSR {
  Report_Name: string;
  Report_ID: string;
  Created: string;
  Created_By: string;
  Customer_ID: string;
  Report_Filters: Filter[];
  Report_Attributes: ReportAttribute[];
  Exceptions: SUSHI_Error_Model[];
}

export class SUSHI_Report_List {
  Report_Name: string;
  Report_ID: string;
  Report_Description: string;
  Path: string;
}

export class SUSHI_Service_Status {
  Description: string;
  Service_Active: boolean;
  Registry_URL: string;
  Note: string;
  Alerts: Alert[];
}

export class UsageDateRange {
  Begin: string;
  End: string;
}
