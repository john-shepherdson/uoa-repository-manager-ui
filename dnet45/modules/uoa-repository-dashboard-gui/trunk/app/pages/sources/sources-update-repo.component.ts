import { Component, OnInit, Type, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UpdateDatasourceInterfaceFormComponent } from './update-datasource-interface-form.component';
import { Description, interfaceFormDesc, datasourceUpdateFormDesc } from '../../domain/oa-description';
import { RepositoryInterface } from '../../domain/typeScriptClasses';
import { RepositoryService } from '../../services/repository.service';
import { ActivatedRoute } from '@angular/router';
import { UpdateDatasourceFormComponent } from './update-datasource-form.component';


@Component ({
  selector: 'sources-update-repo',
  templateUrl: 'sources-update-repo.component.html'
})

export class SourcesUpdateRepoComponent implements OnInit {

  repoInterfaces: RepositoryInterface[] = [];

  group: FormGroup;
  interfaceFormDesc: Description = interfaceFormDesc;
  updateDatasourceInterfaces : Type<any> = UpdateDatasourceInterfaceFormComponent;

  interfaceDummyList = [
    {
      baseUrl: 'WWW.FDGLKSDJFGLKDJSF.GR',
      selectValidationSet: 'blabla',
      compatibilityLevel: 'moreblabla'
    },
    {
      baseUrl: 'WWW.FDGLKSDJFGLKDJSfdgdfgF.GR',
      selectValidationSet: 'blabla2',
      compatibilityLevel: 'blabla1'
    }
  ];

  updateGroup: FormGroup;
  updateDatasource: Type<any> = UpdateDatasourceFormComponent;
  datasourceUpdateFormDesc: Description = datasourceUpdateFormDesc;


  // use for the other tab
  /*
    @ViewChild('datasourceForm')
    datasourceForm : UpdateDatasourceInterfaceFormComponent;
  */

  constructor(
    private fb: FormBuilder,
    private repoService: RepositoryService,
    private route: ActivatedRoute) {}


  ngOnInit() {
    this.group = this.fb.group({});
    this.updateGroup = this.fb.group({});

    this.getRepoInterfaces();
    // console.log("DATASOURCE",this.datasourceForm);
  }

  getRepoInterfaces() {
    let id = this.route.snapshot.paramMap.get('id');
    this.repoService.getRepositoryInterface(id).subscribe(
      interfaces => this.repoInterfaces = interfaces,
      error => console.log(error)
    );
  }

}
