import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemporarilyLockedUserComponent } from './temporarily-locked-user.component';

describe('TemporarilyLockedUserComponent', () => {
  let component: TemporarilyLockedUserComponent;
  let fixture: ComponentFixture<TemporarilyLockedUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemporarilyLockedUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemporarilyLockedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
