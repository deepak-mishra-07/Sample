import { Injectable, signal, computed } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user' | 'moderator';
  permissions: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'current_user';

  // Signals for reactive state management
  private _currentUser = signal<User | null>(this.getUserFromStorage());
  private _isAuthenticated = computed(() => !!this._currentUser() && !!this.getToken());

  // Public readonly signals
  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = this._isAuthenticated;

  constructor() {
    // Auto-logout on token expiration
    this.checkTokenExpiration();
  }

  /**
   * Sign in user with email and password
   */
  signin(credentials: LoginRequest): Observable<LoginResponse> {
    // Simulate API call with mock data
    const mockUser: User = {
      id: '1',
      email: credentials.email,
      firstName: 'John',
      lastName: 'Doe',
      role: credentials.email.includes('admin') ? 'admin' : 'user',
      permissions: credentials.email.includes('admin') 
        ? ['read', 'write', 'delete', 'manage_users']
        : ['read', 'write']
    };

    const mockResponse: LoginResponse = {
      user: mockUser,
      token: this.generateMockToken(),
      refreshToken: this.generateMockRefreshToken()
    };

    return of(mockResponse).pipe(delay(1000)); // Simulate network delay
  }

  /**
   * Sign up new user
   */
  signup(userData: Partial<User> & { password: string }): Observable<LoginResponse> {
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email!,
      firstName: userData.firstName!,
      lastName: userData.lastName!,
      role: 'user',
      permissions: ['read', 'write']
    };

    const response: LoginResponse = {
      user: newUser,
      token: this.generateMockToken(),
      refreshToken: this.generateMockRefreshToken()
    };

    return of(response).pipe(delay(1000));
  }

  /**
   * Sign out current user
   */
  signout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this._currentUser.set(null);
  }

  /**
   * Set authenticated user and tokens
   */
  setAuthenticatedUser(response: LoginResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
    this._currentUser.set(response.user);
  }

  /**
   * Get stored authentication token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(permission: string): boolean {
    const user = this.currentUser();
    return user?.permissions.includes(permission) ?? false;
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const user = this.currentUser();
    return user?.role === role;
  }

  private getUserFromStorage(): User | null {
    try {
      const userJson = localStorage.getItem(this.USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch {
      return null;
    }
  }

  private generateMockToken(): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: '1234567890',
      name: 'John Doe',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
    }));
    const signature = 'mock-signature';
    return `${header}.${payload}.${signature}`;
  }

  private generateMockRefreshToken(): string {
    return 'mock-refresh-token-' + Date.now();
  }

  private checkTokenExpiration(): void {
    const token = this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = payload.exp * 1000 < Date.now();
        if (isExpired) {
          this.signout();
        }
      } catch {
        this.signout();
      }
    }
  }
}
