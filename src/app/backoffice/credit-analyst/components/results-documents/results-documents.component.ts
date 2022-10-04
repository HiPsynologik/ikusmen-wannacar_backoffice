import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ModalService } from '@shared/services/modal/modal.service';
import { BoardsService } from '@shared/services/http/boards.services';
import { CatalogService } from '@shared/services/http/catalog.service';
import { UserService } from '@shared/services/http/user.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'wnbo-results-documents',
  templateUrl: './results-documents.component.html',
  styleUrls: ['./results-documents.component.scss']
})
export class ResultsDocumentsComponent implements OnInit {
  @Input() requestId: string;
  @Input() prospectInfo: string;
  @Input() isResumeView: boolean;
  @Output() approveEmitter = new EventEmitter<number>();
  @Output() hideEmitter = new EventEmitter<number>();

  public currentStep: number = 0;
  public sectionsApproved = [false, false, false];
  public sectionStatus = {
    id: '',
    salary: '',
    address: ''
  };
  public docsCat = {
    passport: [],
    professional: [],
    ine: [],
    back: [],
    address: [],
    lastInc: [],
    anteInc: [],
    prevInc: [],
  }
  public documentSatus = {
    rejected: 'rejected',
    approved: 'approved'
  };
  public documentType = {
    id: 0,
    address: 1,
    income: 2
  };
  public idResults: any = [];
  public addressResult: any = [];
  public incomeResult: any = [];

  constructor(
    private modalSvc: ModalService,
    private boardSvc: BoardsService,
    private catalogService: CatalogService,
    private userSvc: UserService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.getDocumentsCatalog();
  }

  nextDocument(section) {
    switch (section.section) {
      case 0: {
        this.sectionStatus.id = section.status;
        break;
      }
      case 1: {
        this.sectionStatus.address = section.status;
        break;
      }
      case 2: {
        this.sectionStatus.salary = section.status;
        break;
      }
    }
    this.sectionsApproved[section.section] = true;
    this.getnextSection();
  }

  getnextSection() {
    var indexSection = this.sectionsApproved.indexOf(false);
    if (indexSection != -1) {
      setTimeout(() => {
        this.currentStep = indexSection;
      }, 100)
    } else {
      this.approveEmitter.emit(3);
    }
  }

  async getResults() {
    try {
      var loader = this.modalSvc.loader();
      const resp = await this.boardSvc.requestDocumentsResults(this.boardSvc.getProspectEmail);
      var backData: any = {};
      var frontData: any = {};
      var addressData: any = {
        subtype: 'address_proof',
        results: this.matchLabelResutls(resp.data.address_proof.answers, this.docsCat.address),
        documents: [
          { label: 'Original', name: resp.data.address_proof.user, file: '' },
          { label: 'Investigador', name: resp.data.address_proof.investigator, file: '' }
        ]
      };
      var lastData: any = {
        subtype: 'last_salary_slips',
        results: this.matchLabelResutls(resp.data.last_salary_slips.answers, this.docsCat.lastInc),
        documents: [
          { label: 'Último Original', name: resp.data.last_salary_slips.user, file: '' },
          { label: 'Último Investigador', name: resp.data.last_salary_slips.investigator, file: '' }
        ]
      };
      var prevData: any = {
        subtype: 'previus_salary_slips',
        results: this.matchLabelResutls(resp.data.previus_salary_slips.answers, this.docsCat.prevInc),
        documents: [
          { label: 'Previo Original', name: resp.data.previus_salary_slips.user, file: '' },
          { label: 'Previo Investigador', name: resp.data.previus_salary_slips.investigator, file: '' }
        ]
      };
      var anteData: any = {
        subtype: 'antepenultimate_salary_slips',
        results: this.matchLabelResutls(resp.data.antepenultimate_salary_slips.answers, this.docsCat.anteInc),
        documents: [
          { label: 'Anterior Original', name: resp.data.antepenultimate_salary_slips.user, file: '' },
          { label: 'Anterior Investigador', name: resp.data.antepenultimate_salary_slips.investigator, file: '' }
        ]
      };
      frontData.subtype = 'id_front';
      frontData.documents = [
        { label: 'Frente original', name: resp.data.id_front.user, file: '' },
        { label: 'Frente investigador', name: resp.data.id_front.investigator, file: '' }
      ];
      this.requestDocumentImage(frontData.documents);
      this.requestDocumentImage(addressData.documents);
      this.requestDocumentImage(lastData.documents);
      this.requestDocumentImage(prevData.documents);
      this.requestDocumentImage(anteData.documents);
      frontData.additional_comment = (resp.data.id_front.additional_comment) ? resp.data.id_front.additional_comment : '';
      addressData.additional_comment = (resp.data.address_proof.additional_comment) ? resp.data.address_proof.additional_comment : '';
      lastData.additional_comment = (resp.data.last_salary_slips.additional_comment) ? resp.data.last_salary_slips.additional_comment : '';
      prevData.additional_comment = (resp.data.previus_salary_slips.additional_comment) ? resp.data.previus_salary_slips.additional_comment : '';
      anteData.additional_comment = (resp.data.antepenultimate_salary_slips.additional_comment) ? resp.data.antepenultimate_salary_slips.additional_comment : '';
      if (resp.data.id_back) {
        backData.subtype = 'id_back';
        backData.results = this.matchLabelResutls(resp.data.id_back.answers, this.docsCat.back);
        backData.documents = [
          { label: 'Reverso original', name: resp.data.id_back.user, file: '' },
          { label: 'Reverso investigador', name: resp.data.id_back.investigator, file: '' }
        ];
        this.requestDocumentImage(backData.documents);
        backData.additional_comment = (resp.data.id_back.additional_comment) ? resp.data.id_back.additional_comment : '';
        frontData.results = this.matchLabelResutls(resp.data.id_front.answers, this.docsCat.ine);
      } else {
        switch (resp.data.id_front.answers.length) {
          case 5: {
            frontData.results = this.matchLabelResutls(resp.data.id_front.answers, this.docsCat.passport);
            break;
          }
          case 3: {
            frontData.results = this.matchLabelResutls(resp.data.id_front.answers, this.docsCat.professional);
            break;
          }
        }
      }
      this.addressResult.push(addressData)
      this.idResults.push(frontData);
      this.incomeResult.push(lastData);
      this.incomeResult.push(prevData);
      this.incomeResult.push(anteData);

      if (resp.data.id_back) {
        this.idResults.push(backData);
      }
      if ((resp.data.id_front.status) && (resp.data.id_front.status != 'active')) {
        this.sectionStatus.id = resp.data.id_front.status;
        this.sectionsApproved[0] = true;
        this.idResults[0].status = resp.data.id_front.status;
      }
      if ((resp.data.address_proof.status) && (resp.data.address_proof.status != 'active')) {
        this.sectionStatus.address = resp.data.address_proof.status;
        this.sectionsApproved[1] = true;
        this.addressResult[0].status = resp.data.address_proof.status;
      }
      if ((resp.data.last_salary_slips.status) && (resp.data.last_salary_slips.status != 'active')) {
        this.sectionStatus.salary = resp.data.last_salary_slips.status;
        this.sectionsApproved[2] = true;
        this.incomeResult[0].status = resp.data.last_salary_slips.status;
      }
      this.getnextSection();

      if (loader) { loader.close(); }
    } catch (error) {
      if (loader) { loader.close(); }
    }
  }

  async getDocumentsCatalog() {
    try {
      const resp = await this.catalogService.getCatalogDocumentInvestigator();
      resp.data.forEach(catalog => {
        if (catalog.subtype_document) {
          if (catalog.subtype_document == 'professional_id') {
            this.docsCat.professional = catalog.questions;
          }
          if (catalog.subtype_document == 'passport') { this.docsCat.passport = catalog.questions }
          if (catalog.subtype_document == 'ine') {
            if (catalog.type_document == 'id_front') { this.docsCat.ine = catalog.questions }
            if (catalog.type_document == 'id_back') { this.docsCat.back = catalog.questions }
          }
        } else {
          if (catalog.type_document == "address_proof") { this.docsCat.address = catalog.questions }
          if (catalog.type_document == "last_salary_slips") { this.docsCat.lastInc = catalog.questions }
          if (catalog.type_document == "antepenultimate_salary_slips") { this.docsCat.anteInc = catalog.questions }
          if (catalog.type_document == "previus_salary_slips") { this.docsCat.prevInc = catalog.questions }
        }
      });
      this.getResults();
    } catch (error) {
    }
  }

  async requestDocumentImage(documentList) {
    for (let i = 0; i < documentList.length; i++) {
      try {
        const resp = await this.userSvc.getImageb64ForValidation(documentList[i].name);
        documentList[i].file = this.sanitizer.bypassSecurityTrustResourceUrl(resp.data)
      } catch (error) {
      }
    }
  }

  matchLabelResutls(results, catalog) {
    var resultsArr = [];
    catalog.forEach((question, index) => {
      resultsArr.push({
        label: question.title,
        value: (results[index][question.id]).toLowerCase()
      });
    });
    return resultsArr;
  }
}
