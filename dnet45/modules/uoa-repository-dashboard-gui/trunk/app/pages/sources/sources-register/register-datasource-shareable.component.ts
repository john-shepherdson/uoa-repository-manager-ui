import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RepositoryService } from '../../../services/repository.service';
import {
  loadingReposMessage,
  noRepositoriesFound,
  noRepositoryChosenMsg,
  noServiceMessage } from '../../../domain/shared-messages';
import { Country, Repository } from '../../../domain/typeScriptClasses';

@Component({
  selector: 'register-datasource-shareable',
  templateUrl: './register-datasource-shareable.component.html'
})

export class RegisterDatasourceShareableComponent implements OnInit {
  countries: Country[] = [];
  hasSelectedCountry: boolean;
  selectedCountry: string;
  countryRepos: Repository[] = [];
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
    this.selectedCountry = '';
  }

  setUpSourceInfo() {
    if (this.mode == 'opendoar') {
      this.sourceUrl = 'https://www.opendoar.org/';
      this.sourceTitle = 'OpenDOAR';
    } else if (this.mode == 're3data') {
      this.sourceUrl = 'https://www.re3data.org/';
      this.sourceTitle = 'Re3data';
    }
    this.getLatestUpdate();
  }

  getCountries(){
    this.repoService.getCountries()
      .subscribe(
        countries => this.countries = countries.sort( function(a,b){
          if(a.name<b.name){
            return -1;
          } else if(a.name>b.name){
            return 1;
          } else {
            return 0;
          }
        } ),
        error => {
          this.alertMessage = noServiceMessage;
          console.log(error);
        });
  }

  getReposInCountry(country: string){
    setTimeout( () => {
      console.log(`I got ${country} and ${this.mode}`);
      this.countryRepos = [];
      this.selectedCountry = country;
      this.hasSelectedCountry = false;
      this.loadingMessage = loadingReposMessage;
      this.noRepositories = '';
      this.repoService.getRepositoriesOfCountry(country, this.mode).subscribe(
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
          if (!this.countryRepos.length) {
            this.noRepositories = noRepositoriesFound;
          } else {
            this.noRepositories = '';
            if (this.selectedCountry == country) {
              /* to make sure that the correct set of repositories is displayed - in case of consequent country selections */
              this.hasSelectedCountry = true;
            } else {
              this.countryRepos = [];
            }
          }
          this.loadingMessage = '';
          this.alertMessage = '';
        }
      );
    }, 500);
  }

  getLatestUpdate() {
    return this.repoService.getListLatestUpdate(this.mode).subscribe(
      responseDate => this.latestUpdate = responseDate,
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
    if(!this.hasSelectedRepo || this.noRepositories){
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
