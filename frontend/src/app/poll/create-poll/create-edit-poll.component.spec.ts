import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateEditPollComponent} from './create-edit-poll.component';

describe('CreateEditPollComponent', () => {
  let component: CreateEditPollComponent;
  let fixture: ComponentFixture<CreateEditPollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateEditPollComponent],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditPollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
