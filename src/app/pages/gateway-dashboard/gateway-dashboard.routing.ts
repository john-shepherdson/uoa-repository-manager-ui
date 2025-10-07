import { Route } from '@angular/router';
import { GatewayAdminGuard } from '../../services/guard-functions';
import { GatewayDashboardComponent } from "./gateway-dashboard.component";
import { DatasourceSearchComponent } from "./datasource-search/datasource-search.component";
import { RequestsComponent } from "./requests/requests.component";

export const GatewayDashboardRouting: Route[] = [
  {
    path: '',
    component: GatewayDashboardComponent,
    canActivateChild: [GatewayAdminGuard],
    children: [
      {
        path: '',
        redirectTo: 'datasource/search',
        pathMatch: 'full'
      },
      {
        path: 'datasource/search',
        component: DatasourceSearchComponent,
      },
      {
        path: 'myDataSources',
        redirectTo: 'gatewayDataSources',
        pathMatch: 'full'
      },
      {
        path: 'gatewayDataSources',
        component: DatasourceSearchComponent,
      },
      {
        path: 'requests/my',
        component: RequestsComponent,
        data: {
          requestParams: { requestedBy: 'TARGET_GATEWAY_ADMIN' }
        },
      },
      {
        path: 'requests/actions',
        component: RequestsComponent,
        data: {
          requestParams: { requestedBy: 'DATASOURCE_ADMIN' }
        },
      }
    ]
  }
];
