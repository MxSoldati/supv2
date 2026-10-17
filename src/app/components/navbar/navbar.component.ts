import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="container nav-container">
        <!-- 1. Logo -->
        <button class="logo" (click)="goToHome()" aria-label="Ir al inicio">
          <span class="logo-suple">SUPLE</span><span class="logo-mental">MENTAL</span>
        </button>

        <!-- 2. Enlaces de Navegación -->
        <ul class="nav-links" [class.open]="isMenuOpen">
          <li>
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" (click)="closeMenu()" id="link-home">
              Inicio
            </a>
          </li>
          <li>
            <a routerLink="/productos" routerLinkActive="active" (click)="closeMenu()" id="link-products">
              Productos
            </a>
          </li>
        </ul>

        <!-- 3. Acciones (Carrito + Botón Menú Mobile) -->
        <div class="nav-actions">
          <button (click)="openCart()" class="cart-btn" aria-label="Abrir carrito">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="cart-icon">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            @if (cartService.totalItems() > 0) {
              <span class="cart-badge">{{ cartService.totalItems() }}</span>
            }
          </button>

          <button class="menu-toggle" (click)="toggleMenu()" aria-label="Alternar menú">
            <span class="bar" [class.open]="isMenuOpen"></span>
            <span class="bar" [class.open]="isMenuOpen"></span>
            <span class="bar" [class.open]="isMenuOpen"></span>
          </button>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      padding: 16px 0;
      top: 0;
      z-index: 100;
      background-color: var(--bg-dark);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      position: sticky;
      backdrop-filter: blur(12px);
    }
    .nav-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
    }
    .logo {
      display: flex;
      align-items: center;
      font-size: 1.25rem;
      font-weight: 800;
      letter-spacing: 1px;
      cursor: pointer;
      background: none;
      border: none;
      padding: 0;
      font-family: inherit;
    }
    .logo-suple {
      color: var(--text-main);
    }
    .logo-mental {
      color: var(--primary-accent);
    }

    /* Enlaces Desktop */
    .nav-links {
      display: flex;
      gap: 32px;
      list-style: none;
      align-items: center;
      margin: 0;
      padding: 0;
    }
    .nav-links a {
      color: var(--text-secondary);
      text-decoration: none;
      font-weight: 500;
      transition: color var(--transition-speed);
      position: relative;
      padding: 6px 0;
      cursor: pointer;
    }
    .nav-links a:hover, .nav-links a.active {
      color: var(--text-main);
    }
    .nav-links a.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: var(--primary-accent);
      border-radius: 2px;
    }

    /* Acciones: Carrito y Hamburguesa */
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .cart-btn {
      background: none;
      border: none;
      color: var(--text-main);
      cursor: pointer;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px;
      border-radius: 50%;
      transition: background-color var(--transition-speed), color var(--transition-speed);
    }
    .cart-btn:hover {
      background-color: rgba(255, 255, 255, 0.05);
      color: var(--primary-accent);
    }
    .cart-badge {
      position: absolute;
      top: -2px;
      right: -2px;
      background-color: var(--primary-accent);
      color: var(--bg-dark);
      font-size: 0.75rem;
      font-weight: 700;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    @keyframes popIn {
      0% { transform: scale(0); }
      80% { transform: scale(1.2); }
      100% { transform: scale(1); }
    }

    /* Botón Hamburguesa */
    .menu-toggle {
      display: none;
      flex-direction: column;
      gap: 5px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 6px;
    }
    .menu-toggle .bar {
      width: 22px;
      height: 2px;
      background-color: var(--text-main);
      border-radius: 2px;
      transition: all 0.25s ease;
    }
    .menu-toggle .bar.open:nth-child(1) {
      transform: translateY(7px) rotate(45deg);
    }
    .menu-toggle .bar.open:nth-child(2) {
      opacity: 0;
    }
    .menu-toggle .bar.open:nth-child(3) {
      transform: translateY(-7px) rotate(-45deg);
    }

    /* Responsivo Mobile (< 768px) */
    @media (max-width: 768px) {
      .menu-toggle {
        display: flex;
      }

      .nav-links {
        position: absolute;
        top: calc(100% + 16px);
        left: 0;
        width: 100%;
        background-color: var(--bg-dark);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        flex-direction: column;
        gap: 0;
        padding: 12px 0;
        box-shadow: 0 16px 30px rgba(0, 0, 0, 0.6);
        transform: translateY(-10px);
        opacity: 0;
        pointer-events: none;
        transition: transform 0.25s ease, opacity 0.25s ease;
      }

      .nav-links.open {
        transform: translateY(0);
        opacity: 1;
        pointer-events: auto;
      }

      .nav-links li {
        width: 100%;
        text-align: center;
      }

      .nav-links a {
        display: block;
        padding: 12px 0;
        font-size: 1rem;
      }

      .nav-links a.active::after {
        display: none;
      }

      .nav-links a.active {
        color: var(--primary-accent);
      }
    }
  `]
})
export class NavbarComponent {
  cartService = inject(CartService);
  private router = inject(Router);

  isMenuOpen = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  goToHome(): void {
    this.closeMenu();
    this.router.navigate(['/']);
  }

  openCart(): void {
    this.closeMenu();
    this.cartService.openDrawer();
  }
}