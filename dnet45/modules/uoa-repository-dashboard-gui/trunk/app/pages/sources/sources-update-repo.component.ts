import { Component, OnInit, Type, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatasourceInterfaceFormComponent } from './sources-forms/datasource-interface-form.component';
import { Repository, RepositoryInterface } from '../../domain/typeScriptClasses';
import { RepositoryService } from '../../services/repository.service';
import {ActivatedRoute, Router} from '@angular/router';
import {
  Description,
  interfaceFormDesc,
} from '../../domain/oa-description';
import { formInfoLoading, loadingRepoError } from '../../domain/shared-messages';
import { DatasourceUpdateFormComponent } from './sources-forms/datasource-update-form.component';
import {ConfirmationDialogComponent} from "../../shared/reusablecomponents/confirmation-dialog.component";
import {AuthenticationService} from "../../services/authentication.service";



@Component ({
  selector: 'sources-update-repo',
  templateUrl: 'sources-update-repo.component.html'
})

export class SourcesUpdateRepoComponent implements OnInit {
  loadingMessage: string;
  errorMessage: string;

  repoId: string;
  logoURL: string;
  repo: Repository;
  repoInterfaces: RepositoryInterface[] = [];

  @ViewChild('datasourceUpdateForm') datasourceUpdateForm: DatasourceUpdateFormComponent;

  group: FormGroup;
  interfaceFormDesc: Description = interfaceFormDesc;
  updateDatasourceInterfaces: Type<any> = DatasourceInterfaceFormComponent;

  isModalShown: boolean;
  @ViewChild('updateLogoUrlModal')
  public updateLogoUrlModal: ConfirmationDialogComponent;

  constructor (
    private fb: FormBuilder,
    private repoService: RepositoryService,
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router)
  {}


  ngOnInit() {
    this.readRepoId();
  }

  readRepoId() {
    this.repoId = this.route.snapshot.paramMap.get('id');
    console.log(`repoId is ${this.repoId}`);
    this.getRepo();
    this.getRepoInterfaces();
  }

  getRepo() {
    if (this.repoId) {
      this.loadingMessage = formInfoLoading;
      this.repoService.getRepositoryById(this.repoId).subscribe(
        repo => {
          this.repo = repo;
        },
        error => {
          console.log(error);
          this.loadingMessage = '';
          this.errorMessage = loadingRepoError;
        },
        () => {
          this.loadingMessage = '';
          this.logoURL = this.repo.logoUrl;
          if ( this.authService.getUserEmail() !== this.repo.registeredBy ) {
            this.router.navigateByUrl('/403-forbidden', { skipLocationChange: true });
          }
        }
      );
    }
  }

  getRepoInterfaces() {
    this.group = this.fb.group({});
    this.repoService.getRepositoryInterface(this.repoId).subscribe(
      interfaces => {
        this.repoInterfaces = interfaces.sort( function(a,b) {
          if(a.id<b.id){
            return -1;
          } else if(a.id>b.id){
            return 1;
          } else {
            return 0;
          }
        });
        console.log(`the number of interfaces for ${this.repoId} is ${this.repoInterfaces.length}`);
      },
      error => {
        console.log(error);
        this.loadingMessage = '';
        this.errorMessage = loadingRepoError;
      }, () => this.loadingMessage = ''
    );
  }

  updateLogoUrl(logoUrl: string){
    this.updateLogoUrlModal.ids = [logoUrl];
    this.updateLogoUrlModal.showModal();
  }

  updatedLogoUrl(event: any) {
    this.repo.logoUrl = this.logoURL;
    this.datasourceUpdateForm.updateGroup.get('logoUrl').setValue(this.logoURL);
    this.datasourceUpdateForm.updateRepo();

  }

  getNewLogoUrl( event: any ) {
    this.logoURL = event.target.value;

  }

}
