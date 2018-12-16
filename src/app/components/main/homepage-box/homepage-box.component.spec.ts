import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepagetBoxComponent } from './homepage-box.component';

describe('HomepageBoxComponent', () => {
  let component: HomepagetBoxComponent;
  let fixture: ComponentFixture<HomepagetBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomepagetBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomepagetBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
