/**
 * Created by stefanos on 19/5/2017.
 */
import { EventEmitter, Input, OnInit, Output, ViewChild, ViewRef } from '@angular/core';
import { Description } from '../../../domain/oa-description';
import { MyFormDirective } from './my-form.directive';
import { throwError } from 'rxjs';


export abstract class MyWrapper implements OnInit{

  @Input() public component: ViewRef;

  @Input() description: Description = null;

  @Input() viewRef: ViewRef;

  @Output() deleteNotifier: EventEmitter<ViewRef> = new EventEmitter();

  @ViewChild(MyFormDirective) private formComponents: MyFormDirective;

  public first = true;

  ngOnInit() {
    if (!this.formComponents) {
      console.log(this.formComponents);
      throwError('Maybe you forgot [my-form] directive in the template');
    }
    this.formComponents.viewContainerRef.insert(this.component);
  }

  public remove() {
    this.deleteNotifier.emit(this.viewRef);
  }


  public get canDelete() {
    return !((this.description.mandatory === true) && (this.first === true));
  }

}
