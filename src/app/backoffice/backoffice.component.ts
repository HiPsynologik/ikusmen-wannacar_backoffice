import { Component, OnInit } from '@angular/core';
import { OpenCloseSideNav } from '@shared/animations/OpenCloseSideNav';
import { ModalService } from '@shared/services/modal/modal.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'wnbo-backoffice',
  templateUrl: './backoffice.component.html',
  styleUrls: ['./backoffice.component.scss']
})
export class BackofficeComponent implements OnInit {
  sideNavOpen = false;

  constructor(private modalSvc:ModalService, public translate: TranslateService) {
    translate.addLangs(['es']);
    translate.setDefaultLang('es');
    translate.use('es');
  }

  ngOnInit() {
  }

  menuState(status) {
    this.sideNavOpen = status;
    console.log(status)
  }

}
