import { Component, OnInit, Type } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { DatasourceInterfaceFormComponent } from './sources-forms/datasource-interface-form.component';
import { RepositoryInterface } from '../../domain/typeScriptClasses';
import { RepositoryService } from '../../services/repository.service';
import { ActivatedRoute } from '@angular/router';
import {
  Description,
  interfaceFormDesc,
} from '../../domain/oa-description';
import { Subject } from 'rxjs/Subject';



@Component ({
  selector: 'sources-update-repo',
  templateUrl: 'sources-update-repo.component.html'
})

export class SourcesUpdateRepoComponent implements OnInit {

  repoId: string;
  repoInterfaces: RepositoryInterface[] = [];

  group: FormGroup;
  interfaceFormDesc: Description = interfaceFormDesc;
  updateDatasourceInterfaces: Type<any> = DatasourceInterfaceFormComponent;

  constructor (
    private fb: FormBuilder,
    private repoService: RepositoryService,
    private route: ActivatedRoute )
  {}


  ngOnInit() {
    this.readRepoId();
    this.loadInterfacesTab();
  }

  readRepoId() {
    this.repoId = this.route.snapshot.paramMap.get('id');
    console.log(`repoId is ${this.repoId}`);
  }


  getRepoInterfaces() {
    this.repoService.getRepositoryInterface(this.repoId).subscribe(
      interfaces => {
        this.repoInterfaces = interfaces;
        console.log(`the number of interfaces for ${this.repoId} is ${this.repoInterfaces.length}`);
      },
      error => console.log(error)
    );
  }

  loadInterfacesTab() {
    this.getRepoInterfaces();
    this.group = this.fb.group({});
    setTimeout(() => {
      console.log("PATCHING");
      let patched = [];
      this.repoInterfaces.forEach(item => {
        patched.push({
          baseUrl : item.baseUrl,
          selectValidationSet : item.accessSet,
          compatibilityLevel : item.desiredCompatibilityLevel
        });
      });
      this.group.patchValue(patched);
      console.log(`PATCHED: ${JSON.stringify(patched)}`);
    },500);
  }


}
