import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginNotMeComponent } from './login-not-me.component';

describe('LoginNotMeComponent', () => {
  let component: LoginNotMeComponent;
  let fixture: ComponentFixture<LoginNotMeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginNotMeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginNotMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
