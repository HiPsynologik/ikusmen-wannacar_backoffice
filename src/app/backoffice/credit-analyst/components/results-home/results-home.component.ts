import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { ModalService } from '@shared/services/modal/modal.service';
import { BoardsService } from '@shared/services/http/boards.services';
import { UserService } from '@shared/services/http/user.service';

@Component({
  selector: 'wnbo-results-home',
  templateUrl: './results-home.component.html',
  styleUrls: ['./results-home.component.scss']
})
export class ResultsHomeComponent implements OnInit{
  @Input() requestId: string;
  @Input() failedCat: any;
  @Input() prospectInfo: any;
  @Input() isResumeView: boolean;
  @Output() approveEmitter = new EventEmitter<number>();
  @Output() hideEmitter = new EventEmitter<number>();

  public isSaved = false;
  public frontImages = [];
  public interiorImages= [];
  public aditionalComment = '';
  public validationList = [];
  public otherReason: string;
  public visitData: any = {};
  constructor(
    private modalSvc: ModalService,
    private boardSvc: BoardsService,
    private userSvc: UserService
  ) { }

  ngOnInit() {
    this.getResults();
  }
  async getResults() {
      try {
        var loader = this.modalSvc.loader();
        const resp = await this.boardSvc.requestVisitResult(this.requestId,'investigator_visit_home');
        if(resp.data.other_reason) { this.otherReason = resp.data.other_reason}
        if(resp.data.reason_failed_visit) {
          this.validationList = resp.data.reason_failed_visit;
        }
        if(resp.data.documents.length != 0) {
          this.requestDocumentImage(resp.data.documents);
        }
        this.visitData = resp.data;
        if(resp.data.status && ((resp.data.status == 'approved') || (resp.data.status == 'rejected'))) {
          this.isSaved = true;
          if(!this.isResumeView) {
            this.approveEmitter.emit(0);
          }
        }
        if(loader) {loader.close();}
      } catch (error) {
        this.hideEmitter.emit(0);
        if(loader) {loader.close();}
      }
  }


  async requestDocumentImage(documentList) {
    this.frontImages = [];
    this.interiorImages = [];
    for (let i = 0; i < documentList.length; i++) {
      try {
        const resp = await this.userSvc.getImageb64ForValidation(documentList[i].name_document);
        if(documentList[i].subtype_investigation == 'house_front') {
          this.frontImages.push({name:'', file: resp.data})
        } else {
          this.interiorImages.push({name:'', file: resp.data})
        }
      } catch (error) {}
    }
  }

  openModalAction(opt) {
    // 2 - aprobar, 3- rechazar
    var message = 'Est??s a punto de ' + ((opt == 2)? 'aprobar ' : 'rechazar ') + 'la evaluaci??n del Domicilio Actual.';
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
        section: 'investigator_visit_home',
        email_user: this.boardSvc.getProspectEmail
      };
      if(this.aditionalComment != '') {
        body.additional_comment_credit = this.aditionalComment;
      }
      const resp = await this.boardSvc.requestApproveResults(body);
      this.isSaved = true;
      this.approveEmitter.emit(0);
      loader.close();
    } catch (error) {
      loader.close();
    }
  }

  showGallery(photos) {
    this.modalSvc.setParams({images:photos, index: 0}).setPanelClass('gallery-modal').openGallery();
  }

}
