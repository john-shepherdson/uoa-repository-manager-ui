/*
*  created by myrto on 19/12/2018
*/

import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Repository, RepositoryInterface } from '../../../domain/typeScriptClasses';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { AsideHelpContentComponent, HelpContentComponent } from '../../../shared/reusablecomponents/help-content.component';
import { RepositoryService } from '../../../services/repository.service';
import { DatasourceNewInterfaceFormComponent } from '../../../shared/reusablecomponents/sources-forms/datasource-new-interface-form.component';
import { from, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import {
  errorsInInterfaces,
  formErrorRegisterRepo,
  formInfoLoading, formInterfacesLoading, loadingInterfacesError, loadingRepoError,
  noInterfacesSaved
} from '../../../domain/shared-messages';
import { DatasourceUpdateFormComponent } from '../../../shared/reusablecomponents/sources-forms/datasource-update-form.component';
import { RegisterDatasourceSelectExistingComponent } from './register-datasource-select-existing.component';

@Component({
  selector: 'app-register-existing-datasource',
  templateUrl: './register-existing-datasource.component.html'
})
export class RegisterExistingDatasourceComponent implements OnInit {
  loadingMessage: string;
  errorMessage: string;

  datasourceType: string;
  currentMode: string;
  datasourceId: string;
  repo: Repository;
  repoInterfaces: RepositoryInterface[] = [];
  interfacesToDelete: string[] = [];
  // comments: string;

  /* queryParams are used to follow the steps without refreshing the page
   * This was needed for Help Service [which sends back info according to the current router.url].
   * The param that is used is 'step' and the values are: 'selectDatasource','basicInformation','interfaces','finish'
   * currentStep represents the number of the current step
   */
  currentStep: number;
  @ViewChild('topHelperContent')
  public topHelperContent: HelpContentComponent;
  @ViewChild('leftHelperContent')
  public leftHelperContent: AsideHelpContentComponent;
  @ViewChild('rightHelperContent')
  public rightHelperContent: AsideHelpContentComponent;
  @ViewChild('bottomHelperContent')
  public bottomHelperContent: HelpContentComponent;

  @ViewChild('datasourcesByCountry')
  public datasourcesByCountry: RegisterDatasourceSelectExistingComponent;

  @ViewChild ('registerDatasource')
  registerDatasource: DatasourceUpdateFormComponent;

  @ViewChild ('interfaceComments')
  interfaceComments: DatasourceNewInterfaceFormComponent;

  @ViewChildren('interfacesArray') interfacesArray: QueryList<DatasourceNewInterfaceFormComponent>;
  dataForInterfaceComp: any[] = [];

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private repoService: RepositoryService) {}

  // @ViewChild('updateTermsForm')

  ngOnInit() {
    if (this.datasourceType && this.currentMode) {
      // will execute getStep() every time there is a change in query params
      this.route.queryParams.subscribe(
        params => {
          this.getStep();
        }
      );
    }
  }


  getStep() {
    this.currentStep = 0;
    if (this.route.snapshot.queryParamMap.has('step')) {
      const stepName = this.route.snapshot.queryParamMap.get('step');
      if (stepName === 'basicInformation') {
        if (!this.datasourceId) {
          this.router.navigateByUrl(`/sources/register/${this.datasourceType}?step=selectDatasource`);
        } else {
          this.currentStep = 1;
        }
      } else if (stepName === 'interfaces') {
        if (!this.repo) {
          this.router.navigateByUrl(`/sources/register/${this.datasourceType}?step=selectDatasource`);
        } else {
          this.currentStep = 2;
        }
      } else if (stepName === 'finish') {
        this.currentStep = 3;
        // ToU: to enable ToU delete the 2 lines above and uncomment the section below
        /*} else if (stepName === 'termsOfUse') {
          if (!this.interfacesArray) {
            this.router.navigateByUrl(`/sources/register/${this.datasourceType}?step=selectDatasource`);
          } else {
            this.currentStep = 3;
          }
        } else if (stepName === 'finish') {
          this.currentStep = 4;*/
      }
    }
    this.rightHelperContent.ngOnInit();
    this.topHelperContent.ngOnInit();
    this.leftHelperContent.ngOnInit();
    this.bottomHelperContent.ngOnInit();
  }

  moveAStep() {
    window.scrollTo(0, 0);
    this.errorMessage = '';
    if (this.currentStep === 0) {
      if (this.datasourcesByCountry.goToNextStep()) {
        console.log(`got datasource with id ${this.datasourceId}`);
        this.router.navigateByUrl(`/sources/register/${this.datasourceType}?step=basicInformation`);
      }
    } else if (this.currentStep === 1) {
      this.registerDatasource.updateRepo();
    } else if (this.currentStep === 2) {
      of(this.getInterfaces()).subscribe(
        errors => {
          if (errors > 0) {
            this.errorMessage = errorsInInterfaces;
            window.scrollTo(1, 1);
          } else {
            if (this.repoInterfaces.length > 0) {
              this.registerRepository();
// ToU: replace above line with the comment below
              // this.router.navigateByUrl(`/sources/register/${this.datasourceType}?step=termsOfUse`);
            } else {
              this.errorMessage = noInterfacesSaved;
              window.scrollTo(1, 1);
            }
          }
        }
      );
      // ToU: uncomment these lines
      // } else if (this.currentStep === 3) {
    //   this.registerRepository();
    }
  }

  moveBackAStep() {
    window.scrollTo(0, 0);
    this.errorMessage = '';
    if (this.currentStep === 1) {
      this.repoInterfaces = [];
      this.repo = null;
      this.router.navigateByUrl(`/sources/register/${this.datasourceType}?step=selectDatasource`);
    } else if (this.currentStep === 2) {
      of(this.getInterfaces()).subscribe(
        () => this.router.navigateByUrl(`/sources/register/${this.datasourceType}?step=basicInformation`)
      );
      // ToU: uncomment these lines
      // } else if (this.currentStep === 3) {
    //   this.router.navigateByUrl(`/sources/register/${this.datasourceType}?step=interfaces`);
    }
  }

  addInterfaceToList(intrf?: RepositoryInterface) {

    console.log('clicked add interface to list');

    const curIndex = this.dataForInterfaceComp.length;
    const curRepoInfo = { id: this.repo.id, datasourceType: this.repo.datasourceType,
      datasourceClass: this.repo.datasourceClass, registeredBy: this.repo.registeredBy };
    if (intrf) {
      this.dataForInterfaceComp.push([true, curIndex, curRepoInfo, intrf]);
    } else {
      this.dataForInterfaceComp.push([true, curIndex, curRepoInfo]);
    }
  }

  removeInterfaceFromList(i: number) {
    const tempArray = this.dataForInterfaceComp;
    this.dataForInterfaceComp = [];
    if (tempArray[i] && tempArray[i][3] && tempArray[i][3].id) {
      this.interfacesToDelete.push(tempArray[i][3].id);
    }
    tempArray.splice(i, 1);
    this.dataForInterfaceComp = tempArray;
    console.log(JSON.stringify(this.dataForInterfaceComp));
  }

  getInterfaces() {
    // this.repoInterfaces = [];
    let invalidFormsCount = 0;
    for (const el of this.interfacesArray.toArray()) {
      const intrf = el.getInterface();
      if (intrf) {
        if (intrf.id && this.repoInterfaces.some(intr => intr.id === intrf.id)) {
          const i = this.repoInterfaces.findIndex( intr => intr.id === intrf.id );
          this.repoInterfaces[i] = intrf;
        } else {
          this.repoInterfaces.push(intrf);
        }
        console.log(JSON.stringify(intrf));
      } else {
        invalidFormsCount = invalidFormsCount + 1;
        const repo_interface = el.getCurrentValues();
        if (repo_interface.id && this.repoInterfaces.some(intr => intr.id === repo_interface.id)) {
          const i = this.repoInterfaces.findIndex( intr => intr.id === repo_interface.id );
          this.repoInterfaces[i] = repo_interface;
        } else {
          this.repoInterfaces.push(repo_interface);
        }
        console.log(JSON.stringify(repo_interface));
      }
    }
    console.log('new interfaces is ', this.repoInterfaces);
    return invalidFormsCount;
  }

  fillInterfacesForms() {
    this.dataForInterfaceComp = [];
    if (this.repoInterfaces && (this.repoInterfaces.length > 0)) {
      for (let i = 0; i < this.repoInterfaces.length; i++) {
        this.dataForInterfaceComp.push([
          true, i,
          { id: this.repo.id,
            datasourceType: this.repo.datasourceType,
            datasourceClass: this.repo.datasourceClass,
            registeredBy: this.repo.registeredBy
          },
          this.repoInterfaces[i]
        ]);
      }
    } else {
      this.dataForInterfaceComp.push([
        true, 0,
        { id: this.repo.id,
          datasourceType: this.repo.datasourceType,
          datasourceClass: this.repo.datasourceClass,
          registeredBy: this.repo.registeredBy
        }
      ]);
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

  getUpdatedRepo(repo: Repository) {
    this.repo = repo;
    if (this.repoInterfaces.length === 0) {
      this.getRepoInterfaces();
    } else {
      of(this.fillInterfacesForms()).subscribe(
        () => this.router.navigateByUrl(`/sources/register/${this.datasourceType}?step=interfaces`)
      );
    }
  }

  getRepoInterfaces() {
    this.loadingMessage = formInterfacesLoading;
    this.errorMessage = '';
    this.repoService.getRepositoryInterface(this.datasourceId).subscribe(
      interfaces => {
        this.repoInterfaces = interfaces.sort( function(a, b) {
          if (a.id < b.id) {
            return -1;
          } else if (a.id > b.id) {
            return 1;
          } else {
            return 0;
          }
        });
        console.log(`the number of interfaces is ${this.repoInterfaces.length}`);
      },
      error => {
          console.log(error);
          this.errorMessage = loadingInterfacesError;
          this.loadingMessage = '';
          window.scrollTo(1, 1);
        },
      () => {
        this.loadingMessage = '';
        of(this.fillInterfacesForms()).subscribe(
          () => this.router.navigateByUrl(`/sources/register/${this.datasourceType}?step=interfaces`)
        );
      }
    );
  }

  downloadLogo() {
    window.open('../../../../assets/imgs/3_0ValidatedLogo.png', '_blank', 'enabledstatus=0,toolbar=0,menubar=0,location=0');
  }

  registerRepository() {
    if (this.repo) {
      this.loadingMessage = 'Saving changes';
      this.errorMessage = '';
      this.repoService.addRepository( this.repo.datasourceType, this.repo).subscribe(
        response => {
          console.log(`addRepository responded: ${response.id}, ${response.registeredBy}`);
          this.repo = response;
        },
        error => {
          console.log(error);
          this.loadingMessage = '';
          this.errorMessage = formErrorRegisterRepo;
          window.scrollTo(1, 1);
        },
        () => {
          this.saveNewInterfaces();
          // TODO: update terms when backend is ready, maybe POST with updateRepository
        }
      );
    }
  }

  saveNewInterfaces() {
    if (this.repoInterfaces && (this.repoInterfaces.length > 0)) {
      from(this.repoInterfaces).pipe(
        concatMap(intrf => {
          if (intrf.id) {
            let req;
            if (this.interfacesToDelete.some(id => id === intrf.id)) {
              req = this.repoService.deleteInterface(intrf.id, this.repo.registeredBy);
            } else {
              const comments = this.interfaceComments.getComments();
              req = this.repoService.updateInterface(this.repo.id, this.repo.registeredBy, comments, intrf);
            }
            return req;
          } else {
            const comments = this.interfaceComments.getComments();
            return this.repoService.addInterface(this.repo.datasourceType, this.repo.id, this.repo.registeredBy, comments, intrf);
          }
        })
      ).subscribe(
        res => console.log('after save interfaces', JSON.stringify(res)),
        er => {
          console.log(er);
          this.loadingMessage = '';
          this.errorMessage = 'Not all changes were saved. Please try again';
          window.scrollTo(1, 1);
        },
        () => {
          this.loadingMessage = '';
          this.datasourceId = null;
          this.repo = null;
          this.repoInterfaces = [];
          this.router.navigateByUrl(`/sources/register/${this.datasourceType}?step=finish`);
        }
      );
    }
  }
}
