import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Cart Overlay -->
    <div 
      class="cart-overlay" 
      [class.active]="cartService.isDrawerOpen()"
      (click)="closeCart()"
    ></div>

    <!-- Cart Drawer -->
    <aside 
      class="cart-drawer" 
      [class.active]="cartService.isDrawerOpen()"
    >
      <div class="cart-header">
        <h2>Tu Carrito</h2>
        <button type="button" class="close-cart-btn" (click)="closeCart()" aria-label="Cerrar carrito">
          &times;
        </button>
      </div>

      <div class="cart-items">
        @if (cartService.cartItems().length === 0) {
          <div class="cart-empty">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="empty-icon">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <p>Tu carrito está vacío.</p>
            <button type="button" class="btn-cta btn-small" (click)="startShopping()">
              Ver productos
            </button>
          </div>
        } @else {
          @for (item of cartService.cartItems(); track $index) {
            <div class="cart-item">
              <img [src]="item.image" [alt]="item.product.name" class="cart-item-img">
              
              <div class="cart-item-details">
                <div class="cart-item-title">{{ item.product.name }}</div>
                <div class="cart-item-variant">
                  {{ item.variant.size }} - {{ item.variant.flavor }}
                </div>
                
                <div class="cart-item-price-row">
                  <div class="qty-controls">
                    <button type="button" class="qty-btn" (click)="updateQuantity($index, -1)">-</button>
                    <span class="qty-value">{{ item.quantity }}</span>
                    <button type="button" class="qty-btn" (click)="updateQuantity($index, 1)">+</button>
                  </div>

                  <div class="cart-item-price">
                    @if (item.variant.price) {
                      \${{ (item.variant.price * item.quantity).toLocaleString('es-AR') }}
                    } @else {
                      <span class="no-price">Consultar</span>
                    }
                  </div>
                </div>
              </div>

              <button type="button" class="remove-item-btn" (click)="removeItem($index)" aria-label="Eliminar item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          }
        }
      </div>

      <div class="cart-footer">
        <div class="cart-summary">
          <span>Total estimado:</span>
          <span class="cart-total-price">
            @if (cartService.totalPrice() > 0) {
              \${{ cartService.totalPrice().toLocaleString('es-AR') }}
            } @else if (cartService.cartItems().length > 0) {
              A consultar
            } @else {
              \$0
            }
          </span>
        </div>

        <button 
          type="button" 
          class="btn-checkout" 
          [disabled]="cartService.cartItems().length === 0"
          (click)="checkout()"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="wa-icon">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
          Comprar por WhatsApp
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .cart-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(4px);
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease;
    }
    .cart-overlay.active {
      opacity: 1;
      visibility: visible;
    }
    .cart-drawer {
      position: fixed;
      top: 0;
      right: 0;
      width: 100%;
      max-width: 420px;
      height: 100vh;
      background-color: #14171d;
      border-left: 1px solid rgba(255, 255, 255, 0.08);
      z-index: 1001;
      transform: translateX(100%);
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      flex-direction: column;
      box-shadow: -10px 0 30px rgba(0, 0, 0, 0.6);
    }
    .cart-drawer.active {
      transform: translateX(0);
    }
    .cart-header {
      padding: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .cart-header h2 {
      font-size: 1.3rem;
      font-weight: 700;
      color: var(--text-main);
    }
    .close-cart-btn {
      background: none;
      border: none;
      font-size: 1.8rem;
      color: var(--text-secondary);
      cursor: pointer;
      line-height: 1;
      transition: color 0.2s;
    }
    .close-cart-btn:hover {
      color: var(--text-main);
    }
    .cart-items {
      flex-grow: 1;
      overflow-y: auto;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .cart-empty {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      color: var(--text-secondary);
      gap: 16px;
    }
    .empty-icon {
      color: rgba(255, 255, 255, 0.15);
    }
    .btn-small {
      padding: 8px 16px;
      font-size: 0.9rem;
    }
    .cart-item {
      display: flex;
      align-items: center;
      gap: 14px;
      background-color: var(--bg-surface);
      padding: 12px;
      border-radius: var(--radius-sm);
      border: 1px solid rgba(255, 255, 255, 0.04);
    }
    .cart-item-img {
      width: 60px;
      height: 60px;
      object-fit: contain;
      background: #0f1115;
      border-radius: 6px;
      padding: 4px;
    }
    .cart-item-details {
      flex-grow: 1;
    }
    .cart-item-title {
      font-weight: 600;
      font-size: 0.95rem;
      color: var(--text-main);
      margin-bottom: 2px;
    }
    .cart-item-variant {
      font-size: 0.8rem;
      color: var(--text-secondary);
      margin-bottom: 8px;
    }
    .cart-item-price-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .qty-controls {
      display: flex;
      align-items: center;
      background-color: rgba(0, 0, 0, 0.3);
      border-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .qty-btn {
      background: none;
      border: none;
      color: var(--text-main);
      width: 24px;
      height: 24px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      transition: background-color 0.2s;
    }
    .qty-btn:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: var(--primary-accent);
    }
    .qty-value {
      font-size: 0.85rem;
      font-weight: 600;
      padding: 0 8px;
    }
    .cart-item-price {
      font-weight: 700;
      color: var(--primary-accent);
      font-size: 0.95rem;
    }
    .no-price {
      font-size: 0.8rem;
      color: var(--text-secondary);
      font-weight: 400;
    }
    .remove-item-btn {
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.3);
      cursor: pointer;
      padding: 6px;
      border-radius: 4px;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .remove-item-btn:hover {
      color: #ff4d4d;
      background-color: rgba(255, 77, 77, 0.1);
    }
    .cart-footer {
      padding: 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      background-color: #161920;
    }
    .cart-summary {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      font-size: 1.1rem;
      font-weight: 600;
    }
    .cart-total-price {
      color: var(--primary-accent);
      font-size: 1.3rem;
      font-weight: 800;
    }
    .btn-checkout {
      width: 100%;
      background-color: #25d366;
      color: #ffffff;
      border: none;
      padding: 14px;
      border-radius: var(--radius-sm);
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      transition: all var(--transition-speed);
      font-family: inherit;
    }
    .btn-checkout:hover:not(:disabled) {
      background-color: #20ba59;
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
    }
    .btn-checkout:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
    .btn-cta {
      background-color: var(--primary-accent);
      color: var(--bg-dark);
      border: none;
      padding: 12px 24px;
      border-radius: var(--radius-sm);
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
      transition: background-color var(--transition-speed);
    }
    .btn-cta:hover {
      background-color: var(--primary-hover);
    }
  `]
})
export class CartDrawerComponent {
  cartService = inject(CartService);
  private router = inject(Router);

  closeCart(): void {
    this.cartService.closeDrawer();
  }

  updateQuantity(index: number, change: number): void {
    this.cartService.updateQuantity(index, change);
  }

  removeItem(index: number): void {
    this.cartService.removeItem(index);
  }

  startShopping(): void {
    this.closeCart();
    this.router.navigate(['/productos']);
  }

  checkout(): void {
    const url = this.cartService.getWhatsAppCheckoutUrl();
    if (url) {
      window.open(url, '_blank');
    }
  }
}
