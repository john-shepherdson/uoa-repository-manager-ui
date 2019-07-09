import {Component, OnInit} from '@angular/core';
import {noServiceMessage} from '../../domain/shared-messages';
import {Country, RepositorySnippet} from '../../domain/typeScriptClasses';
import {RepositoryService} from '../../services/repository.service';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component ({
  selector: 'app-registration',
  templateUrl: 'registration.component.html'
})

export class RegistrationComponent implements OnInit {

  errorMessage: string;
  successMessage: string;
  loadingMessage: string;
  countries: Country[] = [];
  repositorySnippet: RepositorySnippet[] = [];

  formPrepare = {
    country: '',
    typology: '',
    requestSortBy: 'registrationdate',
    order: 'DESCENDING',
    page: '1',
    pageSize: '25'
  };

  dataForm: FormGroup;

  constructor(private repoService: RepositoryService,
              private fb: FormBuilder) {}

  ngOnInit() {
    this.dataForm = this.fb.group(this.formPrepare);

    this.getCountries();
    // this.repoService.searchRegisteredRepositories('', '', '', '', 'registrationdate', 'DESCENDING', 0, 25)
    //   .subscribe(
    //     suc => this.repositorySnippet = suc,
    //     error => console.log(error),
    //     () => console.log(this.repositorySnippet )
    //   );

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
        },
      );
  }

}
