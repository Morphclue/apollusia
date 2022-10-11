import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PostponeModalComponent} from './postpone-modal.component';

describe('PostponeModalComponent', () => {
  let component: PostponeModalComponent;
  let fixture: ComponentFixture<PostponeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostponeModalComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(PostponeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
