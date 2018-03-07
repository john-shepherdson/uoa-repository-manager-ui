/**
 * Created by stefanos on 15/5/2017.
 */
import { FormGroup } from "@angular/forms";
import { Component, ComponentFactoryResolver, Injector, Input, Type, ViewChild, ViewContainerRef } from "@angular/core";
import { MyFormDirective } from "./my-form.directive";
import { MyGroup } from "./my-group.interface";
import { MyWrapper } from "./my-wrapper.interface";
import { Subject } from "rxjs/Subject";
import { Description } from '../../../domain/oa-description';


@Component({
  selector : 'form-choice',
  template : `
<form-inline [description]="{label : 'Choose'}" [params]="null">
    <div class="uk-margin uk-grid-small uk-child-width-auto">
        <label *ngFor="let radio of radioButton">
            <input type="radio" name="{{uniqueId}}" class="uk-radio" [checked]="radio === radioButtonSelected"
            (click)="changeType(radio)">
            {{radio}}
        </label>
    </div>
</form-inline>
<div [formGroup]="parentGroup">
    <ng-template my-form></ng-template>
</div>
`,
  styleUrls : ['']

})
export class MyChoice extends MyGroup {

  @Input() public components : MyChoiceComponents[];

  wrapper : Type<MyWrapper> = MyChoiceWrapper;

  @ViewChild(MyFormDirective) protected formComponents: MyFormDirective;

  protected _cfr : ComponentFactoryResolver;

  protected viewContainerRef : ViewContainerRef;

  arrayData_ : Subject<any>[] = [];
  wrapperViews : {[key : string] : MyChoiceWrapper} = {};

  radioButton : string[] = [];

  radioButtonSelected : string;

  registerGroup_ : FormGroup;

  uniqueId : string = Math.random().toString(36).substring(2);

  constructor(injector : Injector) {
    super(injector);
    this._cfr = injector.get(ComponentFactoryResolver);
  }

  protected createView(component : MyChoiceComponents,index : number) : void {
    console.log(component);
    let componentFactory = this._cfr.resolveComponentFactory(component.component);
    let wrapperFactory = this._cfr.resolveComponentFactory(this.wrapper);
    let wrapperView = wrapperFactory.create(this.viewContainerRef.injector);
    let componentView = componentFactory.create(this.viewContainerRef.injector);

    (<MyGroup>componentView.instance).index = this.viewContainerRef.length;
    (<MyGroup>componentView.instance).required = this.required;
    (<MyGroup>componentView.instance).data = this.data;
    this.arrayData_.push((<MyGroup>componentView.instance).patchData);
    (<MyGroup>componentView.instance).description = component.description;
    let arrayGroup = (<MyGroup>componentView.instance).generate();

    (<MyGroup>componentView.instance).parentGroup = arrayGroup as FormGroup;
    (<MyChoiceWrapper>wrapperView.instance).component = componentView.hostView;
    (<MyChoiceWrapper>wrapperView.instance).viewRef = wrapperView.hostView;
    (<MyChoiceWrapper>wrapperView.instance).description = this.description;
    (<MyChoiceWrapper>wrapperView.instance).hidden = (index != 0);
    (<MyChoiceWrapper>wrapperView.instance).first = this.viewContainerRef.length == 0;

    let registerGroup : FormGroup = this.parentGroup as FormGroup;
    if(this.name) {
      registerGroup = this.parentGroup.get(this.name as string) as FormGroup;
    }

    this.registerGroup_.registerControl(component.name, arrayGroup);
    if(index != 0) {
      setTimeout(() => {
        console.log(component);
        registerGroup.get(component.name).disable();
      },500)
    }
    // (<FormArray>this.parentGroup.controls[this.name]).push(arrayGroup);
    this.wrapperViews[component.name] = wrapperView.instance as MyChoiceWrapper;
    this.viewContainerRef.insert(wrapperView.hostView);
  }

  ngOnInit(): void {
    // super.ngOnInit();
    this.components.forEach(c => this.radioButton.push(c.description.label));
    this.radioButtonSelected = this.radioButton[0];
    this.viewContainerRef = this.formComponents.viewContainerRef;
    //if there is no name, register with the children's control
    if(this.name) {
      (<FormGroup>this.parentGroup).addControl(this.name as string, this._fb.group({}));
      this.registerGroup_ = this.parentGroup.get(this.name as string) as FormGroup;
    } else {
      this.registerGroup_ = this.parentGroup as FormGroup;
    }
    this.components.forEach((item,index) => {
      this.createView(item,index);
    });

    this.registerGroup_.patchValue = this.patchValue();

  }

  changeType(radio : string) {
    let newSelected : string  = this.components[this.radioButton.indexOf(radio)].name;
    let currentSelected : string  = this.components[this.radioButton.indexOf(this.radioButtonSelected)].name;
    (this.registerGroup_.get(currentSelected) as FormGroup).disable();
    (this.registerGroup_.get(newSelected) as FormGroup).enable();
    this.wrapperViews[currentSelected].hidden = true;
    this.wrapperViews[newSelected].hidden = false;
    this.radioButtonSelected = radio;
  }

  protected patchValue() {
    let self = this;
    return (value: {[key: string]: any}, {onlySelf, emitEvent}: {onlySelf?: boolean, emitEvent?: boolean} = {}) => {
      Object.keys(value).forEach(v => {
        if (v != null) {
          let component = self.components.find(component => component.name == v);
          self.changeType(component.description.label);
          self.registerGroup_.get(v).patchValue(value[v]);
          console.log(value[v]);
        }
      });
    };
  }
}

@Component({
  selector : 'form-choice-wrapper',
  template : `
<div class="uk-grid uk-margin" [hidden]="hidden">
    <div class="uk-width-5-6">
        <ng-template my-form></ng-template>
    </div>
</div>
`,
  styleUrls : ['']

})
export class MyChoiceWrapper extends MyWrapper {
  @Input()
  public hidden = false;
}

export class MyChoiceComponents {
  public component : Type<MyGroup>;
  public name : string;
  public description : Description;

  constructor(name : string , component : Type<MyGroup>,description : Description) {
    this.component = component;
    this.name = name;
    this.description = description;

  }
}
