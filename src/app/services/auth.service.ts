import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly MASTER_PASSWORD = 'supleadmin2026';
  private readonly STORAGE_KEY = 'suple_admin_authenticated';

  isAuthenticated = signal<boolean>(this.checkInitialAuth());

  private checkInitialAuth(): boolean {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(this.STORAGE_KEY) === 'true';
  }

  login(password: string): boolean {
    if (password.trim() === this.MASTER_PASSWORD) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(this.STORAGE_KEY, 'true');
      }
      this.isAuthenticated.set(true);
      return true;
    }
    return false;
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(this.STORAGE_KEY);
    }
    this.isAuthenticated.set(false);
  }
}
