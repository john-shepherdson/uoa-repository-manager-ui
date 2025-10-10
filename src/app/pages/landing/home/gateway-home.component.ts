import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommunityContextService } from 'src/app/services/communityContext.service';
import { Observable } from 'rxjs';
@Component({
    imports:[CommunityContextService],
    selector: 'app-gateway-home',
    templateUrl: './gateway-home.component.html',
    standalone: true
})

export class GatewayHomeComponent  {
    currentCommunityId$: Observable<string | null> = null;

    constructor(private communityContextService: CommunityContextService) {}

    
}

