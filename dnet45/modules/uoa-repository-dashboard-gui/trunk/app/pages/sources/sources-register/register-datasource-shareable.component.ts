import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RepositoryService } from '../../../services/repository.service';
import {
  loadingReposMessage,
  noRepositoriesMessage,
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

  @Input()
  mode: string;

  @Input()
  repoSourceUrl: string;

  @Output() emmitObject: EventEmitter<string> = new EventEmitter<string>();


  constructor(private repoService:RepositoryService) {}

  ngOnInit() {
    this.getCountries();
    this.hasSelectedCountry = false;
    this.selectedCountry = '';
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
    this.noRepositories = '';
    this.repoService.getRepositoriesOfCountry(country,this.mode).subscribe(
      repos => this.countryRepos = repos,
      error => console.log(error),
      () => {
        if (!this.countryRepos.length) this.noRepositories = noRepositoriesMessage;
        this.showSpinner = false;
      }
    );
  }

  onChooseRepository(id: string){
    this.hasSelectedRepo = true;
    this.repoId = id;
  }

  public goToNextStep() {
    if(!this.hasSelectedRepo || this.noRepositories){
      this.alertMessage = noRepositoryChosenMsg;
    } else {
      this.emmitObject.emit(this.repoId);
    }
  }

}
