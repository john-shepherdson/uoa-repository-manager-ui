import { Component, OnInit, ViewChild } from '@angular/core';
import { RepositoryTilesComponent } from '../../shared/reusablecomponents/repository-tiles.component';

@Component ({
  selector: 'app-sources-update',
  templateUrl: 'sources-update.component.html'
})

export class SourcesUpdateComponent implements OnInit {

  @ViewChild('repositoryTiles') repositoryTiles: RepositoryTilesComponent;
  noRepositories: boolean = true;
  tilesView: boolean = true;

  constructor() {}

  ngOnInit() {
    let body = document.getElementsByTagName('body')[0];
    body.classList.add("top_bar_active");   //add the class
    body.classList.remove("page_heading_active");
    body.classList.remove("landing");
    body.classList.add("dashboard");
  }

  setNoRepositories(norepos: boolean) {
    this.noRepositories = norepos;
  }

  downloadLogo() {
    window.open('../../../assets/imgs/OpenAIRE_validated_icon_medium.png', '_blank', 'enabledstatus=0,toolbar=0,menubar=0,location=0');
  }

  changeView(view: string) {
    this.tilesView = (view == 'tiles');
  }
}
