import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Params } from '@angular/router';
import { Paging } from '../../../domain/paging';
import { DatasourceDetails } from 'src/app/domain/typeScriptClasses';

@Injectable({
  providedIn: 'root'
})

export class DatasourceSearchService {
  private baseUrl = environment.API_ENDPOINT ;

  constructor(private http: HttpClient) {}

  search(queryParams: Params) {

    const url = this.baseUrl + '/datasources';
    // Option A: leverage HttpParams.fromObject
    const params = new HttpParams({ fromObject: queryParams });

    // Option B: manual appending (handles arrays too)
    // let params = new HttpParams();
    // Object.entries(queryParams).forEach(([key, value]) => {
    //   if (value == null) { return; }
    //   if (Array.isArray(value)) {
    //     value.forEach(v => params = params.append(key, v));
    //   } else {
    //     params = params.set(key, value);
    //   }
    // });

    return this.http.get<Paging<DatasourceDetails>>(url, {params: params});
  }
}
