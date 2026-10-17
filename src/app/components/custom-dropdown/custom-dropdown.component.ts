import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DropdownOption {
  value: string;
  label: string;
  img?: string;
}

@Component({
  selector: 'app-custom-dropdown',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="custom-dropdown" [class.open]="isOpen">
      <!-- Botón cerrado / disparador -->
      <button type="button" class="dropdown-toggle" (click)="toggleDropdown($event)">
        <span class="dropdown-label" *ngIf="label">{{ label }}</span>
        <div class="selected-view">
          @if (selectedOption?.img) {
            <img [src]="selectedOption?.img" [alt]="selectedOption?.label" class="brand-logo-img toggle-img">
          } @else {
            <span class="dropdown-value" [class.highlight]="isAllSelected">{{ displayValue }}</span>
          }
        </div>
        <span class="dropdown-arrow">▾</span>
      </button>

      <!-- Menú desplegable -->
      <div class="dropdown-menu">
        @for (opt of options; track opt.value) {
          <button 
            type="button" 
            class="dropdown-item" 
            [class.active]="opt.value === activeValue"
            (click)="selectOption(opt, $event)"
          >
            @if (opt.img) {
              <img [src]="opt.img" [alt]="opt.label" class="brand-logo-img">
            } @else {
              <span class="item-text-green">{{ opt.label }}</span>
            }
          </button>
        }
      </div>
    </div>
  `,
  styles: [`
    .custom-dropdown {
      position: relative;
      width: 100%;
      max-width: 320px;
      user-select: none;
    }

    /* --- Botón cerrado --- */
    .dropdown-toggle {
      width: 100%;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #11141a;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      padding: 0 16px;
      color: #e2e8f0;
      font-family: inherit;
      cursor: pointer;
      transition: border-color 0.2s ease, background-color 0.2s ease;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
    }

    .dropdown-toggle:hover {
      background: #161a22;
      border-color: rgba(34, 197, 94, 0.35);
    }

    .custom-dropdown.open .dropdown-toggle {
      border-color: #22c55e;
      background: #161a22;
    }

    .dropdown-label {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #64748b;
      margin-right: 10px;
    }

    .selected-view {
      flex: 1;
      display: flex;
      align-items: center;
      text-align: left;
    }

    .dropdown-value {
      font-weight: 600;
      font-size: 0.95rem;
      color: #e2e8f0;
    }

    .dropdown-value.highlight {
      color: #22c55e;
      font-weight: 700;
    }

    .toggle-img {
      max-height: 20px;
    }

    .dropdown-arrow {
      font-size: 0.85rem;
      color: #94a3b8;
      transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      margin-left: 8px;
    }

    .custom-dropdown.open .dropdown-arrow {
      transform: rotate(180deg);
      color: #22c55e;
    }

    /* --- Menú desplegable idéntico a la referencia --- */
    .dropdown-menu {
      position: absolute;
      top: calc(100% + 6px);
      left: 0;
      width: 100%;
      background: #101319;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      padding: 0;
      z-index: 60;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-6px);
      transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;
      box-shadow: 0 14px 30px rgba(0, 0, 0, 0.65);
      overflow: hidden;
    }

    .custom-dropdown.open .dropdown-menu {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    /* Cada opción en fila con línea divisoria */
    .dropdown-item {
      width: 100%;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 0 18px;
      background: transparent;
      border: none;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      cursor: pointer;
      transition: background-color 0.2s ease;
      text-align: left;
    }

    .dropdown-item:last-child {
      border-bottom: none;
    }

    .dropdown-item:hover {
      background: rgba(255, 255, 255, 0.04);
    }

    .dropdown-item.active {
      background: rgba(34, 197, 94, 0.08);
    }

    /* Texto "Todas" en verde neón */
    .item-text-green {
      color: #22c55e;
      font-weight: 700;
      font-size: 0.95rem;
      letter-spacing: 0.2px;
    }

    /* Logos en blanco nítido y tamaño uniforme */
    .brand-logo-img {
      height: 20px;
      max-width: 140px;
      object-fit: contain;
      filter: brightness(0) invert(1);
      opacity: 0.92;
      transition: opacity 0.2s ease;
    }

    .dropdown-item:hover .brand-logo-img {
      opacity: 1;
    }
  `]
})
export class CustomDropdownComponent {
  @Input() label: string = '';
  @Input() options: DropdownOption[] = [];
  @Input() activeValue: string = 'all';
  @Output() selected = new EventEmitter<string>();

  isOpen = false;

  constructor(private elementRef: ElementRef) {}

  get selectedOption(): DropdownOption | undefined {
    return this.options.find(o => o.value === this.activeValue);
  }

  get isAllSelected(): boolean {
    return this.activeValue === 'all' || this.activeValue === 'Todas' || !this.selectedOption?.img;
  }

  get displayValue(): string {
    return this.selectedOption ? this.selectedOption.label : 'Todas';
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.isOpen = !this.isOpen;
  }

  selectOption(option: DropdownOption, event: Event): void {
    event.stopPropagation();
    this.isOpen = false;
    this.selected.emit(option.value);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
}