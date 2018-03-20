/**
 * Created by stefanos on 15/5/2017.
 */
import { FormArray, FormGroup } from "@angular/forms";
import { Component, ComponentFactoryResolver, Injector, Input, Type, ViewChild, ViewContainerRef } from "@angular/core";
import { MyFormDirective } from "./my-form.directive";
import { MyGroup } from "./my-group.interface";
import { MyWrapper } from "./my-wrapper.interface";
import { Description } from '../../../domain/oa-description';
import { Subject } from "rxjs/Subject";
import {ConfirmationDialogComponent} from "../confirmation-dialog.component";


@Component({
  selector : 'form-repeat',
  template : `
    <div [formGroup]="parentGroup" class="interfacesForm uk-margin uk-grid-match uk-child-width-1-1 uk-child-width-1-2@m uk-grid-small uk-grid uk-scrollspy-inview uk-animation-fade">
      <!--<div formArrayName="{{name}}">-->
      <ng-template my-form></ng-template>
      <!--</div>-->
      <div class="el-item uk-card uk-card-default uk-card-body uk-scrollspy-inview uk-animation-fade">
        <div class="interface-box new" style="text-align: center">
          <a class="add-new-element add-new-group" (click)="push()"><i class="fa fa-plus-square-o" aria-hidden="true"></i>
            <span class="info">Add New {{ description.label }}</span></a>
        </div>
      </div>
    </div>
  `

})
export class MyArray extends MyGroup {

  @Input() public component : Type<MyGroup>;

  @Input() public wrapper : Type<MyWrapper> = MyArrayWrapper;

  @Input() public initEmpty : boolean = false;

  @ViewChild(MyFormDirective) protected formComponents: MyFormDirective;

  protected _cfr : ComponentFactoryResolver;

  protected viewContainerRef : ViewContainerRef;

  arrayData_ : Subject<any>[] = [];

  push() {
    this.createView();
  }

  constructor(injector : Injector) {
    super(injector);
    this._cfr = injector.get(ComponentFactoryResolver);
  }

  protected createView() : void {
    let componentFactory = this._cfr.resolveComponentFactory(this.component);
    let wrapperFactory = this._cfr.resolveComponentFactory(this.wrapper);
    let wrapperView = wrapperFactory.create(this.viewContainerRef.injector);
    let componentView = componentFactory.create(this.viewContainerRef.injector);

    (<MyGroup>componentView.instance).index = this.viewContainerRef.length;
    (<MyGroup>componentView.instance).required = this.required;
    (<MyGroup>componentView.instance).data = this.data;
    (<MyGroup>componentView.instance).otherData = this.otherData;
    this.arrayData_.push((<MyGroup>componentView.instance).patchData);
    (<MyGroup>componentView.instance).description = this.description;
    let arrayGroup = (<MyGroup>componentView.instance).generate();
    (<MyGroup>componentView.instance).parentGroup = arrayGroup as FormGroup;
    (<MyWrapper>wrapperView.instance).component = componentView.hostView;
    (<MyWrapper>wrapperView.instance).viewRef = wrapperView.hostView;
    (<MyWrapper>wrapperView.instance).description = this.description;

    (<MyWrapper>wrapperView.instance).first = this.viewContainerRef.length == 0;
    (<MyWrapper>wrapperView.instance).deleteNotifier.subscribe($event => {
      let index = this.viewContainerRef.indexOf($event);
      console.log(index);
      if( this.viewContainerRef.length == 1 && this.description.mandatory==true) {
        console.log(this.viewContainerRef.get(0));
        ((this.parentGroup as FormArray).controls[this.name].at(0).corpus((<MyGroup>componentView.instance).generate().value));
      } else {
        (<MyGroup>componentView.instance).toBeDeleted = true;
        this.remove(index);
        (this.parentGroup as FormArray).controls[this.name].removeAt(index-1);
        this.arrayData_.splice(index-1,1);
      }
    });

    ((this.parentGroup as FormArray).controls[this.name]).push(arrayGroup);

    this.viewContainerRef.insert(wrapperView.hostView);
    console.log("ADDED NEW GROUP IN CREATEVIEW");
  }

  remove(i : number) : void {
    this.viewContainerRef.remove(i);
  }

  ngOnInit(): void {
    // super.ngOnInit();
    this.viewContainerRef = this.formComponents.viewContainerRef;
    (<FormGroup>this.parentGroup).addControl(<string>this.name, this._fb.array([]));
/*    (<FormGroup>this.parentGroup).addControl(<string>this.name, this._fb.array([]));
    !this.initEmpty && this.createView();
    this.parentGroup.get(this.name as string).patchValue = this.patchValue();*/
    if (this.data && this.data.length) {
      for (let i=0; i<this.data.length; i++ ) {
        !this.initEmpty && this.createView();
        this.parentGroup.get(this.name as string).patchValue = this.patchValue();
      }
    } else {
      !this.initEmpty && this.createView();
      this.parentGroup.get(this.name as string).patchValue = this.patchValue();
    }

  }

  get valid() {
    return this.parentGroup.valid;//true;//this.registerGroup_.valid;
  }


  protected patchValue() {
    let self = this;
    return (value: {[key: string]: any}, {onlySelf, emitEvent}: {onlySelf?: boolean, emitEvent?: boolean} = {}) => {
      for (let i = (<FormArray>self.parentGroup.get(this.name as string)).length; i < Object.keys(value).length; i++) {
        self.createView();
        console.log("ADDED NEW GROUP");
      }
      for (let i = 0; i < Object.keys(value).length; i++) {
        self.arrayData_[i].next(value[i]);
      }
    };
  }
}

@Component({
  selector : 'form-repeat-inline',
  template : `
    <form-inline [description]="description" [valid]="valid">
      <ng-template my-form></ng-template>
      <a class="add-new-element" (click)="push()">
        <i class="fa fa-plus" aria-hidden="true"></i> Add another
      </a>
    </form-inline>
  `

})
export class MyArrayInline extends MyArray {
  @Input()
  public wrapper : Type<MyWrapper> = MyInlineArrayWrapper;

  @Input()
  public description : Description;
}


@Component({
  selector : 'form-repeat-wrapper',
  template : `
    <div class="el-item uk-card uk-card-default uk-card-body uk-scrollspy-inview uk-animation-fade">
      <div class="interfaceActionsPanel" style="margin-left: 5px;">
        <a (click)="confirmRemoveInterface()"><i class="fa fa-remove fa-lg"></i></a>
      </div>
      <ng-template my-form></ng-template>
    </div>


    <confirmation-dialog #confirmDelete [title]="'Delete Interface'" [isModalShown]="isModalShown"
                         [confirmActionButton]="'Yes, delete it'" (emitObject)="confirmedRemove($event)">
      Are you sure you want to delete this interface?
    </confirmation-dialog>
  `

})
export class MyArrayWrapper extends MyWrapper{

  isModalShown: boolean = false;

  @ViewChild('confirmDelete')
  public confirmDelete: ConfirmationDialogComponent;

  confirmRemoveInterface(){
    this.confirmDelete.showModal();
  }

  confirmedRemove(){
    this.remove();
  }
}

@Component({
  selector : 'form-inline-repeat-wrapper',
  template : `
    <div class="uk-grid uk-margin">
      <div class="uk-width-5-6">
        <ng-template my-form></ng-template>
      </div>
      <a *ngIf="canDelete" class="remove-element uk-width-1-6" (click)="remove()"><i
        class="fa fa-times" aria-hidden="true"></i></a>
    </div>
  `

})
export class MyInlineArrayWrapper extends MyWrapper {
}
