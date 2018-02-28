import { Component, OnInit, Type } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { DatasourceInterfaceFormComponent } from './sources-forms/datasource-interface-form.component';
import { Repository, RepositoryInterface } from '../../domain/typeScriptClasses';
import { RepositoryService } from '../../services/repository.service';
import { ActivatedRoute } from '@angular/router';
import {
  Description,
  interfaceFormDesc,
} from '../../domain/oa-description';



@Component ({
  selector: 'sources-update-repo',
  templateUrl: 'sources-update-repo.component.html'
})

export class SourcesUpdateRepoComponent implements OnInit {

  repoId: string;
  repo: Repository;
  repoInterfaces: RepositoryInterface[] = [];
  loadInterfaces: boolean;

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
    this.group = this.fb.group({});
    this.getRepoInterfaces();
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
      error => console.log(error),
      () => this.loadInterfaces = true
    );
  }

  getCurrentRepo(repo: Repository) {
    this.repo = repo;
  }


}
