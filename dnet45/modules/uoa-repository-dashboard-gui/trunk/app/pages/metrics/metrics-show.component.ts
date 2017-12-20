import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PiwikInfo } from '../../domain/typeScriptClasses';
import { RepositoryService } from '../../services/repository.service';

@Component ({
  selector: 'metrics-show',
  templateUrl: 'metrics-show.component.html'
})

export class MetricsShowComponent implements OnInit {
  @Input() piwik: PiwikInfo;

  constructor(
    private route: ActivatedRoute,
    private repoService: RepositoryService
  ) {}

  ngOnInit() {
    this.getPiwik();
  }

  getPiwik(): void {
    let id = this.route.snapshot.paramMap.get('id');
    this.repoService.getPiwikInfo(id).subscribe(
      piwik => this.piwik = piwik,
      error => console.log(error)
    );
  }

}
