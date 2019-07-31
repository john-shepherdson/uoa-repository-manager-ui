import {Component, Input, OnInit, ViewChild} from '@angular/core';
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
import {environment} from '../../../environments/environment';

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
    searchField: '',
    orderField: 'REPOSITORY_NAME',
    order: 'ASC',
    page: '0',
    quantity: '25',
    from: '0'
  };

  dataForm: FormGroup;

  @ViewChild('confirmApprovalModal')
  public confirmApprovalModal: ConfirmationDialogComponent;
  private wholePageTotal: number;
  private piwiksTotal: number;

  constructor(private piwikService: PiwikService,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router) {}

  ngOnInit() {
    this.dataForm = this.fb.group(this.formPrepare);
    this.urlParams = [];
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

    this.isModalShown = false;
  }

  downloadCSV() {
    const url = environment.API_ENDPOINT;
    let csvUrlParams = '/piwik/getPiwikSitesForRepos/csv?';
    for (let i in this.dataForm.controls) {
      if (this.dataForm.get(i).value !== '') {
        csvUrlParams = csvUrlParams.concat(i, '=', this.dataForm.get(i).value, '&');
      }
    }
    csvUrlParams = csvUrlParams.split('&page=')[0];
    window.open(url + csvUrlParams, '_blank');
  }

  getPiwiks() {
    this.loadingMessage = loadingReposMessage;
    this.piwikService.getPiwikSitesForRepos(this.urlParams)
      .subscribe(
        piwiks => {
          this.piwiks = piwiks;
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
        this.getPiwiks();
      }
    );
  }

  handleChange() {
    this.urlParams = [];
    const map: { [name: string]: string; } = {};
    for (let i in this.dataForm.controls) {
      if (this.dataForm.get(i).value !== '') {
        this.urlParams.push({key: i, value: [this.dataForm.get(i).value]});
        map[i] = this.dataForm.get(i).value;
      }
    }

    this.router.navigate([`/admin/metrics`], {queryParams: map});
    this.getPiwiks();
  }

  handleChangeAndResetPage() {
    this.dataForm.get('page').setValue(0);
    this.dataForm.get('from').setValue(0);
    this.handleChange();
  }

  previousPage() {
    if (this.dataForm.get('page').value > 0) {
      this.dataForm.get('page').setValue(+this.dataForm.get('page').value - 1);
      this.dataForm.get('from').setValue(+this.dataForm.get('from').value - +this.dataForm.get('quantity').value);
      this.handleChange();
    }
  }

  nextPage() {
    if ((this.dataForm.get('searchField').value) !== '') { this.piwiksTotal = this.piwiks.to; } else { this.piwiksTotal = this.piwiks.total; }
    this.wholePageTotal = Math.floor(this.piwiksTotal / (this.dataForm.get('quantity').value)) - 1;
    if ((this.dataForm.get('page').value <= this.wholePageTotal) && (this.piwiks.total % (this.dataForm.get('quantity').value) !== 0)) {
      this.dataForm.get('page').setValue(+this.dataForm.get('page').value + 1);
      this.dataForm.get('from').setValue(+this.dataForm.get('from').value + +this.dataForm.get('quantity').value);
      this.handleChange();
    }
  }

}
