import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {Params} from '@angular/router';
import {Paging} from '../../../domain/paging';
import {CommunityContextService} from 'src/app/services/communityContext.service';
import {Authority, Decision, Request, RequestType} from '../domain/request.domain';



@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  private baseUrl = environment.API_ENDPOINT;

  private communityID?: string;
  private userID?: string;

  constructor(private http: HttpClient, private communityService: CommunityContextService) {
    this.communityService.getCurrentCommunityId().subscribe({
      next: (communityID) => {
        this.communityID = communityID;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getBlockedRequests(queryParams: Params): Observable<Paging<Request>> {
    const fullParams = {...queryParams, 'status': 'BLOCKED'};
    const url = `${this.baseUrl}/datasource-gateway-requests`;
    return this.getRequestsFromUrl(url, fullParams);
  }

  getOpenaireActions(queryParams: Params): Observable<Paging<Request>> {
    let gateway = environment.OPENAIRE_ID

    const url = `${this.baseUrl}/gateways/${gateway}/actions`;
    return this.getRequestsFromUrl(url, queryParams);
  }

  getGatewayActions(queryParams: Params): Observable<Paging<Request>> {
    // TODO: implement : path: /gateways/{id}/actions

    let gateway = this.communityID ? this.communityID : environment.OPENAIRE_ID

    const url = `${this.baseUrl}/gateways/${gateway}/actions`;
    return this.getRequestsFromUrl(url, queryParams);
  }

  getGatewayRequests(queryParams: Params): Observable<Paging<Request>> {
    // TODO: implement : path: /gateways/{id}/requests
    let gateway = this.communityID ? this.communityID : environment.OPENAIRE_ID

    const url = `${this.baseUrl}/gateways/${gateway}/requests`;
    return this.getRequestsFromUrl(url, queryParams);
  }

  getAllRequests(queryParams: Params): Observable<Paging<Request>> {
    const url = `${this.baseUrl}/datasource-gateway-requests`;
    let params = new HttpParams();

    // Build params safely: skip null/undefined, stringify values, support arrays
    Object.entries(queryParams || {}).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        return;
      }
      if (Array.isArray(value)) {
        value.forEach(v => {
          if (v !== null && v !== undefined) {
            params = params.append(key, String(v));
          }
        });
      } else {
        params = params.set(key, String(value));
      }
    });
    return this.http.get<Paging<Request>>(url, {params});
  }

  getRequestsFromUrl(url: string, queryParams: Params): Observable<Paging<Request>> {

    let params = new HttpParams();

    Object.entries(queryParams || {}).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        return;
      }
      if (Array.isArray(value)) {
        value.forEach(v => {
          if (v !== null && v !== undefined) {
            params = params.append(key, String(v));
          }
        });
      } else {
        params = params.set(key, String(value));
      }
    });
    return this.http.get<Paging<Request>>(url, {params});

  }

  getRequestsbyId(id: string, key: string) {

    const url = `${this.baseUrl}/datasource-gateway-requests`;
    let params = new HttpParams();
    params = params.append(key, id);
    params = params.append('size', 100);

    return this.http.get<Paging<Request>>(url, {params});
  }

  createRequestDecision(requestId: number, decision: Decision, authority: Authority, comment?: string): Observable<Request> {
    const url = `${this.baseUrl}/datasource-gateway-requests/${requestId}/decisions`;

    const updateRequest = {
      id: requestId,
      decision,
      performedBy: authority,
      comment: comment || null
    };

    return this.http.post<Request>(url, updateRequest);
  }

  updateRequestStatus(requestId: number, decision: Decision): Observable<Request> {
    const url = `${this.baseUrl}/datasource-gateway-requests/${requestId}/status`;

    const updateRequest = {
      id: requestId,
      status: decision
    };

    return this.http.put<Request>(url, updateRequest);
  }

// createRequest(datasourceId: string, type: RequestType, comment?: string): Observable<Request>{
//   const url = `${this.baseUrl}/datasource-gateway-requests`;

//         const createRequest = {
//           datasourceId: datasourceId,
//           gatewayId: this.communityID,
//           requestType: type,
//           comment: comment || null
//         };

//         return this.http.post<Request>(url, createRequest)
// }

  private requestBody(datasourceId: string, type: RequestType, communityId: string, comment?: string) {
    return {
      datasourceId: datasourceId,
      gatewayId: communityId,
      requestType: type,
      comment: comment || null
    };
  }

  createGatewayRequest(datasourceId: string, type: RequestType, communityId: string, comment?: string): Observable<Request> {
    const url = `${this.baseUrl}/datasource-gateway-requests/gateways`;

    const createRequest = this.requestBody(datasourceId, type, communityId, comment);
    return this.http.post<Request>(url, createRequest);
  }

  createDatasourceRequest(datasourceId: string, type: RequestType, comment?: string): Observable<Request> {
    const url = `${this.baseUrl}/datasource-gateway-requests/datasources`;

    const createRequest = this.requestBody(datasourceId, type, comment);
    return this.http.post<Request>(url, createRequest);

  }


}
