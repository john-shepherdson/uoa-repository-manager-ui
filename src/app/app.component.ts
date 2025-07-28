import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, ActivationStart, NavigationEnd, Router} from '@angular/router';
import {AuthenticationService} from './services/authentication.service';
import {environment} from '../environments/environment';
import {MatomoTracker} from 'ngx-matomo';
import {ConfirmationDialogComponent} from './shared/reusablecomponents/confirmation-dialog.component';
import {RepositoryService} from './services/repository.service';
import {RepositorySnippet} from './domain/typeScriptClasses';
import {UntypedFormBuilder, UntypedFormGroup, UntypedFormArray} from '@angular/forms';

@Component({
  selector: 'oa-repo-manager',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  reposOfUser: RepositorySnippet[] = [];
  modalTitle = 'Terms of Use';
  isModalShown: boolean;
  modalButton = 'OK';

  hasSidebar = false;
  hasAdminMenu = false;
  hover = true;


  agreementForm = this.fb.group({
    terms: this.fb.array([])
  });

  consentTermsOfUseDate: Date;

  @ViewChild('subscribeToTermsModal')
  public subscribeToTermsModal: ConfirmationDialogComponent;

  open: boolean = true;

  constructor(private router: Router, private authService: AuthenticationService, private matomoTracker: MatomoTracker,
              private repositoryService: RepositoryService, private fb: UntypedFormBuilder, public route: ActivatedRoute) {

    // console.log('21-06-2019. Fixed matomo to log userIds?');

    /*disabling console.log in production*/
    if ( environment.production === true ) {
      console.log = function () {};
    }

    // URL of the SPA to redirect the user to after login
    // this.authService.redirectUrl = "/dashboard";

    if (window.location.pathname.includes('/compatibility/browseHistory/')) {
      this.authService.redirectUrl = window.location.pathname;
      console.log('redirectUrl', this.authService.redirectUrl);
    }

    this.authService.tryLogin();
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      // if (evt instanceof NavigationEnd) {
      //   console.log(evt);
      //   this.findChildRouteData();
      // }
      // if (evt instanceof ActivationStart) {
      //   console.log(evt);
      //   // const data = evt.snapshot.data;
      //   // if (data['hasSidebar'] !== undefined &&
      //   //   data['hasSidebar'] === false) {
      //   //   this.setHasSidebar(false);
      //   // } else {
      //   //   this.setHasSidebar(true);
      //   // }
      //
      // }
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      if (this.authService.isLoggedIn_) {
        this.matomoTracker.setUserId(this.authService.getUserEmail());
      }
      window.scrollTo(0, 0);
    });

    this.authService.isLoggedIn.subscribe(
      logged => {if (logged) {this.getReposOfUser(); }},
      error => {console.log(error); }
    );

  }

  getReposOfUser(): void {
      this.repositoryService.getRepositoriesSnippetsOfUser().subscribe(
        repos => {
          this.reposOfUser = repos;
        },
        error => {
          console.log(error);
        },
        () => {
          // console.log(this.reposOfUser);
          if (this.agreementForm.get('terms').value.length === 0) {
            this.reposOfUser.forEach(repo => {
              if (repo.consentTermsOfUse === null || repo.fullTextDownload === null) {
                this.addTerm(repo.officialname, repo.id, repo.consentTermsOfUse);
                this.isModalShown = true;
              }
            });
          }
        }
      );
  }

  updateTerms() {
    this.repositoryService.updateRepositoriesTerms(this.agreementForm.value.terms).subscribe(
      res => {},
      err => {console.log(err); }
    );
  }

  addTerm(name: string, id: string, consent: boolean) {
    this.terms.push(this.newTerm(name, id, consent));
  }

  newTerm(name: string, id: string, consent: boolean): UntypedFormGroup {
    return this.fb.group({
      id: [id],
      name: [name],
      // accept: [(consent ? consent : true)]
      consentTermsOfUse: false,
      fullTextDownload: false
    });
  }

  get terms() {
    return this.agreementForm.get('terms') as UntypedFormArray;
  }

  isLandingRoute() {
    // console.log('Is home route? Route is: ' + this.router.url);
    return (this.router.url === '/') || (this.router.url === '/home') || (this.router.url === '/about');
  }

  public toggleOpen(event: MouseEvent) {
    event.preventDefault();
    this.open = !this.open;
  }

  // ngAfterContentInit() {
  //
  //   // this.loadScript('assets/js/common.js');
  //   // this.loadScript('assets/js/uikit_custom.js');
  //   // this.loadScript('assets/js/altair_admin_common.js');
  //   this.loadScript('assets/js/altair_admin_common.min.js');
  //
  //   // setTimeout( () => {
  //   //   // this.loadScript('assets/js/common.js');
  //   //   // this.loadScript('assets/js/uikit_custom.js');
  //   //   this.loadScript('assets/js/altair_admin_common.min.js');
  //   // }, 2000);
  //
  //   // $.getScript('assets/js/altair_admin_common.min.js');
  //
  //
  //
  //   // // Load the script
  //   // // var self = this;
  //   //
  //   // var script = <HTMLScriptElement>document.createElement("SCRIPT");
  //   // script.src = 'assets/js/altair_admin_common.min.js';
  //   // script.type = 'text/javascript';
  //   // // self.script = <HTMLScriptElement>document.createElement("SCRIPT");
  //   // // self.script.src = '../Content/js/settings.js';
  //   // // self.script.type = 'text/javascript';
  //   // document.getElementsByTagName("head")[0].appendChild(script);
  // }
  //
  // public loadScript(url) {
  //   console.log('preparing to load...')
  //   let node = document.createElement('script');
  //   node.src = url;
  //   node.type = 'text/javascript';
  //   document.getElementsByTagName('head')[0].appendChild(node);
  // }

}
