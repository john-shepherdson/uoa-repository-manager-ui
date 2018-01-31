import { Component, Input, OnInit } from '@angular/core';
import { Rule, RuleSet } from '../../../domain/typeScriptClasses';
import { FormControl } from '@angular/forms';

@Component ({
  selector: 'compatibility-validate-step2',
  templateUrl: 'compatibility-validate-step2.component.html'
})

export class CompatibilityValidateStep2Component implements OnInit {

  showRules: boolean;
  currentContentRules: Rule[] = [];
  currentUsageRules: Rule[] = [];


  @Input() ruleSets: RuleSet[];

  constructor() {}

  ngOnInit() {
    this.showRules = false;
    if ( this.ruleSets.length ) {
      this.getCurrentRuleSets(0);
    }
  }

  getCurrentRuleSets(index: number){
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

  toggleSelectAllContentRules() {}

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
