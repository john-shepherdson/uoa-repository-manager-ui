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
      this.group = this.fb.group({
        ruleSet: ['', Validators.required],
        contentRules: this.fb.array([this.initRules()]),
        usageRules: this.fb.array([this.initRules()])
      });
      this.group.get('ruleSet').setValue(this.ruleSets[0].id);
      this.getCurrentRuleSets();
      this.getRulesLists();
    }
  }

  /* creates a control of the Rules FormArray */
  initRules() {
    return this.fb.group({
      rule : [true]
    })
  }

  /* returns Rules for selected RuleSet */
  getCurrentRuleSets () {
    console.log(this.group.get('ruleSet').value);
    let id = this.group.get('ruleSet').value;
    let index: number;
    this.currentContentRules = [];
    this.currentUsageRules = [];
    for (let i=0; i< this.ruleSets.length; i++ ) {
      if (this.ruleSets[i].id == id) {
        index = i;
        break;
      }
    }
    this.currentContentRules = this.ruleSets[index].contentRules;
    this.currentUsageRules = this.ruleSets[index].usageRules;
    console.log(`contentRules length: ${this.currentContentRules.length}`);
    console.log(`usageRules length: ${this.currentUsageRules.length}`);
  }

  /* inputs the Rule Lists into the FormArrays */
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

  /* refreshes the Rule Lists according to the selected RuleSet and reinitializes the form controls */
  refreshLists(){
    this.removeRulesControls();
    this.getCurrentRuleSets();
    this.getRulesLists();
  }

  /* removes form controls in order to reinitialize contentRules formArrays */
  removeRulesControls() {
    let contentRules = <FormArray>this.group.controls['contentRules'];
//    contentRules.reset();
    contentRules.controls = [];
    contentRules.push(this.initRules());

    let usageRules = <FormArray>this.group.controls['usageRules'];
//    usageRules.reset();
    usageRules.controls = [];
    usageRules.push(this.initRules());
  }

  /* selects/deselects all content rules */
  toggleSelectAllContentRules() {
    let contentRules = <FormArray>this.group.controls['contentRules'];
    if (this.selectedAllContentRules) {
      this.selectedAllContentRules = false;
      contentRules.controls.map(x => x.get('rule').setValue(false));
    } else {
      this.selectedAllContentRules = true;
      contentRules.controls.map(x => x.get('rule').setValue(true));
    }
  }

  /* selects/deselects all usage rules */
  toggleSelectAllUsageRules() {
    let usageRules = <FormArray>this.group.controls['usageRules'];
    if (this.selectedAllUsageRules) {
      this.selectedAllUsageRules = false;
      usageRules.controls.map(x => x.get('rule').setValue(false))
    } else {
      this.selectedAllUsageRules = true;
      usageRules.controls.map(x => x.get('rule').setValue(true))
    }

  }

  toggleShowRules() {
    if (this.showRules) {
      this.showRules = false;
    } else {
      this.showRules = true;
    }
  }

  saveChanges() {
    let index: number;

    for (let i=0; i< this.ruleSets.length; i++ ) {
      if (this.ruleSets[i].id == this.group.get('ruleSet').value) {
        index = i;
        break;
      }
    }
    console.log(`selected ruleSet: ${this.ruleSets[index].id}: ${this.ruleSets[index].name}`);
    let contentRules = <FormArray>this.group.controls['contentRules'];
    console.log('selected contentRules:');
    for (let i=0; i< this.ruleSets[index].contentRules.length; i++ ) {
      if (contentRules.at(i).get('rule').value) {
        console.log(`${i},\t${this.ruleSets[index].contentRules[i].id}:\t${this.ruleSets[index].contentRules[i].name}`);
      }
    }
    console.log('----------------------------');
    let usageRules = <FormArray>this.group.controls['usageRules'];
    console.log('selected usageRules:');
    for (let i=0; i< this.ruleSets[index].usageRules.length; i++ ) {
      if (usageRules.at(i).get('rule').value) {
        console.log(`${i},\t${this.ruleSets[index].usageRules[i].id}:\t${this.ruleSets[index].usageRules[i].name}`);
      }
    }

  }

}
