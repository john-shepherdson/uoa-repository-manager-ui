import {Route} from '@angular/router';
import {GatewayAdminGuard} from '../../services/guard-functions';
import {GatewayDashboardComponent} from './gateway-dashboard.component';
import {DatasourceSearchComponent} from './datasource-search/datasource-search.component';
import {GatewayRequestsComponent} from './requests/gateway-requests.component';
import {GatewayActionsComponent} from './requests/gateway-actions.component';

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
        data: {
          gateway: true
        }
      },
      {
        path: 'requests/my',
        component: GatewayRequestsComponent,
      },
      {
        path: 'requests/actions',
        component: GatewayActionsComponent,
      }
    ]
  }
];
