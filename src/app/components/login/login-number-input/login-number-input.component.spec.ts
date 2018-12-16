import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginNumberInputComponent } from './login-number-input.component';

describe('LoginNumberInputComponent', () => {
  let component: LoginNumberInputComponent;
  let fixture: ComponentFixture<LoginNumberInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginNumberInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginNumberInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
