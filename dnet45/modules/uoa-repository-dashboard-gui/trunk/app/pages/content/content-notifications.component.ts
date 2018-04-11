import {Component, OnInit} from "@angular/core";
import { SimpleSubscriptionDesc, Subscription } from '../../domain/typeScriptClasses';
import { AuthenticationService } from '../../services/authentication.service';
import { BrokerService } from '../../services/broker.service';
import {
  deletingSubscription, deletingSubscriptionError, deletingSubscriptionSuccess, loadingSubscriptions, noServiceMessage,
  noSubscriptionsFound
} from '../../domain/shared-messages';

@Component ({
  selector: 'app-content-notifications',
  templateUrl: 'content-notifications.component.html'
})

export class ContentNotificationsComponent implements OnInit {
  errorMessage: string;
  successMessage: string;
  loadingMessage: string;
  noSubscriptions: string;

  subscrOfUser: Map<string,SimpleSubscriptionDesc[]> = new Map<string,SimpleSubscriptionDesc[]>();
  subKeys: string[] = [];

  constructor(private authService: AuthenticationService,
              private brokerService: BrokerService) {}

  ngOnInit() {
    this.getSubscriptions();
  }

  getSubscriptions() {
    this.loadingMessage = loadingSubscriptions;
    this.brokerService.getSimpleSubscriptionsOfUser(this.authService.getUserEmail()).subscribe(
      subscrs => this.subscrOfUser = subscrs,
      error => {
        console.log(`getSimpleSubscriptions returned error`);
        console.log(error);
        this.loadingMessage = '';
        this.errorMessage = noServiceMessage;
      },
      () => {
        this.loadingMessage = '';
        for (let key in this.subscrOfUser) {
          this.subKeys.push(key);
          console.log(key);
        }
        if (!this.subKeys.length) {
          this.noSubscriptions = noSubscriptionsFound;
        }
      }
    );
  }

  deleteSubscription(key: string) {
    this.loadingMessage = deletingSubscription;
    this.successMessage = '';
    this.errorMessage = '';
    this.brokerService.unsubscribe(key).subscribe(
      response => console.log(`unsubscribe responded with ${response}`),
      error => {
        console.log(error);
        this.loadingMessage = '';
        this.errorMessage = deletingSubscriptionError;
      },
      () => {
        this.loadingMessage = '';
        this.successMessage = deletingSubscriptionSuccess;
      }

    );
  }

}
