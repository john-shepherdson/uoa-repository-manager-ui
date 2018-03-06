/**
 * Created by stefania on 7/17/17.
 */
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { HelpContentService } from "../../services/help-content.service";
import { Content, PageContent } from "../../domain/page-content";

@Component({
  selector: 'help-content',
  template: `
    <ng-template [ngIf]="contents && contents.length>0">
      <ng-template ngFor let-content [ngForOf]="contents">
        <div [innerHTML]="content.content" class="uk-margin-medium-bottom"></div>
      </ng-template>
    </ng-template>
  `,
})

export class HelpContentComponent implements OnInit {

  @Input('position')
  position: string;

  contents: Content[];
  errorMessage: string = null;

  constructor(private _helpContentService: HelpContentService, private route: ActivatedRoute,private router: Router) {
  }

  ngOnInit() {

    this.errorMessage = null;

    this.contents = [{
      _id: 'contId',
      page: 'register',
      placement: this.position,
      order: 1,
      content: `
          <h3>Info / Help</h3>
          <p>
            The OpenAIRE services provide you with an easy way to register your content provider, literature or data repository, OA Journal into the OpenAIRE network. Please join!
          </p>
          <p>
            1) Make your repository, CRIS or journal OpenAIRE compatible by implementing the OpenAIRE
            <a href="https://guidelines.openaire.eu/en/latest/" target="_blank">Guidelines</a>
            .
          </p>
          <p>
            2) After you have made some progress in implementing the guidelines you should run a Compatibility test using the validator tool.
          </p>
          <p>
            3) Register your literature repository in OpenDOAR or your data repositoriy in Re3Data (this step does not apply for journals or CRIS).
          </p>
      `,
      isActive: true
    }];
/*    this._helpContentService.getActivePageContent(this.router.url).subscribe(
      pageContent => this.shiftThroughContent(pageContent),
      error => this.handleError(<any>error));*/
  }

  shiftThroughContent(pageContent: PageContent) {
    this.contents = pageContent.content[this.position];
  }

  isPresent() {
    return (this.contents && this.contents.length>0);
  }

  handleError(error) {
    this.errorMessage = 'System error retrieving page content (Server responded: ' + error + ')';
  }
}

@Component({
  selector: 'aside-help-content',
  template: `
    <ng-template [ngIf]="contents && contents.length>0">
      <ng-template ngFor let-content [ngForOf]="contents">
        <div [innerHTML]="content.content" class="uk-card uk-card-body uk-card-default sidemenu uk-margin-bottom"></div>
      </ng-template>
    </ng-template>
  `,
})
export class AsideHelpContentComponent extends HelpContentComponent {

}
