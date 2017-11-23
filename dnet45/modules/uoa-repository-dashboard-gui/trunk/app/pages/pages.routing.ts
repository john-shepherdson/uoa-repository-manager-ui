/**
 * Created by stefania on 8/29/16.
 */
import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from './home/home.component';
import {MetricsComponent} from './metrics/metrics.component';
import {PagesComponent} from "./pages.component";

const pagesRoutes: Routes = [
  {
    path: 'pages',
    component: PagesComponent,
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
        path: 'metrics',
        component: MetricsComponent
      }
    ]
  }
];


@NgModule ({
  imports: [RouterModule.forChild(pagesRoutes)],
  exports: [RouterModule]
})

export class PagesRouting {}

