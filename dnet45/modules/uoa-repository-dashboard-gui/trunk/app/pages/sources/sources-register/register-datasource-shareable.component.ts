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
  noRepositories: string;
  hasSelectedRepo: boolean;
  alertMessage: string;
  showSpinner: boolean;
  loadingMessage: string = loadingReposMessage;
  repoId: string;

  sourceUrl: string;
  sourceTitle: string;

  @Input()
  mode: string;

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
    console.log(`I got ${country} and ${this.mode}`);
    this.countryRepos = [];
    this.hasSelectedCountry = true;
    this.selectedCountry = country;
    this.showSpinner = true;
    this.loadingMessage = loadingReposMessage;
    this.noRepositories = '';
    this.repoService.getRepositoriesOfCountry(country,this.mode).subscribe(
      repos => this.countryRepos = repos,
      error => {
        console.log(error);
        this.showSpinner = false;
        this.loadingMessage = '';
        this.alertMessage = noServiceMessage;
      },
      () => {
        if (!this.countryRepos.length) this.noRepositories = noRepositoriesFound;
        this.showSpinner = false;
        this.loadingMessage = '';
      }
    );
  }

  onChooseRepository(id: string){
    this.hasSelectedRepo = true;
    this.repoId = id;
  }

  public goToNextStep(): boolean {
    if(!this.hasSelectedRepo || this.noRepositories){
      this.alertMessage = noRepositoryChosenMsg;
      return false;
    } else {
      return true;
    }
  }

}
