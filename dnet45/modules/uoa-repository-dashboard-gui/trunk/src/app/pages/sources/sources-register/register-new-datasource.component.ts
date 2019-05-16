import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Repository, RepositoryInterface } from '../../../domain/typeScriptClasses';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { AsideHelpContentComponent, HelpContentComponent } from '../../../shared/reusablecomponents/help-content.component';
import { RepositoryService } from '../../../services/repository.service';
import { DatasourceCreateFormComponent } from '../sources-forms/datasource-create-form.component';
import { DatasourceNewInterfaceFormComponent } from '../sources-forms/datasource-new-interface-form.component';
import { from, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { formErrorRegisterRepo, noInterfacesSaved } from '../../../domain/shared-messages';

@Component({
  selector: 'app-register-new-datasource',
  templateUrl: './register-new-datasource.component.html'
})
export class RegisterNewDatasourceComponent implements OnInit {
  loadingMessage: string;
  errorMessage: string;

  datasourceType: string;
  repo: Repository = null;
  repoInterfaces: RepositoryInterface[] = [];

  /* queryParams are used to follow the steps without refreshing the page
   * This was needed for Help Service [which sends back info according to the current router.url].
   * The param that is used is 'step' and the values are: 'basicInformation','interfaces','finish'
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

  @ViewChild ('registerDatasource')
  registerDatasource: DatasourceCreateFormComponent;

  @ViewChildren('interfacesArray') interfacesArray: QueryList<DatasourceNewInterfaceFormComponent>;
  dataForInterfaceComp: any[] = [];

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private repoService: RepositoryService) {}

  ngOnInit() {
    if (this.datasourceType) {

      // will execute getStep() every time there is a change in query params
      this.route.queryParams.subscribe(
        params => {
          this.getStep();
        }
      );
    }
  }


  getStep() {
    this.currentStep = 1;
    if (this.route.snapshot.queryParamMap.has('step')) {
      const stepName = this.route.snapshot.queryParamMap.get('step');
      if (stepName === 'basicInformation') {
        this.currentStep = 1;
      } else if (stepName === 'interfaces') {
        if (!this.repo) {
          this.navigateToStep('basicInformation');
        } else {
          this.currentStep = 2;
        }
      } else if (stepName === 'finish') {
        this.currentStep = 3;
      }
    }
  }

  navigateToStep(step: string) {
    this.router.navigateByUrl(`/sources/register/${this.datasourceType}?step=${step}`)
      .then( () => {
          this.getStep();
          this.rightHelperContent.ngOnInit();
          this.topHelperContent.ngOnInit();
          this.leftHelperContent.ngOnInit();
          this.bottomHelperContent.ngOnInit();
        }
      );
  }

  moveAStep() {
    this.errorMessage = '';
    if (this.currentStep === 1) {
      this.registerDatasource.registerDatasource();
    } else if (this.currentStep === 2) {
      of(this.getInterfaces()).subscribe(
        () => {
          if (this.repoInterfaces.length > 0) {
            this.addRepository();
          } else {
            this.errorMessage = noInterfacesSaved;
          }
        }
      );
    }
  }

  moveBackAStep() {
    this.errorMessage = '';
    if (this.currentStep === 2) {
      of(this.getInterfaces()).subscribe(
        () => this.navigateToStep('basicInformation')
      );
    }
  }

  addInterfaceToList(intrf?: RepositoryInterface) {
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
    tempArray.splice(i, 1);
    this.dataForInterfaceComp = tempArray;
    console.log(JSON.stringify(this.dataForInterfaceComp));
  }

  getInterfaces() {
    this.repoInterfaces = [];
    for (const el of this.interfacesArray.toArray()) {
      const intrf = el.getInterface();
      if (intrf) {
        this.repoInterfaces.push(intrf);
        console.log(JSON.stringify(intrf));
      }
    }
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

  getCurrentRepo(repo: Repository) {
    this.repo = repo;
    of (this.fillInterfacesForms()).subscribe(
      () => this.navigateToStep('interfaces')
    );
  }

  downloadLogo() {
    window.open('../../../../assets/imgs/3_0ValidatedLogo.png', '_blank', 'enabledstatus=0,toolbar=0,menubar=0,location=0');
  }

  addRepository() {
    if (this.repo) {
      this.loadingMessage = 'Saving changes';
      this.errorMessage = '';
      this.repoService.addRepository(this.repo.datasourceType, this.repo).subscribe(
        response => {
          console.log(`addRepository responded: ${response.id}, ${response.registeredBy}`);
          this.repo = response;
        },
        error => {
          console.log(error);
          this.loadingMessage = '';
          this.errorMessage = formErrorRegisterRepo;
        },
        () => {
          this.saveNewInterfaces();
        }
      );
    }
  }

  saveNewInterfaces() {
    if (this.repoInterfaces && (this.repoInterfaces.length > 0)) {
      from(this.repoInterfaces).pipe(
        concatMap(intrf => {
          if (intrf.id) {
            return this.repoService.updateInterface(this.repo.id, this.repo.registeredBy, intrf);
          } else {
            return this.repoService.addInterface(this.repo.datasourceType, this.repo.id, this.repo.registeredBy, intrf);
          }
        })
      ).subscribe(
        res => console.log('after save interfaces', JSON.stringify(res)),
        er => {
          console.log(er);
          this.loadingMessage = '';
          this.errorMessage = 'Not all changes were saved. Please try again';
        },
        () => {
          this.loadingMessage = '';
          this.repo = null;
          this.repoInterfaces = [];
          this.navigateToStep('finish');
        }
      );
    }
  }
}
