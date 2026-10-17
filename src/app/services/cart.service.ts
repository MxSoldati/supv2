import { Injectable, computed, signal } from '@angular/core';
import { CartItem } from '../models/cart.model';
import { Product, ProductVariant } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'suplemental_cart';
  private readonly WHATSAPP_PHONE = '5492615126087';

  cartItems = signal<CartItem[]>(this.loadInitialCart());
  isDrawerOpen = signal<boolean>(false);

  totalItems = computed(() => {
    return this.cartItems().reduce((acc, item) => acc + item.quantity, 0);
  });

  totalPrice = computed(() => {
    return this.cartItems().reduce((acc, item) => {
      const price = item.variant.price || 0;
      return acc + (price * item.quantity);
    }, 0);
  });

  hasUnpricedItems = computed(() => {
    return this.cartItems().some(item => !item.variant.price);
  });

  private loadInitialCart(): CartItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error loading cart from storage:', e);
    }
    return [];
  }

  private persistCart(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.cartItems()));
    }
  }

  openDrawer(): void {
    this.isDrawerOpen.set(true);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }

  closeDrawer(): void {
    this.isDrawerOpen.set(false);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }

  toggleDrawer(): void {
    if (this.isDrawerOpen()) {
      this.closeDrawer();
    } else {
      this.openDrawer();
    }
  }

  addItem(product: Product, variant: ProductVariant, image?: string): void {
    const current = [...this.cartItems()];
    const imgPath = image || variant.image || `assets/img/todas/${variant.code}.webp`;
    
    const existingIndex = current.findIndex(
      item => item.product.id === product.id && item.variant.code === variant.code
    );

    if (existingIndex > -1) {
      current[existingIndex].quantity += 1;
    } else {
      current.push({
        product,
        variant,
        image: imgPath,
        quantity: 1
      });
    }

    this.cartItems.set(current);
    this.persistCart();
    this.openDrawer();
  }

  updateQuantity(index: number, change: number): void {
    const current = [...this.cartItems()];
    if (current[index]) {
      current[index].quantity += change;
      if (current[index].quantity <= 0) {
        current.splice(index, 1);
      }
      this.cartItems.set(current);
      this.persistCart();
    }
  }

  removeItem(index: number): void {
    const current = [...this.cartItems()];
    if (current[index]) {
      current.splice(index, 1);
      this.cartItems.set(current);
      this.persistCart();
    }
  }

  clearCart(): void {
    this.cartItems.set([]);
    this.persistCart();
  }

  getWhatsAppCheckoutUrl(): string {
    const items = this.cartItems();
    if (items.length === 0) return '';

    let message = `¡Hola, equipo de Suplemental! 👋\nQuiero realizar el siguiente pedido:\n\n`;
    let total = 0;
    let hasUnpriced = false;

    items.forEach(item => {
      const priceVal = item.variant.price ? item.variant.price * item.quantity : 0;
      total += priceVal;
      if (!item.variant.price) hasUnpriced = true;

      const priceStr = item.variant.price 
        ? `$${priceVal.toLocaleString('es-AR')}` 
        : `A consultar`;
        
      message += `- ${item.quantity}x ${item.variant.originalName || (item.product.name + ' ' + item.variant.size)} (${priceStr})\n`;
    });

    message += `\n`;
    const totalDisplay = total > 0 ? `$${total.toLocaleString('es-AR')}` : '';
    const unpricedDisplay = hasUnpriced ? (total > 0 ? ' (+ productos a consultar)' : 'A consultar') : '';
    message += `*Total estimado:* ${totalDisplay}${unpricedDisplay}\n\n`;
    message += `¿Me podrían brindar más información sobre los medios de pago y el envío? ¡Muchas gracias!`;

    return `https://wa.me/${this.WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
  }
}
