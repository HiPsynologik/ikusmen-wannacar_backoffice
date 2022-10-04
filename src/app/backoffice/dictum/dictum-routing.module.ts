import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DictumControlComponent } from './components/dictum-control/dictum-control.component';
import { DictumTrackerComponent } from './components/tracker/dictum-tracker.component';


const routes: Routes = [
  {path: "", component: DictumControlComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DictumRoutingModule { }
