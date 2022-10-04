import { Component, OnInit } from '@angular/core';
import { DictumService } from '@shared/services/http/dictum.service';
import { ModalService } from '@shared/services/modal/modal.service';

@Component({
  selector: 'wnbo-dictum-tracker',
  templateUrl: './dictum-tracker.component.html',
  styleUrls: ['./dictum-tracker.component.scss']
})
export class DictumTrackerComponent implements OnInit {
  public displayedColumns = [
    'id',
    'name',
    'email',
    'requests',
    'documentary_validation',
    'credit_analyst',
    'investigator',
    'calls',
    'credit_approved',
  ];
  public prospectData: any;
  constructor(
    private dictumSvc: DictumService,
    private modalSvc: ModalService
  ) { }

  ngOnInit() {
    this.getList();
  }

  async getList() {
    try {
      var loader = this.modalSvc.loader();
      const resp = await this.dictumSvc.getProcessList();
      // 0: No hay actividad 1: Amarillo (pendiente) 2: Verde (terminado) 3: Rojo (rechazado)
      this.prospectData = resp.data;
      if(loader){loader.close()}
    } catch (error) {
      if(loader){loader.close()}      
    }
  }

}
