import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RepositoryService } from '../../services/repository.service';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog.component';

@Component ({
  selector: 'metrics-enable',
  templateUrl: 'metrics-enable.component.html'
})

export class MetricsEnableComponent implements OnInit {
  @Input() id: string;

  modalTitle = "Confirmation";
  modalButton = "Yes, enable it";
  isModalShown: boolean;

  @ViewChild('confirmEnablingModal')
  public confirmEnablingModal: ConfirmationDialogComponent;


  constructor(
    private route: ActivatedRoute,
    private repoService: RepositoryService
  ) {}

  ngOnInit() {
    this.getId();
    this.isModalShown = false;
  }

  getId(): void {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  confirmEnabling() {
    this.confirmEnablingModal.showModal();
  }

  confirmedEnabling(){
    console.log('enabled repo');
  }
}
