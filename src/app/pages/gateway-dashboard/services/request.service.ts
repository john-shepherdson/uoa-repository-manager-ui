import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {Params} from '@angular/router';
import {Paging} from '../../../domain/paging';
import {CommunityContextService} from 'src/app/services/communityContext.service';
import {Request} from '../domain/request.domain';


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

  getOpenaireActions(queryParams: Params): Observable<Paging<Request>> {
    let gateway = 'openaire-infrastructure'

    const url = `${this.baseUrl}/gateways/${gateway}/actions`;
    return this.getRequestsFromUrl(url, queryParams);
  }

  getGatewayActions(queryParams: Params): Observable<Paging<Request>> {
    // TODO: implement : path: /gateways/{id}/actions

    let gateway = this.communityID ? this.communityID : 'openaire-infrastructure'

    const url = `${this.baseUrl}/gateways/${gateway}/actions`;
    return this.getRequestsFromUrl(url, queryParams);
  }

  getGatewayRequests(queryParams: Params): Observable<Paging<Request>> {
    // TODO: implement : path: /gateways/{id}/requests
    let gateway = this.communityID ? this.communityID : 'openaire-infrastructure'

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

  updateRequest(requestId: number, decision: 'APPROVED' | 'REJECTED', authority: 'SOURCE_GATEWAY_ADMIN' | 'TARGET_GATEWAY_ADMIN', comment?: string): Observable<Request> {
    const url = `${this.baseUrl}/datasource-gateway-requests/${requestId}`;

    const updateRequest = {
      id: requestId,     // body
      decision,
      performedBy: authority,
      comment: comment || null
    };

    return this.http.put<Request>(url, updateRequest);
  }

// createRequest(datasourceId: string, type: 'PRIMARY' | 'AFFILIATED', comment?: string): Observable<Request>{
//   const url = `${this.baseUrl}/datasource-gateway-requests`;

//         const createRequest = {
//           datasourceId: datasourceId,
//           gatewayId: this.communityID,
//           requestType: type,
//           comment: comment || null
//         };

//         return this.http.post<Request>(url, createRequest)
// }

  private requestBody(datasourceId: string, type: 'PRIMARY' | 'AFFILIATED', comment?: string) {
    return {
      datasourceId: datasourceId,
      gatewayId: this.communityID,
      requestType: type,
      comment: comment || null
    };
  }

  createGatewayRequest(datasourceId: string, type: 'PRIMARY' | 'AFFILIATED', comment?: string): Observable<Request> {
    const url = `${this.baseUrl}/datasource-gateway-requests/gateways`;

    const createRequest = this.requestBody(datasourceId, type, comment);
    return this.http.post<Request>(url, createRequest);
  }

  createDatasourceRequest(datasourceId: string, type: 'PRIMARY' | 'AFFILIATED', comment?: string): Observable<Request> {
    const url = `${this.baseUrl}/datasource-gateway-requests/datasources`;

    const createRequest = this.requestBody(datasourceId, type, comment);
    return this.http.post<Request>(url, createRequest);

  }


}
