import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardsService } from '@shared/services/http/boards.services';
import { ModalService } from '@shared/services/modal/modal.service';
import { PersonalInfo, WorkInfo, CarInfo, CreditInfo } from "@shared/models/personalInfo.model";
import { CatalogService } from '@shared/services/http/catalog.service';
import { MatStepper } from '@angular/material';

@Component({
  selector: 'wnbo-results-control',
  templateUrl: './results-control.component.html',
  styleUrls: ['./results-control.component.scss']
})
export class ResultsControlComponent implements OnInit, OnDestroy {
  @ViewChild('stepper', { static: true }) private stepper: MatStepper
  public prospectInfo: any;
  private routSubs: any;
  private querySubs: any;
  public cardId: string;
  public requestId: string;
  public cardStatus = { label: '', class: '' };
  public sectionsProspect: any;
  public userProgressPercent = 37;
  public isResumeView = false;
  public referencesData: any;
  public addressFailCat: any = {};
  public workFailCat: any = {};
  public sectionsApproved = [false, false, false, false];
  public sectionsHidden = [false,false,false,false];
  public areHistoricalButtonsShown = false;
  public isHistoricalShown = false;


  constructor(
    private activatedRoute: ActivatedRoute,
    private boardSvc: BoardsService,
    private modalSvc: ModalService,
    private catalogService: CatalogService,
    private router: Router
  ) {
    
  }

  ngOnInit() {
    this.routSubs = this.activatedRoute.params.subscribe(params => {
      this.cardId = params['id'];
      this.requestId = params['request'];
    });
    this.querySubs = this.activatedRoute.queryParams.subscribe((params) => {
      if(params.prev) {
        this.isResumeView = true;
      }
    });
    this.getFailedCatalog();
    this.cardStatus = this.boardSvc.getCardStatus;
    this.getProspectInfo();
  }

  getnextSection() {
    var indexSection = this.sectionsApproved.indexOf(false);
    if(indexSection != -1) {
      this.stepper.selectedIndex = indexSection;
    } else {
      if(!this.isResumeView) {
      this.backToBoard();
      }
    }
  }

  showHistorical() {
    this.isHistoricalShown = true;
  }

  hideHistorical() {
    if(this.isHistoricalShown) {
      this.isHistoricalShown = false;
    } else {
      this.backToBoard();
    }
  }

  sectionApproved(section) {
    this.sectionsApproved[section] = true;
    this.getnextSection();
  }

  hideSection(section) {
    // this.sectionsHidden[section] = true;
    // this.sectionsApproved[section] = true;

    //esta no causa conflicto


    this.sectionsHidden[0] = true;
    this.sectionsHidden[1] = true;
    this.sectionsHidden[3] = true;
    this.sectionsApproved[0] = true;
    this.sectionsApproved[1] = true;
    this.sectionsApproved[3] = true;
    this.areHistoricalButtonsShown = true;
    this.stepper.selectedIndex = 0
  }

  hideHistoricalButtons() {
    console.log('ocultando')
    this.areHistoricalButtonsShown = false;
  }

  async getProspectInfo() {
    let loader = this.modalSvc.loader();
    try {
      const email = this.boardSvc.getProspectEmail;
      const resp = await this.boardSvc.getDataProspect(email);
      this.sectionsProspect = {
        personal: new PersonalInfo(resp.data),
        work: new WorkInfo(resp.data),
        car: new CarInfo(resp.data),
        credit: new CreditInfo(resp.data)
      }
      this.referencesData = {
        work: {
          name: resp.data.reference_acquaintance_one_name,
          phone: resp.data.reference_acquaintance_one_phone
        },
        known: {
          name: resp.data.reference_acquaintance_two_name,
          phone: resp.data.reference_acquaintance_two_phone
        },
        familiar: {
          name: resp.data.reference_familiar_name,
          phone: resp.data.reference_familiar_phone
        }
      }
      this.prospectInfo = resp.data;
      loader.close();
    } catch (error) {
      if(loader) {
        loader.close();
      }
    }
  }

  async getFailedCatalog() {
    try {
      var loader = this.modalSvc.loader();
      const resp = await this.catalogService.getCatalogVisitFailed();
      resp.data.forEach(element => {
        this.addressFailCat[element.name] = element.label;
        this.workFailCat[element.name] = element.label;
      });
      loader.close();
    } catch (error) {
      loader.close();
    }
  }

  backToBoard() {
    if(!this.isResumeView) {
      this.router.navigate(['/analyst']);
    }else{
      this.router.navigate(['/analyst/resume'+'/'+this.cardId+'/'+this.requestId]);
    } 
  }

  ngOnDestroy() {
    if(this.routSubs) { this.routSubs.unsubscribe(); }
    if(this.querySubs) {this.querySubs.unsubscribe();}
  }

}
