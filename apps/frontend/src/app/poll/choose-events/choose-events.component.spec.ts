import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ChooseEventsComponent} from './choose-events.component';

describe('ChooseEventsComponent', () => {
  let component: ChooseEventsComponent;
  let fixture: ComponentFixture<ChooseEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChooseEventsComponent],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
