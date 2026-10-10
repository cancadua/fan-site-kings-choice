import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { SessionService } from '../../core/auth/session.service';
import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let http: HttpTestingController;
  let session: SessionService;
  let router: Router;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    session = TestBed.inject(SessionService);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('stores the token and navigates after a successful login', async () => {
    component.email.set('a@b.co');
    component.password.set('secret1');
    const done = component.submit();

    const req = http.expectOne((r) => r.url.endsWith('/api/auth/login'));
    expect(req.request.body).toEqual({ email: 'a@b.co', password: 'secret1' });
    // Unsigned token with an exp far in the future.
    const payload = btoa(
      JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 })
    );
    req.flush({ token: `x.${payload}.y` });
    await done;

    expect(session.isLoggedIn()).toBe(true);
    expect(router.navigate).toHaveBeenCalledWith(['/alliance']);
  });

  it('shows the API error message on failure', async () => {
    component.email.set('a@b.co');
    component.password.set('wrong');
    const done = component.submit();

    http
      .expectOne((r) => r.url.endsWith('/api/auth/login'))
      .flush(
        { error: 'Invalid email or password.' },
        { status: 401, statusText: 'Unauthorized' }
      );
    await done;

    expect(component.error()).toBe('Invalid email or password.');
    expect(session.isLoggedIn()).toBe(false);
  });
});
