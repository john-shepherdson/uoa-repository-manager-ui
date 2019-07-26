import {Component, OnInit} from '@angular/core';
import {noServiceMessage} from '../../domain/shared-messages';
import {Country, RepositorySnippet} from '../../domain/typeScriptClasses';
import {RepositoryService} from '../../services/repository.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {URLParameter} from '../../domain/url-parameter';

@Component({
  selector: 'app-registration',
  templateUrl: 'adminPg-registrations.component.html',
  styleUrls: ['./adminPg-registrations.component.css']
})

export class RegistrationComponent implements OnInit {

  errorMessage: string;
  successMessage: string;
  loadingMessage: string;
  countries: Country[] = [];
  repositorySnippet: RepositorySnippet[] = [];
  urlParams: URLParameter[] = [];
  thisIsForBadUse: RepositorySnippet[] = []; // remove if page total is fixed!!!

  formPrepare = {
    country: '',
    typology: '',
    officialName: '',
    requestSortBy: 'registrationdate',
    order: 'DESCENDING',
    page: '0',
    size: '25'
  };

  dataForm: FormGroup;

  constructor(private repoService: RepositoryService,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.dataForm = this.fb.group(this.formPrepare);
    const tempUrlParams = new Array<URLParameter>();
console.log('ngoninit');
console.log(tempUrlParams);
    this.route.queryParams
      .subscribe(params => {
        for (const i in params) {
          this.dataForm.get(i).setValue(params[i]);
        }
        for (let i in this.dataForm.controls) {
          if (this.dataForm.get(i).value) {
            tempUrlParams.push({key: i, value: [this.dataForm.get(i).value]});
          }
        }
        this.handleChange();
      },
      error => this.errorMessage = <any>error
    );

    this.getCountries();


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

  getRegisteredRepositories(urlParams: URLParameter[]) {
    this.repoService.searchRegisteredRepositories(this.dataForm.get('page').value,
      this.dataForm.get('size').value, urlParams).subscribe(
        suc => this.repositorySnippet = suc,
        error => console.log(error),
      );
  }

  handleChange() {
    const tempUrlParams = new Array<URLParameter>();
    const map: { [name: string]: string; } = {};

    for (let i in this.dataForm.controls) {
      if (this.dataForm.get(i).value !== '') {
        tempUrlParams.push({key: i, value: [this.dataForm.get(i).value]});
        map[i] = this.dataForm.get(i).value;
      }
    }

    this.router.navigate([`/admin/registrations`],
      {queryParams: map});
    this.getRegisteredRepositories(tempUrlParams);
  }

  handleChangeAndResetPage() {
    this.dataForm.get('page').setValue(0);
    this.handleChange();
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
    const tempUrlParams = new Array<URLParameter>();
    for (let i in this.dataForm.controls) {
      if (this.dataForm.get(i).value !== '') {
        tempUrlParams.push({key: i, value: [this.dataForm.get(i).value]});
      }
    }
      this.repoService.searchRegisteredRepositories(+this.dataForm.get('page').value + 1,
      this.dataForm.get('size').value, tempUrlParams).subscribe(
      suc => this.thisIsForBadUse = suc,
      error => console.log(error),
      () => {
        if (!(this.thisIsForBadUse.length === 0)) {
          this.dataForm.get('page').setValue(+this.dataForm.get('page').value + 1);
          this.handleChange();
        }
      }
    );
    /** **/

  }

}
