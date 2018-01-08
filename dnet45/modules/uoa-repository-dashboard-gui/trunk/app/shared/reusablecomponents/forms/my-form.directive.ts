/**
 * Created by stefanos on 15/5/2017.
 */
import { AfterViewInit, Directive, TemplateRef, ViewContainerRef } from "@angular/core";

@Directive({
  selector: '[my-form]',
})
export class MyFormDirective implements AfterViewInit {


  constructor(public viewContainerRef: ViewContainerRef, public templateRef : TemplateRef<any>) {}

  ngAfterViewInit(): void {
    this.viewContainerRef.createEmbeddedView(this.templateRef);
  }
}
