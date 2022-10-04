import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersRolesMainComponent } from './users-roles-main.component';

describe('UsersRolesMainComponent', () => {
  let component: UsersRolesMainComponent;
  let fixture: ComponentFixture<UsersRolesMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersRolesMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersRolesMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
