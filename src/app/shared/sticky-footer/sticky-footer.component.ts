import { Component } from "@angular/core";

@Component({
  selector: 'app-sticky-footer',
  templateUrl: './sticky-footer.component.html',
  standalone: true,
  styles: [`
    :host {
      display: block;
      position: sticky;
      bottom: 0;
      background-color: transparent;
    } 
  `]
})
export class StickyFooterComponent {

}