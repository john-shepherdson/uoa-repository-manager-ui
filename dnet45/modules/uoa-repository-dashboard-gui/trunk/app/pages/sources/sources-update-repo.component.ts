import { Component, OnInit, Type } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UpdateDatasourceInterfaceFormComponent } from './update-datasource-interface-form.component';
import { Description, interfaceFormDesc } from '../../domain/oa-description';
import { RepositoryInterface } from '../../domain/typeScriptClasses';
import { RepositoryService } from '../../services/repository.service';
import { ActivatedRoute } from '@angular/router';


@Component ({
  selector: 'sources-update-repo',
  templateUrl: 'sources-update-repo.component.html'
})

export class SourcesUpdateRepoComponent implements OnInit {

  repoInterfaces: RepositoryInterface[] = [];

  group: FormGroup;
  interfaceFormDesc: Description = interfaceFormDesc;
  updateDatasource : Type<any> = UpdateDatasourceInterfaceFormComponent;

  constructor(
    private route: ActivatedRoute,
    private repoService: RepositoryService,
    private fb: FormBuilder) {}

  // use for the other tab
  // @ViewChild('datasourceForm')
  // datasourceForm : UpdateDatasourceInterfaceFormComponent;

  ngOnInit() {
    this.getRepoInterfaces();
    this.group = this.fb.group({});
/*
    this.group.patchValue(this.repoInterfaces);
    this.group.markAsPristine();
*/
    // console.log("DATASOURCE",this.datasourceForm);
  }

  getRepoInterfaces(): void {
    let id = this.route.snapshot.paramMap.get('id');
    this.repoService.getRepositoryInterface(id).subscribe(
      interfaces => this.repoInterfaces = interfaces,
      error => console.log(error)
    );
/*
    this.repoService.getRepositoryInterface(id).subscribe(
      interfaces => {
        for(let intrf of interfaces){
          this.repoInterfaces.push({baseUrl: intrf.baseUrl, selectValidationSet: intrf.accessSet, compatibilityLevel: intrf.desiredCompatibilityLevel});
        }
      },
      error => console.log(error)
    );
*/
  }


}


export class RepositoryInterfaceSummary {
  baseUrl: string;
  selectValidationSet: string;
  compatibilityLevel: string;
}
