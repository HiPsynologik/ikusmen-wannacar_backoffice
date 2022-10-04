import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { DateAdapter } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'baseAngular';

  constructor(public translate: TranslateService, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private dateAdapter:DateAdapter<Date>) {
    let lang = "es";
    translate.setDefaultLang(lang);
    translate.use(lang);
    this.dateAdapter.setLocale(lang)

    iconRegistry.addSvgIcon('wanacar-logo', sanitizer.bypassSecurityTrustResourceUrl('assets/images/wanacar-logo.svg'));
    iconRegistry.addSvgIcon('ico-prospects', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icon-prospectos.svg'));
    iconRegistry.addSvgIcon('ico-personal-data', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icon-datos-personales.svg'));
    iconRegistry.addSvgIcon('ico-domicile', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icon-domicilio.svg'));
    iconRegistry.addSvgIcon('ico-credit-bureau', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icon-buro-credito.svg'));
    iconRegistry.addSvgIcon('ico-work-info', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icon-info-laboral.svg'));
    iconRegistry.addSvgIcon('ico-references', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icon-referencias.svg'));
    iconRegistry.addSvgIcon('ico-documentation', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icon-documentacion.svg'));
    iconRegistry.addSvgIcon('ico-send-requests', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icon-solicitudes-enviadas.svg'));
    iconRegistry.addSvgIcon('expand-icon', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icon-expand.svg'));
    iconRegistry.addSvgIcon('collapse-icon', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icon-collapse.svg'));
    iconRegistry.addSvgIcon('attend-application-icon', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icon-attend-application.svg'));
    iconRegistry.addSvgIcon('reschedule-icon', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icon-reschedule.svg'));
    iconRegistry.addSvgIcon('history-icon', sanitizer.bypassSecurityTrustResourceUrl('assets/images/history-icon.svg'));
    iconRegistry.addSvgIcon('ico-analyst', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icon-analyst.svg'));
    iconRegistry.addSvgIcon('ico-investigation', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icon-investigation.svg'));
    iconRegistry.addSvgIcon('ico-credit', sanitizer.bypassSecurityTrustResourceUrl('assets/images/icon-credit.svg'));
  }
}
