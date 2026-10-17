import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  template: `
    <div class="view-home">
      <!-- HERO -->
      <header class="hero">
        <div class="container">
          <div class="hero-logo-wrapper">
            <img src="assets/img/Logos/logo sup.webp" alt="Suplemental Logo" class="hero-logo">
          </div>
          <h1 class="hero-title">¿Qué objetivo querés lograr?</h1>
          <p class="hero-subtitle">En Suplemental te ayudamos a elegir los suplementos correctos según tu objetivo.</p>
        </div>
      </header>

      <!-- OBJECTIVES SECTION -->
      <section class="objectives-section">
        <div class="container">
          <div class="objectives-grid">
            <button type="button" class="card-objective" (click)="goToObjective('masa')">
              <div class="card-content">
                <h3>Aumentar masa muscular</h3>
                <div class="card-arrow">→</div>
              </div>
            </button>
            <button type="button" class="card-objective" (click)="goToObjective('definicion')">
              <div class="card-content">
                <h3>Definición / quema de grasa</h3>
                <div class="card-arrow">→</div>
              </div>
            </button>
            <button type="button" class="card-objective" (click)="goToObjective('energia')">
              <div class="card-content">
                <h3>Energía y rendimiento</h3>
                <div class="card-arrow">→</div>
              </div>
            </button>
            <button type="button" class="card-objective" (click)="goToObjective('recuperacion')">
              <div class="card-content">
                <h3>Recuperación y descanso</h3>
                <div class="card-arrow">→</div>
              </div>
            </button>
            <button type="button" class="card-objective" (click)="goToObjective('salud')">
              <div class="card-content">
                <h3>Salud y bienestar</h3>
                <div class="card-arrow">→</div>
              </div>
            </button>
          </div>
        </div>
      </section>

      <!-- SHOWCASE PRODUCTS -->
      <section class="products-showcase">
        <div class="container">
          <h2 class="showcase-title">Productos Destacados</h2>
          <div class="products-grid">
            @for (prod of showcaseProducts; track prod.id) {
              <app-product-card [product]="prod"></app-product-card>
            }
          </div>

          <div class="showcase-cta-wrapper">
            <a routerLink="/productos" class="btn-cta">Ver todos los productos</a>
          </div>
        </div>
      </section>

      <!-- BRAND CONCEPT -->
      <section class="concept-section">
        <div class="container">
          <h2 class="concept-message">
            "En Suplemental no vendemos suplementos al azar, te ayudamos a elegir lo que realmente necesitás según tu objetivo."
          </h2>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .hero {
      text-align: center;
      padding: 60px 0 40px;
    }
    .hero-logo-wrapper {
      margin-bottom: 24px;
      display: flex;
      justify-content: center;
    }
    .hero-logo {
      height: 120px;
      width: auto;
      object-fit: contain;
      filter: drop-shadow(0 0 20px rgba(109, 214, 35, 0.3));
      animation: float 6s ease-in-out infinite;
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-8px); }
    }
    .hero-title {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 16px;
      line-height: 1.2;
      background: linear-gradient(135deg, #ffffff 0%, var(--primary-accent) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero-subtitle {
      font-size: 1.15rem;
      color: var(--text-secondary);
      max-width: 600px;
      margin: 0 auto;
    }
    .objectives-section {
      padding: 30px 0 60px;
    }
    .objectives-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
    }
    .card-objective {
      background: var(--bg-surface);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: var(--radius-md);
      padding: 30px 24px;
      text-align: left;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: all var(--transition-speed);
      color: var(--text-main);
      font-family: inherit;
    }
    .card-objective::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: var(--primary-accent);
      transform: scaleX(0);
      transform-origin: right;
      transition: transform var(--transition-speed);
    }
    .card-objective:hover {
      background: var(--bg-surface-hover);
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4), 0 0 15px rgba(109, 214, 35, 0.15);
      border-color: rgba(109, 214, 35, 0.3);
    }
    .card-objective:hover::after {
      transform: scaleX(1);
      transform-origin: left;
    }
    .card-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .card-content h3 {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-main);
    }
    .card-arrow {
      font-size: 1.5rem;
      color: var(--primary-accent);
      transition: transform var(--transition-speed);
    }
    .card-objective:hover .card-arrow {
      transform: translateX(5px);
    }
    .products-showcase {
      padding: 40px 0 60px;
    }
    .showcase-title {
      font-size: 2rem;
      font-weight: 800;
      text-align: center;
      margin-bottom: 40px;
      background: linear-gradient(135deg, #ffffff 0%, var(--primary-accent) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .products-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(320px, 420px));
      justify-content: center;
      gap: 2.5rem;
    }
    .showcase-cta-wrapper {
      text-align: center;
      margin-top: 40px;
    }
    .btn-cta {
      display: inline-block;
      background-color: var(--primary-accent);
      color: var(--bg-dark);
      text-decoration: none;
      padding: 14px 28px;
      border-radius: var(--radius-sm);
      font-weight: 700;
      font-size: 1rem;
      transition: all var(--transition-speed);
      letter-spacing: 0.5px;
    }
    .btn-cta:hover {
      background-color: var(--primary-hover);
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(109, 214, 35, 0.4);
    }
    .concept-section {
      padding: 60px 0;
      text-align: center;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      background: rgba(26, 29, 36, 0.3);
    }
    .concept-message {
      font-size: 1.35rem;
      font-weight: 500;
      font-style: italic;
      color: var(--text-main);
      max-width: 800px;
      margin: 0 auto;
      line-height: 1.6;
    }
    @media (max-width: 768px) {
      .hero-title {
        font-size: 2rem;
      }
      .concept-message {
        font-size: 1.15rem;
      }
      .products-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
    }
  `]
})
export class HomeComponent {
  private router = inject(Router);
  private productService = inject(ProductService);

  get showcaseProducts(): Product[] {
    const ids = ['star-whey', 'star-creatina', 'star-resveratrol', 'star-botella'];
    const all = this.productService.products();
    const found = ids.map(id => all.find(p => p.id === id)).filter((p): p is Product => !!p);
    return found.length > 0 ? found : all.slice(0, 4);
  }

  goToObjective(id: string): void {
    this.router.navigate(['/objetivo', id]);
  }
}
