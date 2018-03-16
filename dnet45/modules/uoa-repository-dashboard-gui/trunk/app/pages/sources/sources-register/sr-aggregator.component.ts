import { Component, OnInit, Type, ViewChild } from '@angular/core';
import { DatasourceInterfaceFormComponent } from '../sources-forms/datasource-interface-form.component';
import { Description, interfaceFormDesc } from '../../../domain/oa-description';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Repository } from '../../../domain/typeScriptClasses';
import { DatasourceCreateFormComponent } from '../sources-forms/datasource-create-form.component';
import {ActivatedRoute, Params, Router} from "@angular/router";

@Component ({
  selector: 'sr-aggregator',
  templateUrl: 'sr-aggregator.component.html'
})

export class SrAggregatorComponent implements OnInit {
  showForm: boolean;
  showInterfaces: boolean;
  showFinish: boolean;
  step2: string = '';
  step3: string = '';

  repo: Repository;

  /* queryParams is used to change the queryParams without refreshing the page
   * This was needed for Help Service [which sends back info according to the current router.url]
   * the param that is used is 'step' and the values are: 'basicInformation','interfaces','finish'
   */
  queryParams: Params = Object.assign({}, this.route.snapshot.queryParams);

  @ViewChild ('registerAggregator')
  registerAggregator: DatasourceCreateFormComponent;

  group: FormGroup;
  interfaceFormDesc: Description = interfaceFormDesc;
  addDatasourceInterfaces: Type<any> = DatasourceInterfaceFormComponent;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router) {}

  ngOnInit() {
    this.setQueryParam('basicInformation');
    this.showForm = true;
  }

  moveAStep(){
    if (this.showForm) {
      if (this.registerAggregator.registerDatasource()){
        this.setQueryParam('interfaces');
        this.showForm = false;
        this.showInterfaces = true;
        this.step2 = 'active';
        this.group = this.fb.group({});
      }
    } else if (this.showInterfaces) {
      this.setQueryParam('finish');
      this.showInterfaces = false;
      this.showFinish = true;
      this.step3 = 'active';
    }
  }

  moveBackAStep(){
    if (this.showInterfaces) {
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
  }

  downloadLogo() {
    window.open("../../../assets/imgs/3_0ValidatedLogo.png","_blank", "enabledstatus=0,toolbar=0,menubar=0,location=0");
  }

  setQueryParam(value: string) {
    // set param for step
    this.queryParams['step'] = value;
    this.router.navigate([], { relativeTo: this.route, queryParams: this.queryParams });
  }

}
