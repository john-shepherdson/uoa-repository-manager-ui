/*
*  created by myrto on 12/12/2017
*/

import { Component, OnInit, Type, ViewChild } from '@angular/core';
import { Repository, RepositoryInterface } from '../../../domain/typeScriptClasses';
import { DatasourceUpdateFormComponent } from '../sources-forms/datasource-update-form.component';
import { RegisterDatasourceShareableComponent } from './register-datasource-shareable.component';
import { DatasourceInterfaceFormComponent } from '../sources-forms/datasource-interface-form.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Description, interfaceFormDesc } from '../../../domain/oa-description';
import { RepositoryService } from '../../../services/repository.service';
import {
  formErrorWasntSaved,
  formInfoLoading, formSubmitting, formSuccessAddedInterface, formSuccessUpdatedInterface, formSuccessUpdatedRepo,
  loadingRepoError,
  noInterfacesSaved
} from '../../../domain/shared-messages';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {MyArray} from "../../../shared/reusablecomponents/forms/my-array.interface";
import {
  AsideHelpContentComponent,
  HelpContentComponent
} from "../../../shared/reusablecomponents/help-content.component";
import {ConfirmationDialogComponent} from "../../../shared/reusablecomponents/confirmation-dialog.component";

@Component ({
  selector:'app-sr-literature',
  templateUrl: 'sr-literature.component.html'
})

export class SrLiteratureComponent implements OnInit {
  loadingMessage: string;
  errorMessage: string;

  showRepositories: boolean;
  showForm: boolean;
  showInterfaces: boolean;
  showFinish: boolean;
  step2: string = '';
  step3: string = '';
  step4: string = '';

  datasourceId: string;
  repo: Repository;

  /* queryParams is used to change the queryParams without refreshing the page
   * This was needed for Help Service [which sends back info according to the current router.url]
   * the param that is used is 'step' and the values are: 'selectDatasource','basicInformation','interfaces','finish'
   */
  queryParams: Params = Object.assign({}, this.route.snapshot.queryParams);
  @ViewChild('topHelperContent')
  public topHelperContent: HelpContentComponent;
  @ViewChild('leftHelperContent')
  public leftHelperContent: AsideHelpContentComponent;
  @ViewChild('rightHelperContent')
  public rightHelperContent: AsideHelpContentComponent;
  @ViewChild('bottomHelperContent')
  public bottomHelperContent: HelpContentComponent;

  @ViewChild('datasourcesByCountry')
  public datasourcesByCountry: RegisterDatasourceShareableComponent;

  @ViewChild('updateDatasource')
  public updateDatasource: DatasourceUpdateFormComponent;

  @ViewChild('interfaceFormArray')
  public interfaceFormArray: MyArray;


  group: FormGroup;
  interfaceFormDesc: Description = interfaceFormDesc;
  updateDatasourceInterfaces: Type<any> = DatasourceInterfaceFormComponent;
  repoInterfaces: RepositoryInterface[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private repoService: RepositoryService) {}

  ngOnInit() {
    this.setQueryParam('selectDatasource');
    this.showRepositories=true;
  }

  moveAStep(){
    this.errorMessage = '';
    if(this.showRepositories) {
      if (this.datasourcesByCountry.goToNextStep()) {
        this.setQueryParam('basicInformation');
        this.showRepositories = false;
        this.showForm = true;
        this.step2 = 'active';
        console.log(`got datasource with id ${this.datasourceId}`);
      }
    } else if(this.showForm) {
        this.updateDatasource.updateRepo();
    } else if(this.showInterfaces) {
      if (this.interfaceFormArray.checkIfOneElementExists()) {
        this.updateRepository();
      } else {
        this.errorMessage = noInterfacesSaved;
      }
    }
  }

  moveBackAStep(){
    if(this.showForm) {
      this.setQueryParam('selectDatasource');
      this.showRepositories = true;
      this.showForm = false;
      this.step2 = '';
    } else if(this.showInterfaces) {
      this.interfaceFormArray.emitExportedDataArray();
      this.setQueryParam('basicInformation');
      this.showForm = true;
      this.showInterfaces = false;
      this.step3 = '';
    } else if(this.showFinish) {
      this.setQueryParam('interfaces');
      this.showInterfaces = true;
      this.showFinish = false;
      this.step4 = '';
    }
  }

  goToStep2(emitted: boolean) {
    if (emitted) {
      this.moveAStep();
    }
  }

  getRepoId(emitedId: string) {
    this.datasourceId = emitedId;
    this.getRepo();
  }

  getRepo() {
    this.loadingMessage = formInfoLoading;
    if (this.datasourceId) {
      this.repoService.getRepositoryById(this.datasourceId).subscribe(
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
        }
      );
    }
  }

  getUpdatedRepo(repo: Repository){
    this.repo = repo;
    console.log(`repo was updated!`);
    this.group = this.fb.group({});
    if (this.repoInterfaces.length == 0) {
      this.getRepoInterfaces();
    } else {
      this.setQueryParam('interfaces');
      this.showForm = false;
      this.showInterfaces = true;
      this.step3 = 'active';
    }
  }

  getRepoInterfaces() {
    this.repoService.getRepositoryInterface(this.datasourceId).subscribe(
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
        console.log(`the number of interfaces is ${this.repoInterfaces.length}`);
      },
      error => console.log(error),
      () => {
        this.setQueryParam('interfaces');
        this.showForm = false;
        this.showInterfaces = true;
        this.step3 = 'active';
      }
    );
  }


  downloadLogo() {
    window.open("../../../assets/imgs/3_0ValidatedLogo.png","_blank", "enabledstatus=0,toolbar=0,menubar=0,location=0");
  }

  setQueryParam(value: string) {
    // set param for step
    this.queryParams['step'] = value;
    this.router.navigate([], { relativeTo: this.route, queryParams: this.queryParams });
    this.rightHelperContent.ngOnInit();
    this.topHelperContent.ngOnInit();
    this.leftHelperContent.ngOnInit();
    this.bottomHelperContent.ngOnInit();
  }

  updateRepository() {
    this.loadingMessage = 'Saving changes';
    this.errorMessage = '';
    this.repoService.updateRepository(this.repo).subscribe (
      response => {
        if (response) {
          this.repo = response;
          console.log(`updateInterface responded: ${JSON.stringify(response)}`);
        }
      },
      error => {
        console.log(error);
        this.loadingMessage = '';
        this.errorMessage = 'The changes could not be saved';
      },
      () => {
        this.saveNewInterfaces();
      }
    );
  }

  saveNewInterfaces() {
    if (this.repoInterfaces) {
      let failed: boolean = false;
      for (let intrf of this.repoInterfaces) {
        if (intrf.id) {
          this.repoService.updateInterface(this.repo.id, intrf).subscribe(
            response => {
              console.log(`updateInterface responded ${JSON.stringify(response)}`);
              intrf = response;
            },
            error => {
              console.log(error);
              failed = true;
            }
          );
        } else {
          this.repoService.addInterface(this.repo.datasourceType, this.repo.id, intrf).subscribe (
            addedInterface => {
              console.log(`addInterface responded ${JSON.stringify(addedInterface)}`);
              intrf = addedInterface;
            },
            error => {
              console.log(error);
              failed = true;
            }
          );
        }
        if (failed) {
          break;
        }
      }
      this.loadingMessage = '';
      if (failed) {
        this.errorMessage = 'The changes could not be saved. Please try again';
      } else {
        this.setQueryParam('finish');
        this.showInterfaces = false;
        this.showFinish = true;
        this.step4 = 'active';
      }
    }
  }

  getNewInterfaces (interfaces: RepositoryInterface[]) {
    this.repoInterfaces = interfaces;
    console.log('new interfaces is ',this.repoInterfaces);
  }

}
