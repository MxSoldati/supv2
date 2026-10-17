import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DEFAULT_OBJECTIVES } from '../../data/default-objectives';
import { Objective } from '../../models/objective.model';

@Component({
  selector: 'app-objective-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="view-objective">
      <div class="container">
        <button type="button" class="btn-back" (click)="goBack()">
          <span class="icon">←</span> Volver a objetivos
        </button>

        @if (objective) {
          <div class="objective-content">
            <div class="objective-header">
              <h2>{{ objective.title }}</h2>
            </div>

            <div class="objective-problem">
              <p><strong>El problema:</strong> {{ objective.problem }}</p>
            </div>

            <div class="objective-offer">
              <h3>¿Qué suplementos ayudan a esto?</h3>
              <ul class="sup-list">
                @for (sup of objective.supplements; track sup.name) {
                  <li class="sup-item">
                    <strong>✓ {{ sup.name }}:</strong> {{ sup.description }}
                  </li>
                }
              </ul>
            </div>

            <div class="objective-combo">
              <div class="combo-badge">Combo Recomendado</div>
              <h3>{{ objective.combo.name }}</h3>
              <p class="combo-desc"><strong>Incluye:</strong> {{ objective.combo.desc }}</p>
              <p class="combo-explanation">{{ objective.combo.explanation }}</p>
              
              <a 
                [href]="getComboWhatsAppUrl(objective.combo.name)" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="btn-cta"
              >
                Quiero este combo
              </a>
            </div>
          </div>
        } @else {
          <div class="not-found">
            <h2>Objetivo no encontrado</h2>
            <button type="button" class="btn-cta" (click)="goBack()">Volver al inicio</button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .view-objective {
      padding: 40px 0 80px;
    }
    .btn-back {
      background: none;
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: var(--text-secondary);
      padding: 10px 18px;
      border-radius: var(--radius-sm);
      cursor: pointer;
      font-weight: 600;
      font-size: 0.95rem;
      margin-bottom: 30px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all var(--transition-speed);
      font-family: inherit;
    }
    .btn-back:hover {
      background-color: rgba(255, 255, 255, 0.05);
      color: var(--text-main);
      border-color: var(--primary-accent);
      transform: translateX(-4px);
    }
    .objective-content {
      background: var(--bg-surface);
      border-radius: var(--radius-lg);
      padding: 40px;
      border: 1px solid rgba(255, 255, 255, 0.05);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
      max-width: 900px;
      margin: 0 auto;
    }
    .objective-header h2 {
      font-size: 2.2rem;
      font-weight: 800;
      margin-bottom: 24px;
      color: var(--primary-accent);
    }
    .objective-problem {
      background: rgba(0, 0, 0, 0.2);
      border-left: 4px solid var(--primary-accent);
      padding: 20px;
      border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
      margin-bottom: 32px;
      font-size: 1.1rem;
      line-height: 1.6;
    }
    .objective-offer {
      margin-bottom: 40px;
    }
    .objective-offer h3 {
      font-size: 1.4rem;
      font-weight: 700;
      margin-bottom: 20px;
      color: var(--text-main);
    }
    .sup-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .sup-item {
      background: rgba(255, 255, 255, 0.02);
      padding: 16px 20px;
      border-radius: var(--radius-sm);
      border: 1px solid rgba(255, 255, 255, 0.04);
      line-height: 1.5;
    }
    .sup-item strong {
      color: var(--primary-accent);
    }
    .objective-combo {
      background: linear-gradient(135deg, #1c212a 0%, #15181e 100%);
      border: 2px solid var(--primary-accent);
      border-radius: var(--radius-md);
      padding: 32px;
      position: relative;
      box-shadow: 0 10px 30px rgba(109, 214, 35, 0.15);
      text-align: center;
    }
    .combo-badge {
      position: absolute;
      top: -14px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--primary-accent);
      color: var(--bg-dark);
      font-weight: 800;
      font-size: 0.85rem;
      text-transform: uppercase;
      padding: 4px 16px;
      border-radius: 20px;
      letter-spacing: 1px;
    }
    .objective-combo h3 {
      font-size: 1.6rem;
      font-weight: 800;
      margin-top: 10px;
      margin-bottom: 12px;
      color: var(--text-main);
    }
    .combo-desc {
      font-size: 1.1rem;
      color: var(--primary-accent);
      margin-bottom: 16px;
    }
    .combo-explanation {
      color: var(--text-secondary);
      margin-bottom: 24px;
      max-width: 650px;
      margin-left: auto;
      margin-right: auto;
      line-height: 1.6;
    }
    .btn-cta {
      display: inline-block;
      background-color: var(--primary-accent);
      color: var(--bg-dark);
      text-decoration: none;
      padding: 14px 32px;
      border-radius: var(--radius-sm);
      font-weight: 700;
      font-size: 1rem;
      transition: all var(--transition-speed);
      border: none;
      cursor: pointer;
      font-family: inherit;
    }
    .btn-cta:hover {
      background-color: var(--primary-hover);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(109, 214, 35, 0.4);
    }
    .not-found {
      text-align: center;
      padding: 60px 0;
      color: var(--text-secondary);
    }
    @media (max-width: 768px) {
      .objective-content {
        padding: 24px;
      }
      .objective-header h2 {
        font-size: 1.8rem;
      }
      .objective-combo {
        padding: 24px;
      }
    }
  `]
})
export class ObjectiveDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  objective: Objective | null = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id') || '';
      this.objective = DEFAULT_OBJECTIVES[id] || null;
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  getComboWhatsAppUrl(comboName: string): string {
    const text = `¡Hola, equipo de Suplemental! 👋 Estoy interesado en el *${comboName}*. ¿Me podrían brindar más información al respecto? ¡Muchas gracias!`;
    return `https://wa.me/5492615126087?text=${encodeURIComponent(text)}`;
  }
}
