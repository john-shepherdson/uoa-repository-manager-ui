import { Route } from '@angular/router';
import { GatewayAdminGuard } from '../../services/guard-functions';

export const GatewayDashboardRouting: Route[] = [
  {
    path: '',
    loadComponent: () => import('./gateway-dashboard.component').then(m => m.GatewayDashboardComponent),
    canActivateChild: [GatewayAdminGuard],
    children: [
      {
        path: '',
        redirectTo: 'datasource/search',
        pathMatch: 'full'
      },
      {
        path: 'datasource/search',
        loadComponent: () => import('./datasource-search/datasource-search.component').then(m => m.DatasourceSearchComponent),
      }
    ]
  }
];
