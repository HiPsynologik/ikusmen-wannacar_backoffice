import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalService } from '@shared/services/modal/modal.service';
import { BoardsService } from '@shared/services/http/boards.services';

@Component({
  selector: 'wnbo-document-validation',
  templateUrl: './document-validation.component.html',
  styleUrls: ['./document-validation.component.scss']
})
export class DocumentValidationComponent implements OnInit {
  @Input() requestId: string;
  @Input() documentStyle: string;
  @Input() documentResult: any;
  @Input() prospectInfo: any = {};
  @Input() type: number;
  @Output() validateEmitter = new EventEmitter<any>();
  public aditionalComment = '';
  public isApproved =  false;
  constructor(
    private modalSvc: ModalService,
    private boardSvc: BoardsService
  ) { }

  ngOnInit() {
  }

  openModalAction(opt) {
    let document = ''
    switch (this.type) {
      case 0: {
        document = 'Identificación oficial';
        break;
      }
      case 1: {
        document = 'Comprobante de domicilio';
        break;
      }
      case 2: {
        document = 'Comprobantes de Ingresos';
        break;
      }
    }
    // 2 - aprobar, 3- rechazar
    var message = 'Estás a punto de ' + ((opt == 2)? 'aprobar ' : 'rechazar ') + 'la evaluación de ' + document;
    var modal = this.modalSvc.setParams(message).continue();
    modal.afterClosed().subscribe((resp)=> {
      if(resp) {
        this.approve(opt);
      }
    })
  }

  async approve(opt) {
    var loader = this.modalSvc.loader();
    for (let i = 0; i < this.documentResult.length; i++) {
      const element = this.documentResult[i];
      try {
        const body: any = {
          status: (opt == 2) ? 'approved' : 'rejected',
          request_id: this.requestId,
          section: 'documents_validation',
          email_user: this.boardSvc.getProspectEmail,
          subtype_document: this.documentResult[i].subtype
        };
        if(this.aditionalComment != '') {
          body.additional_comment_credit = this.aditionalComment;
          this.documentResult[i].additional_comment_credit = this.aditionalComment;
        }
        const resp = await this.boardSvc.requestApproveResults(body);
        this.isApproved = true;
        this.validateEmitter.emit({section:this.type,status:body.status});
        if(loader) {loader.close();}
      } catch (error) {
        if(loader) {loader.close();}
      }
      
    }
    
  }

}
