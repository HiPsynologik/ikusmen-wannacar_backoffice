import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DictumControlComponent } from './dictum-control.component';

describe('DictumControlComponent', () => {
  let component: DictumControlComponent;
  let fixture: ComponentFixture<DictumControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DictumControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DictumControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
