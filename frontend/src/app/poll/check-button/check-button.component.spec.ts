import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckButtonComponent } from './check-button.component';

describe('CheckButtonComponent', () => {
  let component: CheckButtonComponent;
  let fixture: ComponentFixture<CheckButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
