import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllShowsComponent } from './list-all-shows.component';

describe('ListAllShowsComponent', () => {
  let component: ListAllShowsComponent;
  let fixture: ComponentFixture<ListAllShowsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAllShowsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAllShowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
