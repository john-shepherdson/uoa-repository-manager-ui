import { Component, OnInit, ViewChild } from '@angular/core';
import { RepositoryTilesComponent } from '../../shared/reusablecomponents/repository-tiles.component';

@Component ({
  selector: 'app-sources-update',
  templateUrl: 'sources-update.component.html'
})

export class SourcesUpdateComponent implements OnInit {

  @ViewChild('repositoryTiles') repositoryTiles: RepositoryTilesComponent;
  noRepositories: boolean;

  constructor() {}

  ngOnInit() {}

  setNoRepositories(norepos: boolean) {
    this.noRepositories = norepos;
  }

  downloadLogo() {
    window.open('../../../assets/imgs/OpenAIRE_validated_icon_medium.png', '_blank', 'enabledstatus=0,toolbar=0,menubar=0,location=0');
  }
}
