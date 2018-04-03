import { Component, OnInit, Type, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Description, interfaceFormDesc } from '../../../domain/oa-description';
import { DatasourceInterfaceFormComponent } from '../sources-forms/datasource-interface-form.component';
import {Repository, RepositoryInterface} from '../../../domain/typeScriptClasses';
import { DatasourceCreateFormComponent } from '../sources-forms/datasource-create-form.component';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {MyArray} from "../../../shared/reusablecomponents/forms/my-array.interface";
import {noInterfacesSaved} from "../../../domain/shared-messages";
import {
  AsideHelpContentComponent,
  HelpContentComponent
} from "../../../shared/reusablecomponents/help-content.component";
import {RepositoryService} from "../../../services/repository.service";
import {ConfirmationDialogComponent} from "../../../shared/reusablecomponents/confirmation-dialog.component";

@Component ({
  selector: 'app-sr-journal',
  templateUrl: 'sr-journal.component.html'
})

export class SrJournalComponent implements OnInit {
  loadingMessage: string;
  errorMessage: string;

  showForm: boolean;
  showInterfaces: boolean;
  showFinish: boolean;
  step2: string = '';
  step3: string = '';

  repo: Repository = null;
  repoInterfaces: RepositoryInterface[] = [];

  /* queryParams is used to change the queryParams without refreshing the page
   * This was needed for Help Service [which sends back info according to the current router.url]
   * the param that is used is 'step' and the values are: 'basicInformation','interfaces','finish'
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

  @ViewChild ('registerJournal')
  registerJournal: DatasourceCreateFormComponent;

  @ViewChild('interfaceFormArray')
  public interfaceFormArray: MyArray;

  @ViewChild('confirmDelete')
  public confirmDelete: ConfirmationDialogComponent;
  isModalShown: boolean = false;

  group: FormGroup;
  interfaceFormDesc: Description = interfaceFormDesc;
  addDatasourceInterfaces: Type<any> = DatasourceInterfaceFormComponent;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private repoService: RepositoryService) {}

  ngOnInit() {
    this.setQueryParam('basicInformation');
    this.showForm = true;
  }

  moveAStep(){
    this.errorMessage = '';
    if (this.showForm) {
      this.registerJournal.registerDatasource();
    } else if (this.showInterfaces) {
      if (this.interfaceFormArray.checkIfOneElementExists()) {
        this.addRepository();
      } else {
        this.errorMessage = noInterfacesSaved;
      }
    }
  }

  moveBackAStep(){
    this.errorMessage = '';
    if (this.showInterfaces) {
      this.interfaceFormArray.emitExportedDataArray();
      this.setQueryParam('basicInformation');
      this.showForm = true;
      this.showInterfaces = false;
      this.step2 = '';
    } else if (this.showFinish) {
      this.setQueryParam('interfaces');
      this.showInterfaces = true;
      this.showFinish = false;
      this.step3 = '';
    }
  }

  getCurrentRepo(repo: Repository) {
    this.repo = repo;
    this.setQueryParam('interfaces');
    this.showForm = false;
    this.showInterfaces = true;
    this.step2 = 'active';
    this.group = this.fb.group({});
  }

  showDeleteInterfaceModal(event: any) {
    this.confirmDelete.showModal();
  }

  confirmedRemoval(event: any) {
    this.interfaceFormArray.confirmedRemove(event);
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

  addRepository() {
    if (this.repo) {
      this.loadingMessage = 'Saving changes';
      this.errorMessage = '';
      this.repoService.addRepository(this.repo.datasourceType, this.repo).subscribe(
        response => {
          console.log(`addRepository responded:\n${JSON.stringify(response)}`);
          this.repo = response;
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
        this.step3 = 'active';
      }
    }
  }

  getNewInterfaces (interfaces: RepositoryInterface[]) {
    this.repoInterfaces = interfaces;
  }


}
