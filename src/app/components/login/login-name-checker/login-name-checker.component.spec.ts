import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginNameCheckerComponent } from './login-name-checker.component';

describe('LoginNameCheckerComponent', () => {
  let component: LoginNameCheckerComponent;
  let fixture: ComponentFixture<LoginNameCheckerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginNameCheckerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginNameCheckerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
