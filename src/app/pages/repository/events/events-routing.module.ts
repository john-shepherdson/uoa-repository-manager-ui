import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuardService } from "../../../services/auth-guard.service";
import { ContentEventsOfRepositoryComponent } from "./content-events-of-repository.component";
import { ContentEventsOfRepoEventslistComponent } from "./content-events-of-repo-eventslist.component";

const eventsRoutes: Routes = [
  {
    path: '',
    component: ContentEventsOfRepositoryComponent,
    canActivate: [AuthGuardService],
    data: {
      hasSidebar: true
    }
  },
  {
    path: ':topic',
    component: ContentEventsOfRepoEventslistComponent,
    canActivate: [AuthGuardService],
    data: {
      hasSidebar: true
    }
  }
];


@NgModule ({
  imports: [RouterModule.forChild(eventsRoutes)],
  exports: [RouterModule]
})

export class EventsRoutingModule {}

