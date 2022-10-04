import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DictumControlComponent } from './components/dictum-control/dictum-control.component';
import { DictumTrackerComponent } from './components/tracker/dictum-tracker.component';
import { DictumRoutingModule } from "./dictum-routing.module";
import { ProcessComponent } from './process/process.component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    DictumControlComponent,
    DictumTrackerComponent,
    ProcessComponent
  ],
  imports: [
    CommonModule,
    DictumRoutingModule,
    SharedModule
  ]
})
export class DictumModule { }
