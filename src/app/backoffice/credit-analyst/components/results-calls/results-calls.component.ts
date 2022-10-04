import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BoardsService } from '@shared/services/http/boards.services';
import { ModalService } from '@shared/services/modal/modal.service';
import { Router } from '@angular/router';
import { CatalogService } from '@shared/services/http/catalog.service';

@Component({
  selector: 'wnbo-results-calls',
  templateUrl: './results-calls.component.html',
  styleUrls: ['./results-calls.component.scss']
})
export class ResultsCallsComponent implements OnInit {
  @Input() requestId: string;
  @Input() referencesData: any;
  @Input() isResumeView: boolean;
  @Input() showHistory: boolean;
  @Output() approveEmitter = new EventEmitter<number>();
  @Output() hideEmitter = new EventEmitter<number>();

  public aditionalComment = '';
  public callsResults: any;
  public appliCantResults: any;
  public workResults: any = {};
  public familyResults: any = {};
  public knownResults: any = {};
  public statusObj: any = {};
  public isSaved = false;


  constructor(
    private boardSvc: BoardsService,
    private modalSvc: ModalService,
    private router: Router,
    private catalogSvc: CatalogService
  ) { }

  ngOnInit() {
    this.getResults();
    this.getStatusOpts();
  }

  async getResults() {
    try {
      var loader = this.modalSvc.loader();
      const resp = await this.boardSvc.requestCallsResult(this.boardSvc.getProspectEmail);
      this.callsResults = resp.data;
      if(resp.data.validation.data) {
        this.callsResults.validation.data = this.boardSvc.getLabels(resp.data.validation.data);
      }
      if(resp.data.references.family.data) {
        this.callsResults.references.family.data = this.boardSvc.getLabels(resp.data.references.family.data);
      }
      if(resp.data.references.known.data) {
        this.callsResults.references.known.data = this.boardSvc.getLabels(resp.data.references.known.data);
      }
      if(resp.data.references.work.data) {
        this.callsResults.references.work.data = this.boardSvc.getLabels(resp.data.references.work.data);
      }
      if(resp.data.status && ((resp.data.status == 'approved') || (resp.data.status == 'rejected'))) {
        this.isSaved = true;
          if(!this.isResumeView) {
            this.approveEmitter.emit(2);
          }
      }
      console.log(this.callsResults)
      if(loader) {loader.close();}
    } catch (error) {
      if(loader) {loader.close();}
    }
  }

  async getStatusOpts() {
    try {
      const resp = await this.catalogSvc.getStatusCallCatalog();
      resp.data.map(status => {
        this.statusObj[status.category] = status.label;
      });
    } catch (error) {}
  }

  openModalAction(opt) {
    // 2 - aprobar, 3- rechazar
    var message = 'Estás a punto de ' + ((opt == 2)? 'aprobar ' : 'rechazar ') + 'la evaluación llamadas.';
    var modal = this.modalSvc.setParams(message).continue();
    modal.afterClosed().subscribe((resp)=> {
      if(resp) {
        this.approve(opt);
      }
    })
  }

  async approve(opt) {
    try {
      var loader = this.modalSvc.loader();
      const body: any = {
        status: (opt == 2) ? 'approved' : 'rejected',
        request_id: this.requestId,
        section: 'calls',
        email_user: this.boardSvc.getProspectEmail
      };
      if(this.aditionalComment != '') {
        body.additional_comment_credit = this.aditionalComment;
      }
      const resp = await this.boardSvc.requestApproveResults(body);
      this.isSaved = true;
      loader.close();
      if((this.callsResults.validation.category == 'not_located') || ((this.callsResults.validation.category == 'applicant_answered') && (this.callsResults.validation.subcategory != 'continue_request'))) {
        this.router.navigate(['/analyst']);
      } else {
      this.approveEmitter.emit(2);
      }
    } catch (error) {
      loader.close();
    }
  }

}
