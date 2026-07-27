# Kings Choice Fan Site - Developer Guide

## Project Overview

Kings Choice Fan Site is an interactive Angular web application for Kings Choice game fans. The site provides event management and interactive gameplay features like the Uncharted Waters city selection tool.

**Repository**: https://github.com/cancadua/fan-site-kings-choice  
**Deployment**: GitHub Pages (automated via angular-cli-ghpages)  
**Status**: Active Development

---

## Architecture & Design

### Project Structure

```
src/app/
├── core/                      # Singleton services, guards, interceptors
│   ├── constants/            # Static data (events, cities, etc.)
│   └── enums/                # TypeScript enums (Event, Continent)
├── features/                 # Feature modules (lazy-loaded routes)
│   ├── home/                 # Home page feature
│   ├── events/               # Events list and management
│   │   └── uncharted-waters/ # Specific event implementation
│   └── [other-features]/
├── shared/                   # Reusable components
│   ├── app-header/
│   ├── app-tabs/
│   ├── app-drop/
│   └── [other-shared-components]/
├── app.config.ts            # Angular app configuration
├── app.routes.ts            # Route definitions
├── app.ts                   # Root component
└── main.ts                  # Bootstrap
```

### Key Architectural Decisions

1. **Standalone Components**: Uses Angular 14+ standalone API (no NgModules)
2. **Feature-Based Organization**: Organized by feature, not by type
3. **Shared Component Library**: UI components in `shared/` folder for reuse
4. **Static Data**: Event and city data stored in `core/constants/`
5. **Strong Typing**: Full TypeScript strict mode enabled

### Routing

Routes are defined in `app.routes.ts`. Each feature module should have its own route configuration:

```typescript
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'events', component: EventsComponent },
  { path: '**', redirectTo: '' },
];
```

---

## Development Workflow

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- Angular CLI 20.x (installed as dev dependency)

### Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Open browser at http://localhost:4200
```

### Development Commands

| Command          | Purpose                        |
| ---------------- | ------------------------------ |
| `npm start`      | Run dev server with hot reload |
| `npm run build`  | Production build               |
| `npm test`       | Run unit tests                 |
| `npm run format` | Format code with Prettier      |
| `npm run watch`  | Watch mode build               |

### Git Workflow

1. **Branch naming**: Use descriptive names

   - Feature: `feat/feature-name`
   - Bug fix: `fix/bug-description`
   - Docs: `docs/documentation-update`

2. **Commits**: Use conventional commits

   - `feat:` New feature
   - `fix:` Bug fix
   - `refactor:` Code refactoring
   - `docs:` Documentation
   - `test:` Adding/updating tests
   - `perf:` Performance improvements
   - `chore:` Build, dependencies, config

3. **Before Committing**:
   ```bash
   npm test          # Ensure all tests pass
   npm run format    # Format code
   git status        # Review changes
   git add [files]   # Stage specific files
   git commit -m "type: description"
   ```

---

## Code Style & Conventions

### TypeScript

- **Strict Mode**: Enabled in tsconfig.json - all code must pass strict type checking
- **Naming**: camelCase for variables/functions, PascalCase for classes/interfaces/types
- **Imports**: Order by: Angular → Third-party → Local (relative paths last)
- **No `any`**: Avoid `any` type - use `unknown` with type guards instead
- **Null Checks**: Use strict null checks - handle undefined/null explicitly

```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
  email?: string;
}

const processUser = (user: User | null): string => {
  if (!user) return 'Unknown';
  return user.name;
};

// ❌ Bad
const processUser = (user: any) => {
  return user.name;
};
```

### Components

- **Naming**: `FeatureNameComponent`
- **Selectors**: `app-feature-name` (kebab-case with app- prefix)
- **Standalone**: All new components use standalone API
- **Change Detection**: Default is `OnPush` - explicitly set other strategies
- **Lifecycle**: Keep lifecycle hooks simple and focused

```typescript
@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventCardComponent {
  @Input() event!: Event;
  @Output() eventSelected = new EventEmitter<Event>();

  onSelect(): void {
    this.eventSelected.emit(this.event);
  }
}
```

### Templates

- **Event Binding**: Use parentheses `(click)="method()"`
- **Property Binding**: Use brackets `[property]="value"`
- **Two-way**: Use `[(ngModel)]` sparingly
- **Async Pipe**: Prefer `async` pipe over manual subscriptions in components
- **Safe Navigation**: Use `?.` operator and `| async` for null safety

```html
<!-- ✅ Good -->
<button (click)="selectEvent(event)" [disabled]="isLoading">
  {{ event.name }}
</button>

<!-- Safe navigation with async -->
<p>{{ (user$ | async)?.name }}</p>

<!-- ❌ Avoid -->
<button (click)="selectEvent($event)">{{ event?.name || 'Unknown' }}</button>
```

### SCSS

- **Nesting**: Use nesting for related selectors
- **Variables**: Define in component or create separate `_variables.scss`
- **BEM**: Consider BEM for complex components
- **Scope**: Styles are scoped to component by default

```scss
// Component-scoped style
.event-card {
  padding: 1rem;
  border-radius: 4px;

  &__title {
    font-size: 1.25rem;
    font-weight: bold;
  }

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}
```

### Formatting

- **Formatter**: Prettier (configured in `.prettierrc`)
- **Before Commit**: Run `npm run format`
- **Auto-format on Save**: Configure in IDE (see `.vscode/settings.json`)

---

## Component Patterns

### Service Pattern

Services should be provided at the appropriate level:

```typescript
@Injectable({ providedIn: 'root' })
export class EventService {
  private readonly eventList$ = signal<Event[]>([]);
  events$ = this.eventList$.asReadonly();

  constructor(private http: HttpClient) {}

  loadEvents(): void {
    this.http
      .get<Event[]>('/api/events')
      .subscribe((events) => this.eventList$.set(events));
  }
}
```

### Smart/Dumb Component Pattern

- **Container Components** (Smart): Handle logic, data fetching, state management
- **Presentational Components** (Dumb): Receive data via @Input, emit events via @Output

```typescript
// ✅ Container Component
@Component({
  selector: 'app-events-container',
  standalone: true,
  imports: [EventsListComponent],
  template:
    '<app-events-list [events]="events$ | async" (select)="onSelect($event)" />',
})
export class EventsContainerComponent {
  events$ = this.eventService.getEvents();
  constructor(private eventService: EventService) {}
  onSelect(event: Event): void {
    /* ... */
  }
}

// ✅ Presentational Component
@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [CommonModule],
  template:
    '<div *ngFor="let e of events" (click)="select.emit(e)">{{ e.name }}</div>',
})
export class EventsListComponent {
  @Input() events: Event[] = [];
  @Output() select = new EventEmitter<Event>();
}
```

### State Management Pattern

For complex state, consider using signals (Angular 16+) or RxJS:

```typescript
// Using Signals
@Injectable({ providedIn: 'root' })
export class EventState {
  private selectedEventSignal = signal<Event | null>(null);
  selectedEvent = this.selectedEventSignal.asReadonly();

  selectEvent(event: Event): void {
    this.selectedEventSignal.set(event);
  }
}

// Using RxJS (alternative)
@Injectable({ providedIn: 'root' })
export class EventState {
  private selectedEventSubject = new BehaviorSubject<Event | null>(null);
  selectedEvent$ = this.selectedEventSubject.asObservable();

  selectEvent(event: Event): void {
    this.selectedEventSubject.next(event);
  }
}
```

---

## Testing Strategy

### Unit Tests

- **Coverage Target**: Aim for 80%+ coverage
- **Framework**: Jasmine/Karma
- **Scope**: Test business logic, not implementation details
- **Run**: `npm test`

```typescript
describe('EventService', () => {
  let service: EventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventService);
  });

  it('should return events', (done) => {
    const mockEvents = [{ id: '1', name: 'Event 1' }];
    spyOn(service, 'getEvents').and.returnValue(of(mockEvents));

    service.getEvents().subscribe((events) => {
      expect(events).toEqual(mockEvents);
      done();
    });
  });
});
```

### Testing Checklist

- [ ] User interactions (clicks, forms)
- [ ] Data binding (inputs, outputs)
- [ ] Event emissions
- [ ] Error handling
- [ ] Edge cases (empty data, null values)
- [ ] Observable subscriptions

---

## Build & Deployment

### Production Build

```bash
npm run build
# Output: dist/kings-choice/
```

### Build Configuration

- **Budget Limits** (from angular.json):
  - Initial bundle: 1MB max
  - Component styles: 8KB max per component
- **Optimization**: Enabled by default in production
- **Source Maps**: Disabled in production for security

### Deployment to GitHub Pages

```bash
npx angular-cli-ghpages --dir=dist/kings-choice
```

This is automated in CI/CD pipeline. Manual deployment available via the npm script if configured.

### Performance Considerations

1. **Lazy Loading**: Load feature modules only when needed
2. **Tree Shaking**: Ensure unused code is removed
3. **Bundle Analysis**: Monitor bundle size with `npm run build --stats-json`
4. **Image Optimization**: Compress images, use WebP where possible
5. **CSS Optimization**: Unused styles are automatically removed by Angular

---

## Common Tasks

### Adding a New Feature Component

```bash
# Generate component in feature folder
ng generate component features/my-feature/my-feature

# This creates:
# - my-feature.component.ts (standalone)
# - my-feature.component.html
# - my-feature.component.scss
# - my-feature.component.spec.ts
```

Edit the component:

```typescript
@Component({
  selector: 'app-my-feature',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-feature.component.html',
  styleUrls: ['./my-feature.component.scss'],
})
export class MyFeatureComponent {
  // Component logic
}
```

### Adding a New Service

```bash
ng generate service core/services/my-service
```

```typescript
@Injectable({ providedIn: 'root' })
export class MyService {
  constructor(private http: HttpClient) {}

  getdata(): Observable<Data[]> {
    return this.http.get<Data[]>('/api/data');
  }
}
```

### Adding a New Route

1. Create feature folder with component
2. Add to `app.routes.ts`:

```typescript
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'my-feature', component: MyFeatureComponent },
  { path: '**', redirectTo: '' },
];
```

### Updating Dependencies

Check for updates:

```bash
npm outdated
```

Update packages:

```bash
npm update [package-name]
# or update all
npm update
```

Always test after updating major versions.

---

## Environment Setup

### IDE Configuration

**VS Code Recommended Extensions**:

- Angular Language Service
- Prettier - Code Formatter
- TypeScript Vue Plugin (Volar)
- ESLint
- Debugger for Chrome

**VS Code Settings** (`settings.json`):

```json
{
  "[typescript]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

### Environment Variables

Create `.env` files for environment-specific config:

```
# .env.local
API_URL=http://localhost:3000
```

Load in `app.config.ts` or use `environment.ts`.

---

## Troubleshooting

### Development Server Issues

```bash
# Clear node_modules and reinstall
rm -r node_modules package-lock.json
npm install

# Clear Angular CLI cache
npm run ng -- cache clean
```

### Build Failures

1. Check TypeScript errors: `npm run ng -- build --stats-json`
2. Clear dist folder: `rm -r dist`
3. Check bundle size: `npm run build --stats-json`

### Test Failures

```bash
# Run single test file
npm test -- --include='**/my-feature/**'

# Run with debugging
npm test -- --browsers=Chrome --watch
```

---

## Performance Targets

- **Lighthouse Score**: Target 90+
- **Bundle Size**: Keep under 1MB (configured)
- **First Contentful Paint**: < 2.5s
- **Time to Interactive**: < 5s

Monitor these metrics regularly using:

- Chrome DevTools Lighthouse
- WebPageTest
- Angular Bundle Analyzer

---

## Resources & Documentation

- [Angular Official Docs](https://angular.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [RxJS Documentation](https://rxjs.dev/)
- [Prettier Documentation](https://prettier.io/)
- [Kings Choice Game](https://www.kingschoice.com/)

---

## Team Practices

### Code Review

Before submitting PRs:

1. Ensure all tests pass
2. Run formatter: `npm run format`
3. Check TypeScript strict mode compliance
4. Write clear commit messages
5. Update documentation if needed

### Documentation

- Keep README.md up to date
- Add comments for non-obvious logic
- Document public APIs and interfaces
- Update this guide when architecture changes

### Performance Reviews

- Monthly: Check bundle size trends
- Quarterly: Review and optimize slow components
- Regularly: Monitor Lighthouse scores on production

---

**Last Updated**: July 2026  
**Maintained By**: Adrian (3adek4@gmail.com)
