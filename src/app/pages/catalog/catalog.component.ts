import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { CustomDropdownComponent, DropdownOption } from '../../components/custom-dropdown/custom-dropdown.component';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent, CustomDropdownComponent],
  template: `
    <div class="view-products">
      <div class="container">
        <header class="products-header">
          <h2>Catálogo de Productos</h2>
          <p>Encuentra todo lo que necesitas para tu entrenamiento</p>
        </header>

        <div class="filters-container">
          <p class="filters-hint">¿Buscás algo en particular? Filtrá por marca, categoría o busca por nombre.</p>

          <div class="search-bar-row">
            <div class="search-input-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text" 
                placeholder="Buscar por producto, sabor o tamaño..." 
                [ngModel]="productService.searchQuery()"
                (ngModelChange)="onSearchChange($event)"
                class="search-input"
              >
              @if (productService.searchQuery()) {
                <button type="button" class="clear-search-btn" (click)="clearSearch()">✕</button>
              }
            </div>
          </div>

          <div class="dropdowns-row">
            <!-- Brand Dropdown -->
            <app-custom-dropdown
              label="Marca"
              [options]="brandOptions"
              [activeValue]="productService.selectedBrand()"
              (selected)="onBrandSelect($event)"
            ></app-custom-dropdown>

            <!-- Category Dropdown -->
            <app-custom-dropdown
              label="Categoría"
              [options]="categoryOptions"
              [activeValue]="productService.selectedCategory()"
              (selected)="onCategorySelect($event)"
            ></app-custom-dropdown>
          </div>
        </div>

        <!-- Products Grid -->
        @if (productService.filteredProducts().length > 0) {
          <div class="products-grid catalog-mode">
            @for (product of productService.filteredProducts(); track product.id) {
              <app-product-card [product]="product"></app-product-card>
            }
          </div>
        } @else {
          <div class="no-results">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="no-results-icon">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
            <p>No se encontraron productos con estos filtros.</p>
            <button type="button" class="btn-cta btn-small" (click)="resetFilters()">
              Restablecer filtros
            </button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .view-products {
      padding: 40px 0 80px;
    }
    .products-header {
      text-align: center;
      margin-bottom: 30px;
    }
    .products-header h2 {
      font-size: 2.2rem;
      font-weight: 800;
      margin-bottom: 8px;
      background: linear-gradient(135deg, #ffffff 0%, var(--primary-accent) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .products-header p {
      color: var(--text-secondary);
      font-size: 1.1rem;
    }
    .filters-container {
      margin-bottom: 35px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
    .filters-hint {
      color: var(--text-secondary);
      font-size: 0.9rem;
      text-align: center;
    }
    .search-bar-row {
      width: 100%;
      max-width: 580px;
    }
    .search-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
    }
    .search-icon {
      position: absolute;
      left: 16px;
      color: var(--text-secondary);
      pointer-events: none;
    }
    .search-input {
      width: 100%;
      background: rgba(26, 29, 36, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: var(--radius-md);
      padding: 12px 42px 12px 44px;
      color: var(--text-main);
      font-family: inherit;
      font-size: 0.95rem;
      outline: none;
      transition: all 0.3s ease;
      backdrop-filter: blur(12px);
    }
    .search-input:focus {
      border-color: var(--primary-accent);
      box-shadow: 0 0 15px rgba(109, 214, 35, 0.2);
      background: rgba(35, 39, 48, 0.9);
    }
    .clear-search-btn {
      position: absolute;
      right: 14px;
      background: none;
      border: none;
      color: var(--text-secondary);
      font-size: 1rem;
      cursor: pointer;
      padding: 4px;
      border-radius: 50%;
    }
    .clear-search-btn:hover {
      color: var(--text-main);
    }
    .dropdowns-row {
      display: flex;
      justify-content: center;
      gap: 20px;
      width: 100%;
      max-width: 580px;
    }
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 360px));
      justify-content: center;
      gap: 28px;
    }
    .no-results {
      text-align: center;
      padding: 60px 20px;
      background: var(--bg-surface);
      border-radius: var(--radius-md);
      border: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      color: var(--text-secondary);
    }
    .no-results-icon {
      color: rgba(255, 255, 255, 0.2);
    }
    .btn-cta {
      background-color: var(--primary-accent);
      color: var(--bg-dark);
      border: none;
      padding: 10px 20px;
      border-radius: var(--radius-sm);
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
    }
    .btn-cta:hover {
      background-color: var(--primary-hover);
    }
    @media (max-width: 600px) {
      .dropdowns-row {
        flex-direction: column;
        align-items: center;
      }
    }
  `]
})
export class CatalogComponent {
  productService = inject(ProductService);

  brandOptions: DropdownOption[] = [
    { value: 'all', label: 'Todas las marcas' },
    { value: 'Star Nutrition', label: 'Star Nutrition', img: 'assets/img/Logos/logo-STARNUTRITION.webp' }, 
    { value: 'Body Advance', label: 'Body Advance', img: 'assets/img/Logos/body-advance-logo.png' }
  ];

  categoryOptions: DropdownOption[] = [
    { value: 'all', label: 'Todas las categorías' },
    { value: 'proteina', label: '💪 Proteínas' },
    { value: 'creatina', label: '🔬 Creatinas' },
    { value: 'aminoacidos', label: '🔗 Aminoácidos' },
    { value: 'energia', label: '⚡ Energía / Pre-entreno' },
    { value: 'salud', label: '🫀 Salud / Bienestar' },
    { value: 'accesorios', label: '🎽 Accesorios' }
  ];

  onBrandSelect(brand: string): void {
    this.productService.setBrandFilter(brand);
  }

  onCategorySelect(category: string): void {
    this.productService.setCategoryFilter(category);
  }

  onSearchChange(query: string): void {
    this.productService.setSearchQuery(query);
  }

  clearSearch(): void {
    this.productService.setSearchQuery('');
  }

  resetFilters(): void {
    this.productService.setBrandFilter('all');
    this.productService.setCategoryFilter('all');
    this.productService.setSearchQuery('');
  }
}
