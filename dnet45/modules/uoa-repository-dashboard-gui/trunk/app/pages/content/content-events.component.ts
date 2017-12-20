import {Component, OnInit} from "@angular/core";
import { RepositoryService } from '../../services/repository.service';

@Component ({
  selector: 'app-content-events',
  templateUrl: 'content-events.component.html'
})

export class ContentEventsComponent implements OnInit {
  parent_id: string;

  constructor() {}

  ngOnInit() {
    this.parent_id = 'contentEvents';
  }
}
