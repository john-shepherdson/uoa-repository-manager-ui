import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {DatasourceSearchService} from '../services/datasource-search.service';
import {NgForOf, NgIf} from '@angular/common';
import {InputComponent, Option} from '../../../shared/input.component';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Paging} from '../../../domain/paging';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {objectKeys} from 'codelyzer/util/objectKeys';
import {Country, DatasourceDetails} from 'src/app/domain/typeScriptClasses';
import {RequestsService} from '../services/request.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import UIkit from 'uikit';
import {Observable} from 'rxjs';
import {CommunityContextService} from '../../../services/communityContext.service';
import { StickyFooterComponent } from "src/app/shared/sticky-footer/sticky-footer.component";
import {environment} from '../../../../environments/environment';


@Component({
  selector: 'datasource-search',
  templateUrl: './datasource-search.component.html',
  imports: [
    NgForOf,
    InputComponent,
    ReactiveFormsModule,
    NgIf,
    MatPaginatorModule,
    StickyFooterComponent
],
  standalone: true
})

export class DatasourceSearchComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  qParams: Params = {};
  gateway = false;
  communityId;
  countries: Country[] = [];
  datasources?: Paging<DatasourceDetails>;

  errorMessage: string | null = null;
  loadingMessage: string | null = null;

  commentText = '';
  currentDatasourceId: string | null = null;
  currentType: 'PRIMARY' | 'AFFILIATED' | null = null;
  currentRequestKind: 'datasource' | 'gateway' | null = null;

  // keyword: FormControl = new FormControl(null);
  filterForm: FormGroup = new FormGroup({
    sort: new FormControl<string>(null),
    order: new FormControl<string>(null),
    page: new FormControl<number>(0),
    size: new FormControl<number>(10),
    keyword: new FormControl<string>(null),
    requestType: new FormControl<string | null>(null),
    status: new FormControl<string | null>(null)
    // from: '0'
  });

  sortByOptions: Option[] = [
    {value: 'registrationdate', label: 'Registration Date'},
    {value: 'dateofvalidation', label: 'Validation Date'},
    {value: 'officialname', label: 'Name'},
    {value: 'id', label: 'Id'}
  ];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private datasourceSearch: DatasourceSearchService,
              private requestService: RequestsService,
              private communityContextService: CommunityContextService) {
    this.route.data.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (value) => {
        this.gateway = value.gateway;
      }
    });
    this.communityContextService.community.subscribe({
      next: (community) => {
        this.communityId = community ? community.id : environment.OPENAIRE_ID;
      }
    });
  }

  private getDatasources(params): Observable<Paging<DatasourceDetails>> {
    if (this.gateway) {
      return this.datasourceSearch.searchGatewayDatasources(this.communityId, params);
    } else {
      return this.datasourceSearch.search(params);
    }
  }

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

      this.loadingMessage = 'Loading datasources..';
      this.getDatasources(params).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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

    const value = this.filterForm.get(path)?.value;

    if (value === 'null' || value === '') {
      delete this.qParams[path];
    } else {
      this.qParams[path] = value;
    }

    this.qParams['page'] = 0;
    this.filterForm.get('page')?.setValue(0);
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

  getCountryName(countryCode: string): string {
    for (const country of Object.values(this.countries)) {
      if (country.code === countryCode) {
        return country.name;
      }
    }
  }


  // createRequest(datasourceId: string, type: 'PRIMARY' | 'AFFILIATED') {
  //   console.log('ID: ', datasourceId, ' type: ', type);

  //   this.requestService.createRequest(datasourceId, type).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
  //     next: (value) => {
  //       console.log(value);
  //     },
  //     error: (err) => {
  //       console.error(err);
  //     }
  //   })

  // }

  createGatewayRequest(datasourceId: string, type: 'PRIMARY' | 'AFFILIATED') {
    console.log(`Submitting Gateway Request for ID: ${datasourceId}, Type: ${type}`);

    this.requestService.createGatewayRequest(datasourceId, type).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (value) => {
        console.log('Gateway Request successful:', value);
      },
      error: (err) => {
        console.error('Gateway Request failed:', err);
      }
    });
  }

  createDatasourceRequest(datasourceId: string, type: 'PRIMARY' | 'AFFILIATED') {
    console.log(`Submitting Datasource Request for ID: ${datasourceId}, Type: ${type}`);

    this.requestService.createDatasourceRequest(datasourceId, type).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (value) => {
        console.log('Datasource Request successful:', value);
      },
      error: (err) => {
        console.error('Datasource Request failed:', err);
      }
    });
  }

  openCommentModal(id: string, type: 'PRIMARY' | 'AFFILIATED', requestKind: 'datasource' | 'gateway') {
    this.currentDatasourceId = id;
    this.currentType = type;
    this.currentRequestKind = requestKind;
    this.commentText = '';
    UIkit.modal('#comment-modal').show();
  }


}
