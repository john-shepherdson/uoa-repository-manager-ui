import { Component, OnInit, ViewChild } from '@angular/core';
import { PiwikService } from '../../services/piwik.service';
import { PiwikInfo } from '../../domain/typeScriptClasses';
import {
  enabledMetricsError,
  enablingMetrics,
  loadingReposMessage,
  reposRetrievalError,
  validatePiwikSiteSuccess
} from '../../domain/shared-messages';
import { ConfirmationDialogComponent } from '../../shared/reusablecomponents/confirmation-dialog.component';
import {URLParameter} from '../../domain/url-parameter';
import {FormBuilder, FormGroup} from '@angular/forms';
import {RepositoryService} from '../../services/repository.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PiwikInfoPage} from '../../domain/page-content';

@Component ({
  selector: 'app-admin-metrics',
  templateUrl: 'adminPg-metrics.component.html'
})

export class AdminPgMetricsComponent implements OnInit {
  piwiks: PiwikInfoPage;
  urlParams: URLParameter[] = [];
  errorMessage: string;
  successMessage: string;
  loadingMessage: string;

  modalTitle = 'Approval Confirmation';
  modalButton = 'Yes, validate';
  isModalShown: boolean;

  formPrepare = {
    handleChangeAndResetPage: '',
    repositoryName: '',
    orderField: '',
    // orderField: 'creationDate',
    order: 'ASC',
    page: '0',
    quantity: '25'
  };

  dataForm: FormGroup;

  @ViewChild('confirmApprovalModal')
  public confirmApprovalModal: ConfirmationDialogComponent;
  private wholePageTotal: number;

  constructor(private piwikService: PiwikService,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router) {}

  ngOnInit() {
    this.dataForm = this.fb.group(this.formPrepare);
    const tempUrlParams = new Array<URLParameter>();
    this.urlParams = [];
    console.log('ngoninit');
    console.log(tempUrlParams);
    this.route.queryParams
      .subscribe(params => {
          for (const i in params) {
            this.dataForm.get(i).setValue(params[i]);
          }
          for (let i in this.dataForm.controls) {
            if (this.dataForm.get(i).value) {
              this.urlParams.push({key: i, value: [this.dataForm.get(i).value]});
            }
          }
          this.handleChange();
        },
        error => this.errorMessage = <any>error
      );

    // this.getPiwiks(tempUrlParams);
    this.isModalShown = false;
  }


  getPiwiks(urlParams) {
    this.loadingMessage = loadingReposMessage;
    this.piwikService.getPiwikSitesForRepos(urlParams)
      .subscribe (
        piwiks => {
          this.piwiks = piwiks;
          console.log(this.piwiks);
          console.log(this.piwiks.results);
          },
        error => {
          console.log(error);
          this.loadingMessage = '';
          this.errorMessage = reposRetrievalError;
        },
        () => {
          this.loadingMessage = '';
          window.scroll(1, 1);
        }
      );
  }

  confirmApproval(repoId: string) {
    this.confirmApprovalModal.ids = [repoId];
    this.confirmApprovalModal.showModal();
  }

  confirmedApproval(ids: string[]) {
    const id = ids[0];
    console.log(`approving validation of piwik for repo with id: ${id}`);
    this.approvePiwik(id);
  }

  approvePiwik(id: string) {
    this.loadingMessage = enablingMetrics;
    this.errorMessage = '';
    this.successMessage = '';

    /*this.piwikService.approvePiwikSite(id).subscribe(*/
    this.piwikService.markPiwikSiteAsValidated(id).subscribe(
      response => console.log(`approvePiwikSite responded: ${JSON.stringify(response)}`),
      error => {
        console.log(error);
        this.loadingMessage = '';
        this.errorMessage = enabledMetricsError;
      },
      () => {
        this.loadingMessage = '';
        this.errorMessage = '';
        this.successMessage = validatePiwikSiteSuccess;
        this.getPiwiks(this.urlParams);
      }
    );
  }

  handleChange() {
    // const tempUrlParams = new Array<URLParameter>();
    this.urlParams = [];
    const map: { [name: string]: string; } = {};

    for (let i in this.dataForm.controls) {
      if (this.dataForm.get(i).value !== '') {
        this.urlParams.push({key: i, value: [this.dataForm.get(i).value]});
        map[i] = this.dataForm.get(i).value;
      }
    }

    this.router.navigate([`/admin/metrics`],
      {queryParams: map});
    this.getPiwiks(this.urlParams);
    // this.getPiwiks();
  }

  handleChangeAndResetPage() {
    this.dataForm.get('page').setValue(0);
    this.handleChange();
  }

  previousPage() {
    if (this.dataForm.get('page').value > 0) {
      this.dataForm.get('page').setValue(+this.dataForm.get('page').value - 1);
      this.handleChange();
    }
  }

  nextPage() {
    this.wholePageTotal = Math.floor(this.piwiks.total / (this.dataForm.get('quantity').value)) - 1;
    if ((this.dataForm.get('page').value <= this.wholePageTotal) && (this.piwiks.total % (this.dataForm.get('quantity').value) !== 0)) {
      this.dataForm.get('page').setValue(+this.dataForm.get('page').value + 1);
      this.handleChange();
    }
  }

}
