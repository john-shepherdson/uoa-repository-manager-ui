import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { Params } from "@angular/router";
import { Paging } from "../../../domain/paging";
import { CommunityContextService } from "src/app/services/communityContext.service";
import {Request} from '../domain/request.domain';



@Injectable({
  providedIn: 'root'
})
export class RequestsService {
    private baseUrl = environment.API_ENDPOINT ;

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

    getRequests(queryParams: Params): Observable<Paging<Request>> {
        const url = `${this.baseUrl}/datasource-gateway-requests`;
        let params = new HttpParams();

        // Build params safely: skip null/undefined, stringify values, support arrays
        Object.entries(queryParams || {}).forEach(([key, value]) => {
          if (value === null || value === undefined) { return; }
          if (Array.isArray(value)) {
            value.forEach(v => { if (v !== null && v !== undefined) params = params.append(key, String(v)); });
          } else {
            params = params.set(key, String(value));
          }
        });

        if (this.communityID) {
          params = params.set('targetGatewayId', this.communityID);
        }
        // Object.entries(queryParams).forEach(([key, value]) => {
        //   if (value == null) { return; }
        //   if (Array.isArray(value)) {
        //     value.forEach(v => params = params.append(key, v));
        //   } else {
        //     params = params.set(key, value);
        //   }
        // });

        return this.http.get<Paging<Request>>(url, { params });
    }

    getRequestsbyId(id: string) {

      const url = `${this.baseUrl}/datasource-gateway-requests`;
      let params = new HttpParams();
      params = params.append('datasourceIds', id)
      params = params.append('size', 100)

      return this.http.get<Paging<Request>>(url, {params})
    }

   updateRequest(requestId: number, decision: 'APPROVED' | 'REJECTED', authority: 'SOURCE_GATEWAY_ADMIN' | 'TARGET_GATEWAY_ADMIN', comment?: string): Observable<Request> {
    const url = `${this.baseUrl}/datasource-gateway-requests`;
    const params = { 'role': authority }; // query param

  const updateRequest = {
    id: requestId,     // body
    decision,
    comment: comment || null
  };

  return this.http.put<Request>(url, updateRequest, { params });
}

}
