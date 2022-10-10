import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CustomDefinitionModalComponent} from './custom-definition-modal.component';

describe('CustomDefinitionModalComponent', () => {
  let component: CustomDefinitionModalComponent;
  let fixture: ComponentFixture<CustomDefinitionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomDefinitionModalComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(CustomDefinitionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
