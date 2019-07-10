import {Component, OnInit} from '@angular/core';
import {noServiceMessage} from '../../domain/shared-messages';
import {Country, RepositorySnippet} from '../../domain/typeScriptClasses';
import {RepositoryService} from '../../services/repository.service';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: 'registration.component.html'
})

export class RegistrationComponent implements OnInit {

  errorMessage: string;
  successMessage: string;
  loadingMessage: string;
  countries: Country[] = [];
  repositorySnippet: RepositorySnippet[] = [];
  thisIsForBadUse: RepositorySnippet[] = []; // remove if page total is fixed!!!

  formPrepare = {
    country: '',
    typology: '',
    englishname: '',
    officialname: '',
    requestSortBy: 'registrationdate',
    order: 'DESCENDING',
    page: '0',
    pageSize: '25'
  };

  dataForm: FormGroup;

  constructor(private repoService: RepositoryService,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.dataForm = this.fb.group(this.formPrepare);

    this.getCountries();
    this.getRegisteredRepositories();

  }

  getCountries() {
    this.repoService.getCountries()
      .subscribe(
        countries => this.countries = countries.sort(function (a, b) {
          if (a.name < b.name) {
            return -1;
          } else if (a.name > b.name) {
            return 1;
          } else {
            return 0;
          }
        }),
        error => {
          this.loadingMessage = '';
          this.errorMessage = noServiceMessage;
          console.log(error);
        }
      );
  }

  getRegisteredRepositories() {
    this.repoService.searchRegisteredRepositories(this.dataForm.get('country').value, this.dataForm.get('typology').value, this.dataForm.get('englishname').value,
      this.dataForm.get('officialname').value, this.dataForm.get('requestSortBy').value, this.dataForm.get('order').value, this.dataForm.get('page').value,
      this.dataForm.get('pageSize').value).subscribe(
        suc => this.repositorySnippet = suc,
        error => console.log(error),
        // () => console.log(this.repositorySnippet)
      );
  }

  handleChange() {
    this.getRegisteredRepositories();
  }

  getCountryName(countryCode): string {
    for (const country of Object.values(this.countries)) {
      if (country.code === countryCode) {
        return country.name;
      }
    }
  }

  previousPage() {
    if (this.dataForm.get('page').value > 0) {
      this.dataForm.get('page').setValue(+this.dataForm.get('page').value - 1);
      this.handleChange();
    }
  }

  nextPage() {
    /** remove when page total is fixed!!! **/
    this.repoService.searchRegisteredRepositories(this.dataForm.get('country').value, this.dataForm.get('typology').value, this.dataForm.get('englishname').value,
      this.dataForm.get('officialname').value, this.dataForm.get('requestSortBy').value, this.dataForm.get('order').value, +this.dataForm.get('page').value + 1,
      this.dataForm.get('pageSize').value).subscribe(
      suc => this.thisIsForBadUse = suc,
      error => console.log(error),
      () => {
        console.log(this.thisIsForBadUse.length );
        if (!(this.thisIsForBadUse.length === 0)) {
          console.log('got here');
          this.dataForm.get('page').setValue(+this.dataForm.get('page').value + 1);
          this.repositorySnippet = this.thisIsForBadUse;
          // this.handleChange();
        }
      }
    );
    /** **/

  }

}
