import { Component, OnInit } from "@angular/core";
import { CommunityContextService } from "src/app/services/communityContext.service";
import { JsonPipe, NgIf } from "@angular/common";
import { GatewayHomeComponent } from "./gateway/gateway-home.component";
import { HomeDefaultComponent } from "./default/home-default.component";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    standalone: true,
    imports: [NgIf, JsonPipe, GatewayHomeComponent, HomeDefaultComponent]
})

export class HomeComponent implements OnInit {

    isGatewayView: boolean;

    constructor(private communityContextService: CommunityContextService) { }

    ngOnInit(): void {
     this.communityContextService.getCurrentCommunityId().subscribe({
        next: (id)=> {
            this.isGatewayView = !!id;
        }
     })
     
    }


}