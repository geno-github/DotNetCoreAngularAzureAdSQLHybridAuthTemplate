import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppUserDetailComponent } from './app-user-detail.component';

describe('AppUserDetailComponent', () => {
  let component: AppUserDetailComponent;
  let fixture: ComponentFixture<AppUserDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppUserDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppUserDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
