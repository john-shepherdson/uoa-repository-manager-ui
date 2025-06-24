import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { environment } from '../environments/environment';
import { MatomoTracker } from 'ngx-matomo';
import { ConfirmationDialogComponent } from './shared/reusablecomponents/confirmation-dialog.component';
import { RepositoryService } from './services/repository.service';
import { RepositorySnippet } from './domain/typeScriptClasses';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { CommunityContextService } from './services/communityContext.service';
import { DynamicStylesService } from "./services/dynamicStyles.service";

@Component({
  selector: 'oa-repo-manager',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent implements OnInit, OnDestroy {
  reposOfUser: RepositorySnippet[] = [];
  modalTitle = 'Terms of Use';
  isModalShown: boolean;
  modalButton = 'OK';
  hover = true;
  agreementForm = this.fb.group({
    terms: this.fb.array([])
  });

  @ViewChild('subscribeToTermsModal')
  public subscribeToTermsModal: ConfirmationDialogComponent;


  constructor(private router: Router, private authService: AuthenticationService, private matomoTracker: MatomoTracker,
              private repositoryService: RepositoryService, private fb: UntypedFormBuilder, public route: ActivatedRoute,
              private communityService: CommunityContextService, private dynamicStyleService: DynamicStylesService) {

    /*disabling console.log in production*/
    if ( environment.production === true ) {
      console.log = function () {};
    }

    this.loadCommunityFromRoute();

    if (window.location.pathname.includes('/compatibility/browseHistory/')) {
      this.authService.redirectUrl = window.location.pathname;
      console.log('redirectUrl', this.authService.redirectUrl);
    }

    this.authService.tryLogin();
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      if (this.authService.isLoggedIn_) {
        this.matomoTracker.setUserId(this.authService.getUserEmail());
      }
      window.scrollTo(0, 0);
    });

    this.authService.isLoggedIn.subscribe(
      logged => {
        if (logged) {
          this.getReposOfUser();
        }
      },
      error => { console.log(error); }
    );

    // Subscribe to community changes to load dynamic CSS
    this.communityService.community.subscribe(
      community => {
        if (community && community.styleUrls && community.styleUrls.length > 0) {
          console.log('Loading community styles for:', community.id);
          this.dynamicStyleService.loadStyleUrls(community.styleUrls, community.id);
        }
      },
      error => {
        console.error('Error loading community styles:', error);
      }
    );

  }

  ngOnDestroy() {
    // Clean up community styles when the component is destroyed
    this.dynamicStyleService.removeAllCommunityStyles();
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

  private loadCommunityFromRoute() {
    // Extract org ID from the current URL
    const hostSegments = window.location.host.split('.');
    const communityId = hostSegments[0];

    if (hostSegments.length === 4) { // URL should be in format: <community-id>.<service>.<domain>.<tld>, e.g., 'egi.provide.openaire.eu'
      this.communityService.loadCommunity(communityId).subscribe(
        communityId => {
          console.log('Community loaded:', communityId);
        },
        error => {
          console.error('Failed to load community:', error);
          // Handle error - maybe redirect to default org
        }
      );
    } else { // If the host is not of the form <community-id>.<service>.<domain>.<tld>
      // Handle error - maybe redirect to the default org
      if (environment.production === false) {
        this.communityService.loadCommunity('egi').subscribe(
          communityId => {
            console.log('Mock community loaded:', communityId);
          },
          error => {
            console.error('Failed to load community:', error);
            // Handle error - maybe redirect to default org
          }
        );
      }
    }
  }

}
