/**
 * Created by stefania on 7/17/17.
 */
import {Component, Input, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {HelpContentService} from "../../services/help-content.service";
import {Content, PageContent} from "../../domain/page-content";

@Component({
  selector: 'help-content',
  template: `
    <template [ngIf]="contents && contents.length>0">
      <template ngFor let-content [ngForOf]="contents">
        <div [innerHTML]="content.content" class="uk-margin-medium-bottom"></div>
      </template>
    </template>
  `,
})

export class HelpContentComponent implements OnInit {

  @Input('position')
  position: string;

  contents: Content[];
  errorMessage: string = null;

  constructor(private _helpContentService: HelpContentService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {

    this.errorMessage = null;

    this._helpContentService.getActivePageContent(this.router.url).subscribe(
      pageContent => this.shiftThroughContent(pageContent),
      error => this.handleError(<any>error));
  }

  shiftThroughContent(pageContent: PageContent) {
    this.contents = pageContent.content[this.position];
  }

  isPresent() {
    return (this.contents && this.contents.length > 0);
  }

  handleError(error) {
    this.errorMessage = 'System error retrieving page content (Server responded: ' + error + ')';
  }
}

@Component({
  selector: 'aside-help-content',
  template: `
    <template [ngIf]="contents && contents.length>0">
      <template ngFor let-content [ngForOf]="contents">
        <div [innerHTML]="content.content" class="uk-card uk-card-body uk-card-default sidemenu uk-margin-bottom"></div>
      </template>
    </template>
  `,
})
export class AsideHelpContentComponent extends HelpContentComponent {

}
