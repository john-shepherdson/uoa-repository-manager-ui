import { Component, Input, OnInit } from '@angular/core';
import { Rule, RuleSet } from '../../../domain/typeScriptClasses';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component ({
  selector: 'compatibility-validate-step2',
  templateUrl: 'compatibility-validate-step2.component.html'
})

export class CompatibilityValidateStep2Component implements OnInit {

  showRules: boolean;
  currentContentRules: Rule[] = [];
  currentUsageRules: Rule[] = [];
  selectedAllContentRules: boolean;
  selectedAllUsageRules: boolean;

  group: FormGroup;

  @Input() ruleSets: RuleSet[];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.showRules = false;
    this.selectedAllContentRules = true;
    this.selectedAllUsageRules = true;

    if ( this.ruleSets.length ) {
      this.getCurrentRuleSets(0);
    }
    this.group = this.fb.group({
      ruleSet : ['', Validators.required],
      contentRules : this.fb.array([this.initRules()]),
      usageRules : this.fb.array([this.initRules()])
    });
    this.getRulesLists();
  }

  getCurrentRuleSets (index: number) {
    let id = this.ruleSets[index].id;
    let current: RuleSet[] = this.ruleSets.filter(
      set => {
        if (set.id = id) {
          return set;
        }
      }
    );
    this.currentContentRules = current[index].contentRules;
    this.currentUsageRules = current[index].usageRules;
  }

  initRules() {
    return this.fb.group({
      rule : [true]
    })
  }

  getRulesLists() {
    let contentRules = <FormArray>this.group.controls['contentRules'];
    for ( let i = 0; i<this.currentContentRules.length-1; i++ ) {
      contentRules.push(this.initRules());
    }
    let usageRules = <FormArray>this.group.controls['usageRules'];
    for ( let i = 0; i<this.currentUsageRules.length-1; i++ ) {
      usageRules.push(this.initRules());
    }
  }

  toggleSelectAllContentRules() {
    console.log('trying!!!!!!!');
    let contentRules = <FormArray>this.group.controls['contentRules'];
    if (this.selectedAllContentRules) {
      this.selectedAllContentRules = false;
      contentRules.controls.map(x => x.patchValue(true));
    } else {
      this.selectedAllContentRules = true;
      contentRules.controls.map(x => x.patchValue(true));
    }

  }

  toggleSelectAllUsageRules() {}

  toggleChooseContentRule(e: any, id: number) {
    if(e.target.checked) {
      console.log(this.currentContentRules[id].name);
    }
  }

  toggleChooseUsageRule(e: any, id: number) {
    if (e.target.checked) {
      console.log(this.currentUsageRules[id].name);
    }
  }

  toggleShowRules() {
    if (this.showRules) {
      this.showRules = false;
    } else {
      this.showRules = true;
    }
  }


}
