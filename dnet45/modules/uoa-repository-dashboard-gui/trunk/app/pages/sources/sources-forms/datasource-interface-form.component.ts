import { Component, Injector, OnDestroy } from '@angular/core';
import { MyGroup } from '../../../shared/reusablecomponents/forms/my-group.interface';
import { FormBuilder, Validators } from '@angular/forms';
import {
  formErrorRequiredFields, formSuccessAddedInterface,
  invalidCustomBaseUrl, noServiceMessage
} from '../../../domain/shared-messages';
import { ValidatorService } from '../../../services/validator.service';
import { ActivatedRoute } from '@angular/router';
import { RepositoryService } from '../../../services/repository.service';
import { InterfaceInformation, RepositoryInterface } from '../../../domain/typeScriptClasses';

@Component ({
  selector: 'datasource-interface-form',
  templateUrl: './datasource-interface-form.component.html'
})

export class DatasourceInterfaceFormComponent extends MyGroup implements OnDestroy {

  successMessage: string;
  errorMessage: string;

  mode: string;

  identifiedBaseUrl: boolean;
  existingValSet: boolean;
  interfaceInfo: InterfaceInformation;
  currentInterface: RepositoryInterface;
  valset: string[] = [];

  compClasses: Map<string,string> = new Map<string,string>();
  classCodes: string[] = [];

  readonly groupDefinition = {
    baseUrl: ['', Validators.required],
    selectValidationSet: [''],
    customValidationSet: [''],
    compatibilityLevel: ['', Validators.required]
  };

  constructor(injector: Injector,
              private valService: ValidatorService,
              private repoService: RepositoryService,
              private route: ActivatedRoute){
    super(injector);
  }

  ngOnInit() {
      this.getCompatibilityClasses();
      console.log(`other data is: ${JSON.stringify(this.otherData)}`);
      if (this.data && this.data.length) {
        this.currentInterface = this.data[0];
        this.patchData.next({
            baseUrl: this.data[0].baseUrl,
            selectValidationSet: '',
            customValidationSet: '',
          compatibilityLevel:this.data[0].desiredCompatibilityLevel
          }
        );
        this.getInterfaceInfo(this.data[0].baseUrl);
        this.data.splice(0,1);
      }
      super.ngOnInit();
      console.log(this.group, this.parentGroup);
      this.existingValSet = true;
      this.getMyControl('customValidationSet').disable();
  }

  chooseValSet(existingValSet: boolean) {
     if(existingValSet) {
       this.existingValSet = true;
       this.getMyControl('selectValidationSet').enable();
       this.getMyControl('customValidationSet').disable();
     }  else {
       this.existingValSet = false;
       this.getMyControl('selectValidationSet').disable();
       this.getMyControl('customValidationSet').enable();
     }
  }

  saveInterface() {
    if (this.group.valid) {
      if (this.identifiedBaseUrl) {
        let baseUrl = this.getMyControl('baseUrl').value;
        let valset: string;
        if (this.getMyControl('selectValidationSet').enabled ) {
          valset = this.getMyControl('selectValidationSet').value;
        } else {
          valset = this.getMyControl('customValidationSet').value;
        }
        let compLvl = this.getMyControl('compatibilityLevel').value;

        if (this.currentInterface) {
          this.currentInterface.baseUrl = baseUrl;
          //this.currentInterface.accessSet = this.valset; CHECK IF THIS IS THE CORRECT FIELD
          this.currentInterface.desiredCompatibilityLevel = compLvl;
          /*update Interface*/

        } else {
          let currentInterface: RepositoryInterface = {
            desiredCompatibilityLevel: compLvl,
            complianceName: 'UNKNOWN',
            upgradeToV3: '',
            deleteApi: false,
            accessSet: valset,
            accessFormat: '',
            metadataIdentifierPath: '',
            lastCollectionDate: '',
            nextScheduledExecution: '',
            status: '',
            collectedFrom: '',
            id: '',
            typology: '',
            compliance: '',
            contentDescription: '',
            accessProtocol: '',
            baseUrl: '',
            active: false,
            removable: false,
            accessParams: {},
            extraFields: {}
          };
          this.repoService.addInterface(this.otherData[1], this.otherData[0], currentInterface).subscribe(
            addedInterface => {
              console.log(`addInterface responded ${addedInterface}`);
              this.currentInterface = addedInterface;
            },
            error => console.log(error),
            () => {
              this.successMessage = formSuccessAddedInterface;
              this.errorMessage = '';
            }
          );
        }
      } else {
        this.errorMessage = invalidCustomBaseUrl;
      }
    } else {
      this.errorMessage = formErrorRequiredFields;
      this.successMessage = '';
    }
  }

  getInterfaceInfo(baseUrl: string) {
    if(baseUrl) {
      this.valService.getInterfaceInformation(baseUrl).subscribe(
        info => {
          this.interfaceInfo = info;
          if (this.interfaceInfo.identified) {
            this.identifiedBaseUrl = true;
            this.errorMessage = '';
          } else {
            this.errorMessage = invalidCustomBaseUrl;
          }
          if (this.interfaceInfo.sets) {
            this.valset = this.interfaceInfo.sets;
            console.log(this.valset);
          }
        },
        error => {
          console.log(error);
          this.identifiedBaseUrl = false;
          this.errorMessage = noServiceMessage;
        }
      );
    }
  }

  getMode() {
    if (this.route.snapshot.paramMap.get('id')) {
      this.mode = this.route.snapshot.paramMap.get('id').split("_")[0];
    } else {
      this.mode = this.route.snapshot.url[0].path;
    }
  }

  getCompatibilityClasses() {
    this.getMode();
    this.repoService.getCompatibilityClasses(this.mode).subscribe(
      classes => {
        this.compClasses = classes;
        for (let key in this.compClasses){
          this.classCodes.push(key);
        }
      },
      error => {
        this.errorMessage = noServiceMessage;
        console.log(error);
      }
    );
  }

  ngOnDestroy() {
    if (this.currentInterface) {
/*      this.repoService.deleteInterface(this.currentInterface.id).subscribe(
        response => console.log(`deleteInterface responded: ${response}`),
        error => console.log(error)
      );*/
      console.log(`deleting ${this.currentInterface.id}`);
    } else {
      console.log(`deleting empty interface form`);
    }
  }


}
