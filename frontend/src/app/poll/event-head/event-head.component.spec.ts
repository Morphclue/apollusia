import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventHeadComponent } from './event-head.component';

describe('EventHeadComponent', () => {
  let component: EventHeadComponent;
  let fixture: ComponentFixture<EventHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventHeadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
