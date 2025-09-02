import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from "@angular/router";
import { DatasourceSearchService } from "../services/datasource-search.service";
import { NgForOf, NgIf } from '@angular/common';
import { Datasource } from "../domain/datasource.domain";
import { InputComponent, Option } from '../../../shared/input.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Paging } from '../../../domain/paging';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { objectKeys } from 'codelyzer/util/objectKeys';

@Component({
  selector: 'datasource-search',
  templateUrl: './datasource-search.component.html',
  imports: [
    NgForOf,
    InputComponent,
    ReactiveFormsModule,
    NgIf,
    MatPaginatorModule
  ],
  standalone: true
})

export class DatasourceSearchComponent implements OnInit {

  qParams: Params = {};

  datasources?: Paging<Datasource>;

  errorMessage: string | null = null;
  loadingMessage: string | null = null;

  keyword: FormControl = new FormControl(null);
  filterForm: FormGroup = new FormGroup({
    sort: new FormControl<string>(null),
    order: new FormControl<string>(null),
    page: new FormControl<number>(0),
    size: new FormControl<number>(10),
    keyword: new FormControl<string>(null)
    // from: '0'
  });

  sortByOptions: Option[] = [
    {value: 'registrationdate', label: 'Registration Date'},
    {value: 'dateofvalidation', label: 'Validation Date'},
    {value: 'officialname', label: 'Name'},
    {value: 'id', label: 'Id'}
  ];

  constructor(private route: ActivatedRoute, private router: Router, private datasourceSearch: DatasourceSearchService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.qParams = {...params};
      // 1) parse
      objectKeys(params).forEach(key => {
        this.filterForm.get(key)?.setValue(params[key]);
      });

      // 2) optionally push defaults into the URL if absent:
      if (!params['page'] || !params['size']) {
        this.qParams['page'] = this.filterForm.get('page').value;
        this.qParams['size'] = this.filterForm.get('size').value;
        this.updateWithNavigation();
        return;  // prevents the search below from running on renavigation
      }

      this.loadingMessage = 'Fetching datasources..';
      this.datasourceSearch.search(params).pipe().subscribe({
        next: (data) => {
          this.datasources = data;
          this.loadingMessage = null;
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = err.message;
          this.loadingMessage = null;
        }
      });
    });

  }

  handleFilterChanges(path: string) {
    // console.log(this.filterForm.get(path)?.value);
    this.qParams[path] = this.filterForm.get(path)?.value;
    this.updateWithNavigation();
  }

  handlePaginationChanges(event: PageEvent) {
    // console.log(event);
    this.qParams['page'] = event.pageIndex;
    this.qParams['size'] = event.pageSize;
    this.updateWithNavigation();
  }

  updateWithNavigation() {
    this.router.navigate([], {relativeTo: this.route, queryParams: this.qParams}).then();
  }

}
