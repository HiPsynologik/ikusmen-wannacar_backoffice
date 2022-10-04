import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'wnbo-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(public translate: TranslateService) {
    this.translate.addLangs(['es']);
    this.translate.setDefaultLang('es');
    this.translate.use('es');
    console.log(this.translate)
  }

  ngOnInit() {

  }

}
