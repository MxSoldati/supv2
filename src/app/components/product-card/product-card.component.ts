import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product, ProductVariant } from '../../models/product.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="product-card grouped">
      <div class="product-img-wrapper">
        <img 
          [src]="currentImage" 
          [alt]="product.name" 
          class="product-photo img-appear" 
          loading="lazy"
        >
      </div>

      <div class="product-info">
        <div class="brand-row">
          <img src="assets/img/Logos/logo sup.webp" alt="" class="card-brand-logo" aria-hidden="true">
          <span class="brand">{{ product.brand }}</span>
        </div>

        <h3 class="product-title">{{ product.name }}</h3>

        <div class="variant-selectors">
          <!-- Size Selector -->
          @if (allSizes.length > 1 || (allSizes.length === 1 && allSizes[0] !== 'Único')) {
            <div class="selector-group">
              <span class="selector-label">Tamaño:</span>
              <div class="chips-row">
                @for (size of allSizes; track size) {
                  <button 
                    type="button"
                    class="chip chip-size" 
                    [class.active]="size === selectedSize"
                    (click)="selectSize(size)"
                  >
                    {{ size }}
                  </button>
                }
              </div>
            </div>
          }

          <!-- Flavor Selector -->
          @if (allFlavors.length > 1 || (allFlavors.length === 1 && allFlavors[0] !== 'Único')) {
            <div class="selector-group">
              <span class="selector-label">Sabor:</span>
              <div class="chips-row">
                @for (flavor of allFlavors; track flavor) {
                  <button 
                    type="button"
                    class="chip chip-flavor" 
                    [class.active]="flavor === selectedFlavor"
                    [class.disabled]="!isFlavorAvailableForSize(flavor)"
                    [style.border-bottom]="flavor === selectedFlavor ? 'none' : '3px solid ' + getFlavorColor(flavor)"
                    [style.box-shadow]="flavor === selectedFlavor ? '0 0 10px ' + getFlavorColor(flavor) + '80' : 'none'"
                    [style.background-color]="flavor === selectedFlavor ? getFlavorColor(flavor) + '20' : 'rgba(255, 255, 255, 0.04)'"
                    [style.border-color]="flavor === selectedFlavor ? getFlavorColor(flavor) : 'rgba(255, 255, 255, 0.1)'"
                    (click)="selectFlavor(flavor)"
                  >
                    {{ flavor }}
                  </button>
                }
              </div>
            </div>
          }
        </div>

        <p class="variant-name">{{ currentVariant.originalName }}</p>
        
        <div class="price-row">
          <p class="price">{{ formattedPrice }}</p>
        </div>

        <button type="button" class="btn-buy btn-add-cart" (click)="onAddToCart()">
          Agregar al Carrito
        </button>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      width: 100%;
      max-width: 360px;
      margin: 0 auto;
      background: var(--bg-surface);
      border-radius: var(--radius-md);
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.06);
      transition: transform var(--transition-speed), box-shadow var(--transition-speed), border-color var(--transition-speed);
      display: flex;
      flex-direction: column;
      position: relative;
    }
    .product-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 14px 35px rgba(0, 0, 0, 0.5), 0 0 20px rgba(34, 197, 94, 0.12);
      border-color: rgba(34, 197, 94, 0.35);
    }
    .product-img-wrapper {
      position: relative;
      background: transparent;
      padding: 20px;
      min-height: 240px;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
    }
    .product-photo {
      max-height: 220px;
      max-width: 100%;
      object-fit: contain;
      background: transparent;
      filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.45));
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .product-card:hover .product-photo {
      transform: scale(1.06);
    }
    .product-info {
      padding: 20px;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.15) 100%);
    }
    .brand-row {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 6px;
    }
    .card-brand-logo {
      width: 16px;
      height: 16px;
      object-fit: contain;
      opacity: 0.9;
    }
    .brand {
      color: #9ba1a6;
      font-size: 0.85rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }
    .product-title {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 14px;
      color: var(--text-main);
      line-height: 1.3;
    }
    .variant-selectors {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 14px;
    }
    .selector-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .selector-label {
      font-size: 0.75rem;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
    }
    .chips-row {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .chip {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: var(--text-secondary);
      padding: 4px 12px;
      border-radius: 999px;
      font-size: 0.82rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.25s ease;
      font-family: inherit;
    }
    .chip:not(.disabled):hover {
      border-color: rgba(255, 255, 255, 0.35);
      color: var(--text-main);
      transform: translateY(-1px);
    }
    .chip.chip-size.active {
      background: rgba(34, 197, 94, 0.15);
      border-color: #22c55e;
      color: #22c55e;
      font-weight: 600;
      box-shadow: 0 0 10px rgba(34, 197, 94, 0.3);
    }
    .chip.chip-flavor {
      border-radius: 999px;
      padding: 4px 12px;
    }
    .chip.disabled {
      opacity: 0.25;
      cursor: not-allowed;
      text-decoration: line-through;
    }
    .variant-name {
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin-bottom: 10px;
      min-height: 20px;
      line-height: 1.3;
    }
    .price-row {
      display: flex;
      align-items: baseline;
      margin-bottom: 16px;
      margin-top: auto;
    }
    .price {
      font-size: 1.45rem;
      font-weight: 800;
      color: #22c55e;
      letter-spacing: -0.5px;
    }
    .btn-buy {
      background: rgba(15, 23, 21, 0.7);
      border: 1.5px solid #22c55e;
      color: #22c55e;
      text-transform: uppercase;
      font-weight: 700;
      border-radius: 10px;
      padding: 12px;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all var(--transition-speed) ease;
      width: 100%;
      text-align: center;
      font-family: inherit;
      letter-spacing: 0.8px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(8px);
    }
    .btn-buy:hover {
      background: rgba(34, 197, 94, 0.15);
      box-shadow: 0 0 15px rgba(34, 197, 94, 0.25);
      transform: translateY(-2px);
    }
    .btn-buy:active {
      transform: translateY(0);
    }
  `]
})
export class ProductCardComponent implements OnInit {
  @Input({ required: true }) product!: Product;

  private cartService = inject(CartService);

  selectedSize: string = 'Único';
  selectedFlavor: string = 'Único';

  private flavorColors: Record<string, string> = {
    'Vainilla': '#f3e5ab',
    'Chocolate': '#7b3f00',
    'Cookies': '#d2b48c',
    'Frutilla': '#ffb6c1',
    'Neutro': '#e2e2e2',
    'Frutos Rojos': '#ff4040',
    'Limón': '#fffacd',
    'Sandía': '#ff7f50',
    'Acai': '#8a2be2',
    'Uva': '#9370db',
    'Melón': '#98fb98'
  };

  ngOnInit(): void {
    if (this.product && this.product.variants && this.product.variants.length > 0) {
      const defaultVar = this.product.variants[0];
      this.selectedSize = defaultVar.size;
      this.selectedFlavor = defaultVar.flavor;
    }
  }

  get allSizes(): string[] {
    return [...new Set(this.product.variants.map(v => v.size))];
  }

  get allFlavors(): string[] {
    return [...new Set(this.product.variants.map(v => v.flavor))];
  }

  get currentVariant(): ProductVariant {
    const found = this.product.variants.find(
      v => v.size === this.selectedSize && v.flavor === this.selectedFlavor
    );
    if (found) return found;

    const sizeMatch = this.product.variants.find(v => v.size === this.selectedSize);
    if (sizeMatch) return sizeMatch;

    return this.product.variants[0] || {
      code: 'N/A',
      size: 'Único',
      flavor: 'Único',
      price: null,
      originalName: this.product.name,
      image: 'assets/img/todas/A001.webp'
    };
  }

  get currentImage(): string {
    const variant = this.currentVariant;
    if (variant && variant.image) {
      return variant.image;
    }
    return `assets/img/todas/${variant.code}.webp`;
  }

  get formattedPrice(): string {
    const price = this.currentVariant.price;
    if (price === null || price === undefined) {
      return 'Consultar precio';
    }
    return '$' + price.toLocaleString('es-AR');
  }

  getFlavorColor(flavor: string): string {
    return this.flavorColors[flavor] || '#22c55e';
  }

  isFlavorAvailableForSize(flavor: string): boolean {
    return this.product.variants.some(
      v => v.size === this.selectedSize && v.flavor === flavor
    );
  }

  selectSize(size: string): void {
    this.selectedSize = size;
    const availableFlavors = this.product.variants
      .filter(v => v.size === size)
      .map(v => v.flavor);

    if (!availableFlavors.includes(this.selectedFlavor) && availableFlavors.length > 0) {
      this.selectedFlavor = availableFlavors[0];
    }
  }

  selectFlavor(flavor: string): void {
    if (!this.isFlavorAvailableForSize(flavor)) return;
    this.selectedFlavor = flavor;
  }

  onAddToCart(): void {
    this.cartService.addItem(this.product, this.currentVariant, this.currentImage);
  }
}
