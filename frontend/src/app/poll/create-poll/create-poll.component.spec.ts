import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePollComponent } from './create-poll.component';

describe('CreatePollComponent', () => {
  let component: CreatePollComponent;
  let fixture: ComponentFixture<CreatePollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePollComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
