import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MetricsInfo, PiwikInfo } from '../../domain/typeScriptClasses';
import { PiwikService } from '../../services/piwik.service';
import { RepositoryService } from '../../services/repository.service';
import { loadingMetrics, loadingMetricsError } from '../../domain/shared-messages';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component ({
  selector: 'metrics-show',
  templateUrl: 'metrics-show.component.html'
})

export class MetricsShowComponent implements OnInit {
  errorMessage: string;
  loadingMessage: string;

  repoId: string;
  piwik: PiwikInfo;
  repoMetrics: MetricsInfo;
  pageViews = '--';
  totalViews = '--';
  totalDownloads = '--';
  viewsUrl: SafeResourceUrl;
  downloadsUrl: SafeResourceUrl;

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private piwikService: PiwikService,
    private repoService: RepositoryService
  ) {}

  ngOnInit() {
    this.repoId = this.route.snapshot.paramMap.get('id');
    setTimeout(()=> {
      this.getPiwik();
    },1000);
  }


  getPiwik() {
    this.loadingMessage = loadingMetrics;
    this.piwikService.getPiwikInfo(this.repoId).subscribe(
      piwik => this.piwik = piwik,
      error => {
        this.loadingMessage = '';
        this.errorMessage = loadingMetricsError;
        console.log(error);
      },
      () => {
        this.loadingMessage = '';
        this.errorMessage = '';
        this.getMetrics();
      }
    );
  }

  getMetrics() {
    this.loadingMessage = loadingMetrics;
    this.repoService.getMetricsInfoForRepository(this.repoId).subscribe(
      metrics => {
        this.repoMetrics = metrics;
        if (this.repoMetrics.metricsNumbers.pageviews)
          this.pageViews = this.repoMetrics.metricsNumbers.pageviews;
        if (this.repoMetrics.metricsNumbers.total_views)
          this.totalViews = this.repoMetrics.metricsNumbers.total_views;
        if (this.repoMetrics.metricsNumbers.total_downloads)
          this.totalDownloads = this.repoMetrics.metricsNumbers.total_downloads;
        this.getViewsUrl();
        this.getDownloadsUrl();
      },
      error => {
        this.loadingMessage = '';
        this.errorMessage = loadingMetricsError;
        console.log(error);
      },
      () => {
        this.loadingMessage = '';
        this.errorMessage = '';
      }
    );
  }


  getViewsUrl () {
    this.viewsUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `${this.repoMetrics.diagramsBaseURL}merge.php?com=query
      &data=[{"query":"dtsrcRepoViews","dtsrcName":"${this.piwik.openaireId}",
      "table":"","fields":[{"fld":"sum","agg":"sum","type":"chart","yaxis":1,"c":false}],
      "xaxis":{"name":"month","agg":"sum"},"group":"","color":"","type":"chart","size":30,
      "sort":"xaxis","xStyle":{"r":-30,"s":"0","l":"-","ft":"-","wt":"-"},"title":"","subtitle":"",
      "xaxistitle":"","yaxisheaders":["Monthly views"],"generalxaxis":"","theme":0,"in":[]}]
      &info_types=["spline"]&stacking=&steps=false&fontFamily=Courier&spacing=[5,0,0,0]
      &style=[{"color":"rgba(0, 0, 0, 1)","size":"18"},{"color":"rgba(0, 0, 0, 1)","size":"18"},
      {"color":"000000","size":""},{"color":"000000","size":""}]&backgroundColor=rgba(255,255,255,1)
      &colors[]=rgba(124,181, 236, 1)&colors[]=rgba(67, 67, 72, 1)&colors[]=rgba(144, 237, 125,1)
      &colors[]=rgba(247, 163, 92, 1)&colors[]=rgba(128, 133, 233,1)&colors[]=rgba(241, 92, 128, 1)
      &colors[]=rgba(228, 211, 84,1)&colors[]=rgba(43, 144, 143, 1)&colors[]=rgba(244, 91, 91,1)
      &colors[]=rgba(145, 232, 225,1)&xlinew=0&ylinew=1&legends=true&tooltips=true&persistent=false`
    );
  }

  getDownloadsUrl () {
    this.downloadsUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `${this.repoMetrics.diagramsBaseURL}merge.php?com=query
      &data=[{"query":"dtsrcRepoDownloads","dtsrcName":"${this.piwik.openaireId}",
      "table":"","fields":[{"fld":"sum","agg":"sum","type":"chart","yaxis":1,"c":false}],
      "xaxis":{"name":"month","agg":"sum"},"group":"","color":"","type":"chart","size":30,
      "sort":"xaxis","xStyle":{"r":-30,"s":"0","l":"-","ft":"-","wt":"-"},"title":"","subtitle":"",
      "xaxistitle":"","yaxisheaders":["Monthly downloads"],"generalxaxis":"","theme":0,"in":[]}]
      &info_types=["spline"]&stacking=&steps=false&fontFamily=Courier&spacing=[5,0,0,0]
      &style=[{"color":"rgba(0, 0, 0, 1)","size":"18"},{"color":"rgba(0, 0, 0,1)","size":"18"},
      {"color":"000000","size":""},{"color":"000000","size":""}]&backgroundColor=rgba(255,255,255,1)
      &colors[]=rgba(124, 181, 236, 1)&colors[]=rgba(67, 67, 72, 1)&colors[]=rgba(144, 237, 125,1)
      &colors[]=rgba(247, 163, 92, 1)&colors[]=rgba(128, 133, 233,1)&colors[]=rgba(241, 92, 128, 1)
      &colors[]=rgba(228, 211, 84,1)&colors[]=rgba(43, 144, 143, 1)&colors[]=rgba(244, 91, 91,1)
      &colors[]=rgba(145, 232, 225,1)&xlinew=0&ylinew=1&legends=true&tooltips=true&persistent=false`
    );
  }

}
