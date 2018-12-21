import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RepositoryService } from '../../../services/repository.service';
import {
  loadingReposMessage,
  noRepositoriesFound,
  noRepositoryChosenMsg,
  noServiceMessage } from '../../../domain/shared-messages';
import { Country, Repository, RepositorySnippet } from '../../../domain/typeScriptClasses';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'register-datasource-shareable',
  templateUrl: './register-datasource-shareable.component.html'
})

export class RegisterDatasourceShareableComponent implements OnInit {
  countries: Country[] = [];
  hasSelectedCountry: boolean;
  selectedCountry: Country;
  countryRepos: RepositorySnippet[] = [];
  hasSelectedRepo: boolean;

  noRepositories: string;
  alertMessage: string;
  loadingMessage: string = loadingReposMessage;

  repoId: string;

  sourceUrl: string;
  sourceTitle: string;
  latestUpdate: string;

  @Input() mode: string;

  @Output() emitRepoId: EventEmitter<string> = new EventEmitter();
  @Output() promptNext: EventEmitter<boolean> = new EventEmitter();

  searchBox: string = '';

  constructor(private repoService:RepositoryService) {}

  ngOnInit() {
    this.setUpSourceInfo();
    this.getCountries();
    this.hasSelectedCountry = false;
  }

  setUpSourceInfo() {
    if (this.mode == 'opendoar') {
      this.sourceUrl = 'http://v2.sherpa.ac.uk/opendoar/';
      this.sourceTitle = 'OpenDOAR';
    } else if (this.mode == 're3data') {
      this.sourceUrl = 'https://www.re3data.org/';
      this.sourceTitle = 'Re3data';
    }
    this.getLatestUpdate();
  }

  getCountries() {
    this.repoService.getCountries()
      .subscribe(
        countries => {
          // TODO: check again getCountries null return values
          /*/!* check for null values *!/
          let nullVals = countries.filter(el => el.name === null);
          /!* remove null values from array *!/
          for (let nullVal of nullVals) {
            let i = countries.findIndex(el => el === nullVal);
            /!* remove null value from array *!/
            if (i !== -1) { countries.splice(i, 1); }
          }*/

          /* sort countries array */
          this.countries = countries.sort( function(a,b) {
            if (a.name<b.name) {
              return -1;
            } else if(a.name>b.name) {
              return 1;
            } else {
              return 0;
            }
          } );
        },
        error => {
          this.alertMessage = noServiceMessage;
          console.log(error);
        });
  }

  getReposInCountry(i: number){
    setTimeout( () => {
      const country = this.countries[i];
      console.log(`I got ${country} and ${this.mode}`);
      this.countryRepos = [];
      this.selectedCountry = country;
      this.hasSelectedCountry = false;
      this.loadingMessage = loadingReposMessage;
      this.noRepositories = '';
      this.repoService.getRepositoriesOfCountry(country.code, this.mode).subscribe (
        repos => {
          this.countryRepos = repos;
        },
        error => {
          console.log(error.statusText);
          this.loadingMessage = '';
          this.alertMessage = noServiceMessage;
          this.countryRepos = [];
        },
        () => {
          if (!this.countryRepos || !this.countryRepos.length) {
            this.noRepositories = noRepositoriesFound;
          } else {
            this.noRepositories = '';
            if (this.selectedCountry.code == country.code) {
              /* to make sure that the correct set of repositories is displayed - in case of consequent country selections */
              this.hasSelectedCountry = true;
            } else {
              this.countryRepos = [];
            }
          }
          this.loadingMessage = '';
          this.alertMessage = '';
          console.log('this.selectedCountry became', JSON.stringify(this.selectedCountry));
        }
      );
    }, 500);
  }

  getLatestUpdate() {
    return this.repoService.getListLatestUpdate(this.mode).subscribe (
      responseDate => this.latestUpdate = responseDate['lastCollectionDate'],
      error => console.log(error)
    );
  }

  onChooseRepository(id: string){
    this.hasSelectedRepo = true;
    this.repoId = id;
  }

  pushedNext() {
    this.promptNext.emit(true);
  }

  public goToNextStep(): boolean {
    if (!this.hasSelectedRepo || this.noRepositories) {
      this.alertMessage = noRepositoryChosenMsg;
      return false;
    } else {
      this.emitRepoId.emit(this.repoId);
      return true;
    }
  }

  searchTerm(event: any) {
    this.searchBox = event.target.value;
  }

}
