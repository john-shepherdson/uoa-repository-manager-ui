export interface Request {
  id: number;
  requestType: string;
  requestBy: string;
  datasource: Datasource;
  sourceGateway: SourceGateway;
  targetGateway: TargetGateway;
  status: string;
  ownerApproval?: Approval;
  sourceGatewayApproval?: Approval;
  targetGatewayApproval: Approval;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface Datasource {
  id: string;
  label?: string;
}

export interface SourceGateway {
  id: string;
  label?: string;
}

export interface TargetGateway {
  id: string;
  label?: string;
}

export interface Approval {
  decision: string;
  decidedAt: string;
  comment: string;
}

export enum RequestType {
  PRIMARY = 'PRIMARY',
  AFFILIATED = 'AFFILIATED'
}

export enum Authority {
  DATASOURCE_ADMIN = 'DATASOURCE_ADMIN',
  SOURCE_GATEWAY_ADMIN = 'SOURCE_GATEWAY_ADMIN',
  TARGET_GATEWAY_ADMIN = 'TARGET_GATEWAY_ADMIN'
}

export enum Decision {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}
