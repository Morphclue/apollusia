# 🃏 Quick Jest Testing Gide for Angular Monorepo

## Writing Component Tests

Create `*.spec.ts` files next to your components:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { YourComponent } from './your.component';
import { YourService } from './your.service';

describe('YourComponent', () => {
  let component: YourComponent;
  let fixture: ComponentFixture<YourComponent>;
  let serviceMock: jest.Mocked<YourService>;

  beforeEach(async () => {
    serviceMock = {
      someMethod: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      declarations: [YourComponent],
      providers: [{ provide: YourService, useValue: serviceMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(YourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should work', () => {
    expect(component).toBeTruthy();
    component.doSomething();
    expect(serviceMock.someMethod).toHaveBeenCalled();
  });
});
```

## Running Tests

```bash
# Run tests for a specific project
nx test your-project-name

# With coverage
nx test your-project-name --coverage

# Watch mode
nx test your-project-name --watch
```

## Key Tips
- Place test files next to implementation (`*.spec.ts`)
- Use `jest.fn()` for mocking
- Keep tests focused and independent
- Test critical user flows first
- Use `beforeEach` for setup code

For more details, check the [Jest docs](https://jestjs.io/docs/getting-started).
