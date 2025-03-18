import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PollLogComponent } from './poll-log.component';

describe('PollLogComponent', () => {
  let component: PollLogComponent;
  let fixture: ComponentFixture<PollLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PollLogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PollLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
