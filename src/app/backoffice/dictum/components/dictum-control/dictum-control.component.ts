import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'wnbo-dictum-control',
  templateUrl: './dictum-control.component.html',
  styleUrls: ['./dictum-control.component.scss']
})
export class DictumControlComponent implements OnInit {
  public sections = [ 
    {label: 'estado del proceso'},
    {label: 'rastreo de actividad'},
    {label: 'rechazadas/pendientes'}
  ];
  public currentSection = 1;
  constructor() { }

  ngOnInit() {
  }

  selectSection(index) {
    this.currentSection = index;
  }

}
