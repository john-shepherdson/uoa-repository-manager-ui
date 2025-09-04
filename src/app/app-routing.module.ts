import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './pages/landing/home/home.component';
import { ForbiddenPageComponent } from './shared/reusablecomponents/403-forbidden-page.component';
import { EmptyPageComponent } from './pages/emptypage/empty-page.component';
import { AboutComponent } from './pages/landing/about/about.component';
import { MyDataSourcesComponent } from './pages/my-datasources/my-data-sources.component';
import { authGuard } from "./services/auth-guard.service";

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'emptyPage',
    component: EmptyPageComponent,
    canActivate: [authGuard]
  },
  {
    path: 'myDataSources',
    component: MyDataSourcesComponent,
    canActivate: [authGuard]
  },
  {
    path: 'repository',
    loadChildren: () => import('./pages/repository/repository.module').then(m => m.RepositoryModule),
    canActivate: [authGuard]
  },
  {
    path: 'repositoryAdmin',
    loadChildren: () => import('./pages/repository/repository.module').then(m => m.RepositoryModule),
    canActivate: [authGuard]
  },
  {
    path: 'sources',
    loadChildren: () => import('./pages/sources/sources.module').then(m => m.SourcesModule),
    canActivate: [authGuard]
  },
  {
    path: 'compatibility',
    loadChildren: () => import('./pages/compatibility/compatibility.module').then(m => m.CompatibilityModule)
  },
  {
    path: 'content',
    loadChildren: () => import('./pages/content/content.module').then(m => m.ContentModule),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/adminPg/adminPg.module').then(m => m.AdminPgModule),
  },
  {
    path: 'gateway-dashboard',
    loadChildren: () => import('./pages/gateway-dashboard/gateway-dashboard.routing').then(m => m.GatewayDashboardRouting),
    // children: GatewayDashboardRouting
  },
  {
    path: '403-forbidden',
    component: ForbiddenPageComponent
  },
  {
    // fixme redirect to 404
    path: '**',
    redirectTo: '/403-forbidden',
    pathMatch: 'full'
    // component: ForbiddenPageComponent
  }
];


@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {})],
  exports: [RouterModule]
})

export class AppRoutingModule {}

