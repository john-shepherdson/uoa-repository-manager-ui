import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Community } from '../domain/community';
import { delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class CommunityContextService {
  private currentCommunityId = new BehaviorSubject<string | null>(null);
  private mockData: Community = {
    id: 'egi',
    queryId: 'egi||EGI Federation',
    type: 'ri',
    name: 'EGI Federation',
    shortName: 'EGI Federation',
    displayName: 'EGI Federation',
    displayShortName: 'EGI Federation',
    creationDate: '2023-10-02T10:09:46.211',
    lastUpdateDate: '2025-05-14T09:22:32.529',
    description: '<p>EGI is a federated e-Infrastructure set up to provide advanced computing services for research and innovation.</p>\n',
    logoUrl: 'https://documents.egi.eu/public/RetrieveFile?docid=2905&filename=EGI%20Logo%20-%20no%20background%201000px%20%281%29.png&version=2',
    status: 'manager',
    claim: 'all',
    membership: 'open',
    zenodoCommunity: 'egi',
    plan: 'Default',
    featured: null,
    subjects: [],
    fos: [],
    sdg: [],
    advancedConstraints: {
      criteria: [{
        constraint: [
          {
            verb: 'contains_caseinsensitive',
            field: 'title',
            value: 'lala'
          },
          {
            verb: 'not_contains_caseinsensitive',
            field: 'author',
            value: 'test!'
          }
        ]
      }]
    },
    removeConstraints: null,
    otherZenodoCommunities: ['egi', 'eu4dualrepo', 'uav-apm'],
    suggestedAcknowledgements: ['']
  };

  community: BehaviorSubject<Community | null> = new BehaviorSubject<Community | null>(null);

  getCurrentCommunityId() {
    return this.currentCommunityId.asObservable();
  }

  setCurrentCommunityId(id: string) {
    this.currentCommunityId.next(id);
  }

  loadCommunity(id: string): Observable<Community> {
    this.setCurrentCommunityId(id);

    // Use your mock or real API call
    return this.getMockCommunity(id).pipe(
      tap(org => {
        this.community.next(org);
      })
    );
  }

  getMockCommunity(id: string): Observable<Community> {
    return of(this.mockData).pipe(delay(350));
  }


  /**
   * Navigation helper function
   * @example: <a [routerLink]="getRouterLink('home')">Home</a>
   */
  getRouterLink(path: string): string[] {
    return ['/' + this.currentCommunityId.value, path];
  }

}
