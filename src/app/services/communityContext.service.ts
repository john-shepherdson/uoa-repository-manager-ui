import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Community } from '../domain/community';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class CommunityContextService {
  private currentCommunityId = new BehaviorSubject<string | null>(null);

  baseUrl = environment.API_ENDPOINT;

  community: BehaviorSubject<Community | null> = new BehaviorSubject<Community | null>(null);

  constructor(private http: HttpClient) {}

  getCurrentCommunityId() {
    return this.currentCommunityId.asObservable();
  }

  setCurrentCommunityId(id: string) {
    this.currentCommunityId.next(id);
  }

  loadCommunity(id: string) {
    this.setCurrentCommunityId(id);

    this.http.get<Community>(this.baseUrl + `/communities/${id}`).pipe().subscribe({
      next: (community) => {
        this.community.next(community);
      }, error: (error) => {
        console.error('Error loading community:', error);
      }
    });
  }

}
