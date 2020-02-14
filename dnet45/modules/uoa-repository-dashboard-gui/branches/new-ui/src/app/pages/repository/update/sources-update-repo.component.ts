import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Repository, RepositoryInterface } from '../../../domain/typeScriptClasses';
import { RepositoryService } from '../../../services/repository.service';
import { ActivatedRoute, Router } from '@angular/router';
import { formInfoLoading, loadingRepoError } from '../../../domain/shared-messages';
import { DatasourceUpdateFormComponent } from '../../../shared/reusablecomponents/sources-forms/datasource-update-form.component';
import { ConfirmationDialogComponent } from '../../../shared/reusablecomponents/confirmation-dialog.component';
import { AuthenticationService } from '../../../services/authentication.service';
import { DatasourceNewInterfaceFormComponent } from '../../../shared/reusablecomponents/sources-forms/datasource-new-interface-form.component';
import {SharedService} from "../../../services/shared.service";

@Component ({
  selector: 'sources-update-repo',
  templateUrl: 'sources-update-repo.component.html',
})

export class SourcesUpdateRepoComponent implements OnInit {
  loadingMessage: string;
  errorMessage: string;

  // repoId: string;
  logoURL: string;
  repo: Repository;
  repoInterfaces: RepositoryInterface[] = [];

  @ViewChild('datasourceUpdateForm') datasourceUpdateForm: DatasourceUpdateFormComponent;

  group: FormGroup;

  @ViewChildren('interfacesArray') interfacesArray: QueryList<DatasourceNewInterfaceFormComponent>;
  dataForInterfaceComp: any[] = [];

  isModalShown: boolean;
  @ViewChild('updateLogoUrlModal')
  public updateLogoUrlModal: ConfirmationDialogComponent;

  constructor ( private fb: FormBuilder,
                private repoService: RepositoryService,
                private authService: AuthenticationService,
                private route: ActivatedRoute,
                private sharedService: SharedService,
                private router: Router) { }


  ngOnInit() {

    if(this.sharedService.getRepository()) {
      this.repo = this.sharedService.getRepository();
      this.logoURL = this.repo.logoUrl;
      this.getRepoInterfaces();
    }

    this.sharedService.repository$.subscribe(
      r => {
        this.repo = r;
        if (this.repo) {
          this.logoURL = this.repo.logoUrl;
          this.getRepoInterfaces();
        }
      }
    );

    // this.readRepoId();
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove("top_bar_active");   //remove the class
    body.classList.remove("page_heading_active");
    body.classList.remove("landing");
    body.classList.add("dashboard");
  }

  // readRepoId() {
  //   this.repoId = this.route.snapshot.paramMap.get('id');
  //   console.log(`repoId is ${this.repoId}`);
  //   this.getRepo();
  // }
  //
  // getRepo() {
  //   if (this.repoId) {
  //     this.loadingMessage = formInfoLoading;
  //     this.repoService.getRepositoryById(this.repoId).subscribe(
  //       repo => {
  //         this.repo = repo;
  //       },
  //       error => {
  //         console.log(error);
  //         this.loadingMessage = '';
  //         this.errorMessage = loadingRepoError;
  //       },
  //       () => {
  //           this.logoURL = this.repo.logoUrl;
  //           this.getRepoInterfaces();
  //       }
  //     );
  //   }
  // }

  getRepoInterfaces() {
    this.group = this.fb.group({});
    this.repoService.getRepositoryInterface(this.repo.id).subscribe(
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
        console.log(`the number of interfaces for ${this.repo.id} is ${this.repoInterfaces.length}`);
      },
      error => {
        console.log(error);
        this.loadingMessage = '';
        this.errorMessage = loadingRepoError;
      },
      () => {
        this.loadingMessage = '';
        this.fillInterfacesForms();
      }
    );
  }


  fillInterfacesForms() {
    this.dataForInterfaceComp = [];
    if (this.repoInterfaces && (this.repoInterfaces.length > 0)) {
      for (let i = 0; i < this.repoInterfaces.length; i++) {
        this.dataForInterfaceComp.push([
          false, i,
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
        false, 0,
        { id: this.repo.id,
          datasourceType: this.repo.datasourceType,
          datasourceClass: this.repo.datasourceClass,
          registeredBy: this.repo.registeredBy
        }
      ]);
    }
  }

  addInterfaceToList(intrf?: RepositoryInterface) {
    const curIndex = this.dataForInterfaceComp.length;
    const curRepoInfo = { id: this.repo.id, datasourceType: this.repo.datasourceType,
      datasourceClass: this.repo.datasourceClass, registeredBy: this.repo.registeredBy };
    if (intrf) {
      this.dataForInterfaceComp.push([false, curIndex, curRepoInfo, intrf]);
    } else {
      this.dataForInterfaceComp.push([false, curIndex, curRepoInfo]);
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
    console.log('new interfaces is ', this.repoInterfaces);
  }

  updateLogoUrl(logoUrl: string) {
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
