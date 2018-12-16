import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClickBlockerComponent } from './click-blocker.component';

describe('ClickBlockerComponent', () => {
  let component: ClickBlockerComponent;
  let fixture: ComponentFixture<ClickBlockerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClickBlockerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClickBlockerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
