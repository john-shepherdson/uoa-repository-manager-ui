import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './pages/landing/home/home.component';
import { AuthGuardService } from './services/auth-guard.service';
import { ForbiddenPageComponent } from './shared/reusablecomponents/403-forbidden-page.component';
import { EmptyPageComponent } from './pages/emptypage/empty-page.component';
import { AboutComponent } from './pages/landing/about/about.component';
import { MyDataSourcesComponent } from './pages/my-datasources/my-data-sources.component';

const appRoutes: Routes = [
  // {
  //   path: '',
  //   redirectTo: '/default-org/home', // You'll need to handle the default org logic
  //   pathMatch: 'full'
  // },
  {
    path: ':communityId',
    children: [
      {
        path: '',
        redirectTo: 'home',
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
        canActivate: [AuthGuardService]
      },
      {
        path: 'myDataSources',
        component: MyDataSourcesComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'repository',
        loadChildren: () => import('./pages/repository/repository.module').then(m => m.RepositoryModule),
        canActivate: [AuthGuardService]
      },
      {
        path: 'repositoryAdmin',
        loadChildren: () => import('./pages/repository/repository.module').then(m => m.RepositoryModule),
        canActivate: [AuthGuardService]
      },
      {
        path: 'sources',
        loadChildren: () => import('./pages/sources/sources.module').then(m => m.SourcesModule),
        canActivate: [AuthGuardService]
      },
      {
        path: 'compatibility',
        loadChildren: () => import('./pages/compatibility/compatibility.module').then(m => m.CompatibilityModule)
      },
      {
        path: 'content',
        loadChildren: () => import('./pages/content/content.module').then(m => m.ContentModule),
        canActivate: [AuthGuardService]
      },
      {
        path: 'admin',
        loadChildren: () => import('./pages/adminPg/adminPg.module').then(m => m.AdminPgModule),
      },
      {
        path: '403-forbidden',
        component: ForbiddenPageComponent
      }
    ]
  },
  {
    // Global 403 route (outside org context)
    path: '403-forbidden',
    component: ForbiddenPageComponent
  },
  {
    path: '**',
    redirectTo: '/403-forbidden',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {})],
  exports: [RouterModule]
})

export class AppRoutingModule {}
