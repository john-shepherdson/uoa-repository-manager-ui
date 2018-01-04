/*
*  created by myrto on 12/12/2017
*/

import { Component, OnInit } from '@angular/core';
import { Country, Repository } from '../../../domain/typeScriptClasses';
import { RepositoryService } from '../../../services/repository.service';
import { Subject } from 'rxjs/Subject';
import {
  loadingReposMessage, noRepositoriesMessage, noRepositoryChosenMsg,
  noServiceMessage
} from '../../../domain/shared-messages';
/*
import { Observable } from 'rxjs/Observable';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
*/

@Component ({
  selector:'app-sr-literature',
  templateUrl: 'sr-literature.component.html'
})

export class SRLiteratureComponent implements OnInit {
  countries: Country[] = [];
  hasSelectedCountry: boolean;
  selectedCountry: string;
  countryRepos: Repository[] = [];
  noRepositories: string;
  hasSelectedRepo: boolean;
  alertMessage: string;
  showSpinner: boolean;
  loadingMessage: string = loadingReposMessage;
  private searchString = new Subject<string>();


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

  getReposInCountry(country: string, mode: string){
    console.log(`I got ${country} and ${mode}`);
    this.countryRepos = [];
    this.hasSelectedCountry = true;
    this.selectedCountry = country;
    this.showSpinner = true;
    this.repoService.getRepositoriesOfCountry(country,mode).subscribe(
      repos => this.countryRepos = repos,
      error => console.log(error),
      () => {
        if (!this.countryRepos.length) this.noRepositories = noRepositoriesMessage;
        this.showSpinner = false;
      }
    );
  }

  onChooseRepository(){
    this.hasSelectedRepo = true;
  }

  goToNextStep(){
    if(!this.hasSelectedRepo || this.noRepositories){
      this.alertMessage = noRepositoryChosenMsg;
    } else {
      //move to the next step
    }
  }

  refreshSearch(term: string): void {
    /*this.searchString.next(term);*/
    console.log(`read ${term}`);

  }
/*
  searchRepo(): void {
    this.searchString.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: string) => this.countryRepos.filter(
        repo => repo.officialName.includes(term)
      ) )
    );
  }*/

}
