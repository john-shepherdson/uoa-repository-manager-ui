import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { Params } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class RequestsService {
    private baseUrl = environment.API_ENDPOINT ;
    
    constructor(private http: HttpClient) {}

    getRequests(queryParams: Params): Observable<any> {
        const url = `${this.baseUrl}/datasource-gateway-requests`;
        const params = new HttpParams({ fromObject: queryParams });
        return this.http.get<any>(url, { params });
    }
}