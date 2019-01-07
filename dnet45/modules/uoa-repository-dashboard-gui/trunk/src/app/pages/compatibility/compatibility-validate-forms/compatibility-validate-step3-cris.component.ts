import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component ({
  selector: 'compatibility-validate-step3-cris',
  templateUrl: 'compatibility-validate-step3-cris.component.html'
})

export class CompatibilityValidateStep3CrisComponent implements OnInit {

  entitiesList: string[] = [];
  selectedAllEntities: boolean;

  group: FormGroup;

  @Output() emitObject: EventEmitter<any> = new EventEmitter();

  constructor(private fb: FormBuilder) {}

  ngOnInit () {
    this.selectedAllEntities = true;
    this.getEntitiesList();

    if (this.entitiesList && this.entitiesList.length) {
      this.group = this.fb.group({
        entities: this.fb.array([this.initEntities()]),
        refIntegrity: ''
      });
      this.setEntitiesControls();
    }
  }

  getEntitiesList() {
    this.entitiesList = ['Funding','Organisation','Person','Project','Publication','Product','Service'];
  }

  initEntities() {
    return this.fb.group({
      entity : [true]
    });
  }

  /* inputs the entities List into the FormArray */
  setEntitiesControls() {
    let entities = <FormArray>this.group.controls['entities'];
    for ( let i = 0; i<this.entitiesList.length-1; i++ ) {
      entities.push(this.initEntities());
    }
  }

  /* selects/deselects all entities */
  toggleSelectAllContentRules() {
    let entities = <FormArray>this.group.controls['entities'];
    if (this.selectedAllEntities) {
      this.selectedAllEntities = false;
      entities.controls.map(x => x.get('entity').setValue(false));
    } else {
      this.selectedAllEntities = true;
      entities.controls.map(x => x.get('entity').setValue(true));
    }
  }

  onToggleCheckEntity(event:any) {
    if ( !event.target.checked ) {
      this.selectedAllEntities = false;
    }
  }

  saveChanges() {
    let emitted: any[] = [];
    let chosenEntities: string[] = [];
    console.log(`saving the selected entities`);
    let entities = <FormArray>this.group.controls['entities'];
    for (let i=0; i<this.entitiesList.length; i++ ) {
      if (entities.at(i).get('entity').value) {
        chosenEntities.push(this.entitiesList[i]);
      }
    }
    emitted.push(chosenEntities);
    if (this.group.get('refIntegrity').value){
      emitted.push(true);
    } else {
      emitted.push(false);
    }
    this.emitObject.emit(emitted);
  }
}
