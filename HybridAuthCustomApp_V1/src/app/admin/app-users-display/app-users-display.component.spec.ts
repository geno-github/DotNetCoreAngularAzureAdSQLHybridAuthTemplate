import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppUsersDisplayComponent } from './app-users-display.component';

describe('AppUsersDisplayComponent', () => {
  let component: AppUsersDisplayComponent;
  let fixture: ComponentFixture<AppUsersDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppUsersDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppUsersDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
