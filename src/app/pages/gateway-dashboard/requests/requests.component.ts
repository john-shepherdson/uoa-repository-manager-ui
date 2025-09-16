import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RequestsService } from "../services/requests.service";

@Component({
  selector: 'gateway-requests',
  standalone: true,
  templateUrl: './requests.component.html',
  imports: [CommonModule]
})

export class RequestsComponent {
  requests: any[] = [];

  constructor(private requestsService: RequestsService) {}

  ngOnInit(): void {
    this.requestsService.getRequests({
      page: 0,
      size: 10,
      sort: 'status',
      order: 'ASC',
    }).subscribe(data => {
      console.log(data);
      this.requests = data.results;
    })
  }
//   request = {
//   "id": 0,
//   "requestType": "PRIMARY",
//   "datasourceId": "string",
//   "sourceGatewayId": "string",
//   "targetGatewayId": "string",
//   "status": "PENDING",
//   "ownerApproval": {
//     "actorId": "string",
//     "decision": "APPROVED",
//     "decidedAt": "2025-09-15T08:12:19.231Z",
//     "comment": "string",
//     "approved": true
//   },
//   "sourceGatewayApproval": {
//     "actorId": "string",
//     "decision": "APPROVED",
//     "decidedAt": "2025-09-15T08:12:19.231Z",
//     "comment": "string",
//      "approved": true
//   },
//   "targetGatewayApproval": {
//     "actorId": "string",
//     "decision": "APPROVED",
//     "decidedAt": "2025-09-15T08:12:19.231Z",
//     "comment": "string",
//     "approved": true
//   },
//   "createdAt": "2025-09-15T08:12:19.231Z",
//   "createdBy": "string",
//   "updatedAt": "2025-09-15T08:12:19.231Z",
//   "updatedBy": "string"
// }
}
