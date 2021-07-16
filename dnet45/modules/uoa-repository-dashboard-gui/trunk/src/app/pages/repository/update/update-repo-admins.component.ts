import {Component, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import { Repository, User } from '../../../domain/typeScriptClasses';
import { RepositoryService } from '../../../services/repository.service';
import {loadingRepoMessage} from '../../../domain/shared-messages';
import {ConfirmationDialogComponent} from '../../../shared/reusablecomponents/confirmation-dialog.component';
import {FormControl} from '@angular/forms';

declare var UIkit: any;

@Component ({
  selector: 'app-update-repo-admins',
  templateUrl: 'update-repo-admins.component.html',
})

export class UpdateRepoAdminsComponent implements OnChanges {

  @Input() repo: Repository;

  loadingMessage: string;
  errorMessage: string;

  repoAdmins: User[];

  selectedAdminForDelete: User;

  isDeleteModalShown: boolean;
  @ViewChild('deleteRepositoryAdminModal', { static: true })
  public deleteRepositoryAdminModal: ConfirmationDialogComponent;

  isAddModalShown: boolean;
  @ViewChild('addRepositoryAdminModal', { static: true })
  public addRepositoryAdminModal: ConfirmationDialogComponent;

  modalErrorMessage: string;
  modalLoadingMessage: string;

  emailControl = new FormControl();

  constructor (private repoService: RepositoryService) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.getRepositoryAdmins();
  }

  getRepositoryAdmins() {

    this.loadingMessage = 'Retrieving repository\'s admins...';

    this.repoService.getRepositoryAdmins(this.repo.id).subscribe(
      users => {
        this.repoAdmins = users;
      },
      error => {
        console.log(error);
        this.loadingMessage = '';
        this.errorMessage = 'Error retrieving the repository\'s admins';
      },
      () => {
        this.loadingMessage = '';
      }
    );
  }

  showDeletionModal(repoAdmin: User) {

    this.errorMessage = '';
    this.loadingMessage = '';

    this.selectedAdminForDelete = repoAdmin;
    if (this.selectedAdminForDelete) {
      this.deleteRepositoryAdminModal.showModal();
      // UIkit.modal('#deletionModal').show();
    }
  }

  closeDeletionModal() {
    this.selectedAdminForDelete = null;
    this.deleteRepositoryAdminModal.hideModal();
    // UIkit.modal('#deletionModal').hide();
  }

  deleteRepoAdmin(event: any) {
    console.log('deleting: ', this.selectedAdminForDelete.email);

    // this.deleteRepositoryAdminModal.hideModal();
    this.modalLoadingMessage = 'Deleting admin...';

    this.repoService.deleteRepositoryAdmin(this.repo.id, this.selectedAdminForDelete.email).subscribe(
      res => {
        this.selectedAdminForDelete = null;
        this.deleteRepositoryAdminModal.hideModal();
        this.getRepositoryAdmins();
      },
      error => {
        console.log('Error deleting repository\'s admins', error);
        this.modalLoadingMessage = '';
        this.modalErrorMessage = 'Error deleting admin';
      },
      () => {
        this.modalLoadingMessage = '';
        // this.deleteRepositoryAdminModal.hideModal();
      }
    );

  }

  showAddRepoAdminModal() {

    this.emailControl.reset();

    this.modalErrorMessage = '';
    this.modalLoadingMessage = '';

    this.addRepositoryAdminModal.showModal();
    // UIkit.modal('#addAdminModal').show();
  }

  addRepositoryAdmin() {

    this.modalLoadingMessage = 'Adding repository admin';

    console.log('Adding repository admin..', this.emailControl.value);

    this.repoService.addRepositoryAdmin(this.repo.id, this.emailControl.value).subscribe(
      res => {
        this.addRepositoryAdminModal.hideModal();
        this.getRepositoryAdmins();
      }, error => {
        console.log('Error adding repository admin', error);
        this.modalLoadingMessage = '';
        if(error.status === 404) {
          this.modalErrorMessage = 'This email address is not associated with an OpenAIRE user account.\n' +
            'Please make sure the user has an OpenAIRE account and then try again.';
        } else {
          this.modalErrorMessage = 'Error deleting the user admin, please try again. If the error persists, ' +
            'please contact helpdesk@openaire.eu';
        }
      },
      () => {
        this.modalLoadingMessage = '';
      }
    );

    // UIkit.modal('#addAdminModal').hide();
  }

}
