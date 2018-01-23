import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component ({
  selector: 'app-compatibility-monitor-repo',
  templateUrl: 'compatibility-monitor-repo.component.html'
})

export class CompatibilityMonitorRepoComponent implements OnInit {
  repoId: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.readRepoId();
  }

  readRepoId() {
    this.repoId = this.route.snapshot.paramMap.get('id');
  }
}
