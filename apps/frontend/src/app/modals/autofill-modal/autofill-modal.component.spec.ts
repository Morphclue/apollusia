import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AutofillModalComponent} from './autofill-modal.component';

describe('AutofillModalComponent', () => {
  let component: AutofillModalComponent;
  let fixture: ComponentFixture<AutofillModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AutofillModalComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(AutofillModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
