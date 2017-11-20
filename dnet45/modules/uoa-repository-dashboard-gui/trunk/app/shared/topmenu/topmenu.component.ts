/**
 * Created by stefania on 7/5/16.
 */

import {Component, ViewEncapsulation} from "@angular/core";

@Component({
  selector: 'top-menu',
  templateUrl: './topmenu.component.html',
  encapsulation: ViewEncapsulation.None
})

export class TopMenuComponent {
  isLoggedIn: boolean;

  constructor() {
    this.isLoggedIn = true;
  }

  onClick(id: string) {
    var el: HTMLElement = document.getElementById(id);
    el.classList.remove('uk-open');
  }

  logintoggle(){
    if( this.isLoggedIn ){
      this.isLoggedIn = false;
    } else {
      this.isLoggedIn = true;
    }
  }


}
