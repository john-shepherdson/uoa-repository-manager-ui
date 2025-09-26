import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Community } from "../domain/community";
import { environment } from "../../environments/environment";
import { CommunityContextService } from "./communityContext.service";

@Injectable({providedIn: 'root'})

export class CommunityService {
	private httpClient = inject(HttpClient);

	private baseUrl =  environment.API_ENDPOINT;


	
	getCommunityById(id: string): Observable<Community> {
		const url = this.baseUrl + '/communities/' + id;
		return this.httpClient.get<Community>(url);
	}

}