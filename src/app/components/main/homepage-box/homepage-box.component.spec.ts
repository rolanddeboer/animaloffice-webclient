import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageBoxComponent } from './homepage-box.component';

describe('HomepageBoxComponent', () => {
  let component: HomepageBoxComponent;
  let fixture: ComponentFixture<HomepageBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomepageBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomepageBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
