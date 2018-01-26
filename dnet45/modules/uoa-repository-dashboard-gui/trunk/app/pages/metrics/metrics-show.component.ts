import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PiwikInfo } from '../../domain/typeScriptClasses';
import { PiwikService } from '../../services/piwik.service';

@Component ({
  selector: 'metrics-show',
  templateUrl: 'metrics-show.component.html'
})

export class MetricsShowComponent implements OnInit {
  piwik: PiwikInfo;

  constructor(
    private route: ActivatedRoute,
    private piwikService: PiwikService
  ) {}

  ngOnInit() {
    this.getPiwik();
  }

  getPiwik(): void {
    let id = this.route.snapshot.paramMap.get('id');
    this.piwikService.getPiwikInfo(id).subscribe(
      piwik => this.piwik = piwik,
      error => console.log(error)
    );
  }

}
