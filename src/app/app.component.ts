import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CartDrawerComponent } from './components/cart-drawer/cart-drawer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, CartDrawerComponent],
  template: `
    <app-navbar></app-navbar>

    <main id="app-container">
      <router-outlet></router-outlet>
    </main>

    <app-cart-drawer></app-cart-drawer>

    <footer class="footer">
      <div class="container">
        <p>&copy; 2026 Suplemental. Todos los derechos reservados.</p>
      </div>
    </footer>
  `,
  styles: [`
    #app-container {
      min-height: calc(100vh - 160px);
    }
    .footer {
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      padding: 40px 0;
      text-align: center;
      color: var(--text-secondary);
      font-size: 0.9rem;
      background-color: var(--bg-dark);
    }
  `]
})
export class AppComponent {}
