import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { Product, ProductVariant, ProductCategory } from '../../models/product.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-wrapper">
      <div class="container">

        <!-- 1. PANTALLA DE ACCESO MINIMALISTA (LOGIN CON CONTRASEÑA MAESTRA) -->
        @if (!authService.isAuthenticated()) {
          <div class="login-card-container">
            <div class="login-card">
              <div class="login-icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lock-icon">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>

              <h2>Panel de Administración</h2>
              <p class="login-subtitle">Ingresa la contraseña maestra para editar el catálogo de Suplemental.</p>

              <form (submit)="onLogin($event)" class="login-form">
                <div class="form-group">
                  <label for="admin-password">Contraseña Maestra</label>
                  <input 
                    type="password" 
                    id="admin-password" 
                    [(ngModel)]="passwordInput" 
                    name="password"
                    placeholder="••••••••••••"
                    required
                    autofocus
                    class="form-control"
                  >
                </div>

                @if (loginError) {
                  <div class="alert alert-error">
                    {{ loginError }}
                  </div>
                }

                <button type="submit" class="btn-primary w-100">
                  Ingresar al Panel
                </button>
              </form>
            </div>
          </div>
        } 
        
        <!-- 2. DASHBOARD DE ADMINISTRACIÓN (AUTENTICADO) -->
        @else {
          <div class="admin-dashboard">
            <!-- Header Bar with Primary Actions Protagonists -->
            <header class="admin-header">
              <div class="admin-header-title">
                <span class="admin-badge">Admin Panel</span>
                <h1 class="admin-title">Gestión de Catálogo</h1>
                <p class="admin-subtitle">Administrá productos, precios, tamaños, sabores e importá/exportá planillas Excel.</p>
              </div>

              <!-- Main Hero Action Buttons -->
              <div class="admin-hero-actions">
                <button type="button" class="btn-hero btn-new-product" (click)="openNewProductModal()">
                  <span class="btn-icon-symbol">➕</span>
                  <span class="btn-label">Nuevo Producto</span>
                </button>

                <button type="button" class="btn-hero btn-excel-export" (click)="exportExcel()">
                  <span class="btn-icon-symbol">📊</span>
                  <span class="btn-label">Exportar Excel (.xlsx)</span>
                </button>

                <label class="btn-hero btn-excel-import file-upload-label">
                  <span class="btn-icon-symbol">📥</span>
                  <span class="btn-label">Importar Excel (.xlsx)</span>
                  <input type="file" (change)="onImportExcel($event)" accept=".xlsx, .xls" style="display: none;">
                </label>

                <button type="button" class="btn-logout" (click)="logout()" title="Cerrar sesión de administración">
                  🔒 Salir
                </button>
              </div>
            </header>

            <!-- Status Banners -->
            @if (productService.syncSuccessMessage()) {
              <div class="alert alert-success">
                <span>{{ productService.syncSuccessMessage() }}</span>
                <button type="button" class="close-alert" (click)="productService.syncSuccessMessage.set(null)">✕</button>
              </div>
            }

            @if (productService.syncError()) {
              <div class="alert alert-error">
                <span>{{ productService.syncError() }}</span>
                <button type="button" class="close-alert" (click)="productService.syncError.set(null)">✕</button>
              </div>
            }

            <!-- Secondary Compact Sync URL Section -->
            <section class="admin-card sync-compact-card">
              <div class="sync-compact-header">
                <div class="sync-compact-title">
                  <span class="sync-mini-tag">Cloud Sync</span>
                  <h4>Sincronización Remota (Google Sheets CSV / API)</h4>
                </div>
                @if (productService.lastSyncDate()) {
                  <span class="last-sync-badge">Última sinc: {{ productService.lastSyncDate() }}</span>
                }
              </div>

              <div class="sync-compact-row">
                <input 
                  type="url" 
                  [(ngModel)]="sheetUrlInput" 
                  placeholder="https://docs.google.com/spreadsheets/d/.../pub?output=csv" 
                  class="form-control form-control-sm flex-1"
                >
                <button 
                  type="button" 
                  class="btn-secondary btn-sm" 
                  [disabled]="productService.isSyncing()" 
                  (click)="syncFromUrl()"
                >
                  @if (productService.isSyncing()) {
                    <span class="spinner"></span> Sincronizando...
                  } @else {
                    🔄 Sincronizar Ahora
                  }
                </button>
              </div>
            </section>

            <!-- Catalog Search & Filter Controls -->
            <section class="admin-card">
              <div class="table-controls-row">
                <div class="search-box">
                  <input 
                    type="text" 
                    [(ngModel)]="adminSearchQuery" 
                    placeholder="Buscar por nombre, código, marca..." 
                    class="form-control"
                  >
                </div>

                <div class="table-stats">
                  <span>Total: <strong>{{ displayedProducts.length }}</strong> productos</span>
                  <button type="button" class="btn-ghost-danger btn-sm" (click)="confirmResetDefault()">
                    ⚠️ Restaurar Datos Originales
                  </button>
                </div>
              </div>

              <!-- Products Table -->
              <div class="table-responsive">
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>Img</th>
                      <th>Producto</th>
                      <th>Marca</th>
                      <th>Categoría</th>
                      <th>Variantes y Precios</th>
                      <th>Sabores</th>
                      <th class="text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (prod of displayedProducts; track prod.id) {
                      <tr>
                        <td class="col-img">
                          <img [src]="getProductThumbnail(prod)" [alt]="prod.name" class="table-thumb">
                        </td>
                        <td class="col-name">
                          <strong>{{ prod.name }}</strong>
                          <span class="product-id-sub">{{ prod.id }}</span>
                        </td>
                        <td>
                          <span class="badge badge-brand">{{ prod.brand }}</span>
                        </td>
                        <td>
                          <span class="badge badge-category">{{ prod.category }}</span>
                        </td>
                        <td class="col-variants">
                          <div class="variants-summary-list">
                            @for (v of prod.variants; track v.code) {
                              <span class="variant-pill">
                                <strong>{{ v.size }}:</strong> 
                                @if (v.price !== null) {
                                  \${{ v.price.toLocaleString('es-AR') }}
                                } @else {
                                  <em class="text-muted">Consultar</em>
                                }
                              </span>
                            }
                          </div>
                        </td>
                        <td class="col-flavors">
                          <div class="flavors-summary-list">
                            @for (flavor of getProductFlavors(prod); track flavor) {
                              <span class="flavor-mini-chip">{{ flavor }}</span>
                            }
                          </div>
                        </td>
                        <td class="col-actions text-right">
                          <button type="button" class="btn-icon btn-edit" (click)="editProduct(prod)" title="Editar producto">
                            ✏️ Editar
                          </button>
                          <button type="button" class="btn-icon btn-delete" (click)="deleteProduct(prod)" title="Eliminar producto">
                            🗑️
                          </button>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        }

        <!-- 3. MODAL / EDITOR DE PRODUCTO INTERACTIVO -->
        @if (isEditingModalOpen && currentEditingProduct) {
          <div class="modal-backdrop" (click)="closeEditorModal()">
            <div class="modal-dialog" (click)="$event.stopPropagation()">
              <div class="modal-header">
                <h2>{{ isNewProduct ? '➕ Agregar Nuevo Producto' : '✏️ Editar Producto: ' + currentEditingProduct.name }}</h2>
                <button type="button" class="close-modal-btn" (click)="closeEditorModal()">&times;</button>
              </div>

              <div class="modal-body">
                <!-- Row 1: Nombre, Marca, Categoría -->
                <div class="form-row-3">
                  <div class="form-group">
                    <label>Nombre del Producto *</label>
                    <input type="text" [(ngModel)]="currentEditingProduct.name" class="form-control" placeholder="Ej: Whey Protein">
                  </div>
                  <div class="form-group">
                    <label>Marca *</label>
                    <input type="text" [(ngModel)]="currentEditingProduct.brand" class="form-control" placeholder="Ej: Star Nutrition">
                  </div>
                  <div class="form-group">
                    <label>Categoría *</label>
                    <select [(ngModel)]="currentEditingProduct.category" class="form-control">
                      <option value="proteina">💪 Proteínas</option>
                      <option value="creatina">🔬 Creatinas</option>
                      <option value="aminoacidos">🔗 Aminoácidos</option>
                      <option value="energia">⚡ Energía / Pre-entreno</option>
                      <option value="salud">🫀 Salud / Bienestar</option>
                      <option value="accesorios">🎽 Accesorios</option>
                    </select>
                  </div>
                </div>

                <!-- Row 2: Imagen Preview & URL -->
                <div class="form-row-img-config">
                  <div class="img-preview-box">
                    <img [src]="editorImageInput || (currentEditingProduct.variants.length > 0 ? currentEditingProduct.variants[0].image : 'assets/img/todas/A001.webp')" alt="Preview" class="preview-img">
                  </div>
                  <div class="form-group flex-1">
                    <label>Ruta / URL de la Imagen</label>
                    <input 
                      type="text" 
                      [(ngModel)]="editorImageInput" 
                      (ngModelChange)="onEditorImageChange($event)"
                      placeholder="assets/img/todas/A001.webp o URL externa" 
                      class="form-control"
                    >
                    <small class="text-secondary">Aplica como imagen base para las variantes del producto.</small>
                  </div>
                </div>

                <!-- Row 3: GESTOR DINÁMICO DE SABORES (BADGES CON 'X') -->
                <div class="editor-section-box">
                  <div class="section-title-row">
                    <h4>🍬 Sabores Disponibles</h4>
                    <span class="text-secondary font-sm">Eliminá con ✕ o agregá nuevos sabores dinámicamente.</span>
                  </div>

                  <div class="flavor-chips-editor">
                    @for (flavor of currentEditingFlavors; track flavor) {
                      <div class="flavor-badge-chip">
                        <span>{{ flavor }}</span>
                        <button type="button" class="remove-chip-btn" (click)="removeFlavor(flavor)" title="Eliminar sabor">&times;</button>
                      </div>
                    }

                    @if (currentEditingFlavors.length === 0) {
                      <p class="text-muted font-sm">No hay sabores cargados (se usará 'Único').</p>
                    }
                  </div>

                  <div class="add-flavor-row">
                    <input 
                      type="text" 
                      [(ngModel)]="newFlavorInput" 
                      (keyup.enter)="addFlavor()"
                      placeholder="Nuevo sabor (ej: Frutilla, Vainilla, Neutro...)" 
                      class="form-control"
                    >
                    <button type="button" class="btn-secondary" (click)="addFlavor()">
                      + Agregar Sabor
                    </button>
                  </div>
                </div>

                <!-- Row 4: GESTOR DE VARIANTES Y PRECIOS POR TAMAÑO -->
                <div class="editor-section-box">
                  <div class="section-title-row">
                    <h4>📦 Tamaños y Precios (ARS)</h4>
                    <button type="button" class="btn-sm btn-secondary" (click)="addNewVariantSize()">
                      + Añadir Tamaño
                    </button>
                  </div>

                  <div class="variants-table-wrapper">
                    <table class="variants-editor-table">
                      <thead>
                        <tr>
                          <th>Código</th>
                          <th>Tamaño / Peso</th>
                          <th>Sabor Asignado</th>
                          <th>Precio ($ ARS)</th>
                          <th>Sin Precio</th>
                          <th class="text-right">Borrar</th>
                        </tr>
                      </thead>
                      <tbody>
                        @for (v of currentEditingProduct.variants; track $index; let vIdx = $index) {
                          <tr>
                            <td>
                              <input type="text" [(ngModel)]="v.code" class="form-control form-control-sm" placeholder="A001">
                            </td>
                            <td>
                              <input type="text" [(ngModel)]="v.size" class="form-control form-control-sm" placeholder="300g / 2 lbs">
                            </td>
                            <td>
                              <select [(ngModel)]="v.flavor" class="form-control form-control-sm">
                                @for (f of currentEditingFlavors; track f) {
                                  <option [value]="f">{{ f }}</option>
                                }
                                @if (!currentEditingFlavors.includes(v.flavor)) {
                                  <option [value]="v.flavor">{{ v.flavor }}</option>
                                }
                              </select>
                            </td>
                            <td>
                              <input 
                                type="number" 
                                [(ngModel)]="v.price" 
                                [disabled]="v.price === null" 
                                class="form-control form-control-sm" 
                                placeholder="27500"
                              >
                            </td>
                            <td class="text-center">
                              <input 
                                type="checkbox" 
                                [checked]="v.price === null" 
                                (change)="togglePriceNull(v, $event)"
                                title="Marcar como 'Consultar precio'"
                              >
                            </td>
                            <td class="text-right">
                              <button 
                                type="button" 
                                class="btn-icon-danger" 
                                (click)="removeVariant(vIdx)"
                                [disabled]="currentEditingProduct.variants.length <= 1"
                                title="Eliminar variante"
                              >
                                ✕
                              </button>
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn-secondary" (click)="closeEditorModal()">
                  Cancelar
                </button>
                <button type="button" class="btn-primary" (click)="saveProductChanges()">
                  💾 Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        }

      </div>
    </div>
  `,
  styles: [`
    .admin-wrapper {
      padding: 40px 0 80px;
      min-height: calc(100vh - 120px);
    }
    /* Login Card */
    .login-card-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 60px 20px;
    }
    .login-card {
      background: var(--bg-surface);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: var(--radius-lg);
      padding: 40px;
      width: 100%;
      max-width: 440px;
      text-align: center;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
    }
    .login-icon-wrapper {
      width: 64px;
      height: 64px;
      background: rgba(109, 214, 35, 0.1);
      border: 1px solid rgba(109, 214, 35, 0.3);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
    }
    .lock-icon {
      color: var(--primary-accent);
    }
    .login-card h2 {
      font-size: 1.6rem;
      font-weight: 800;
      color: var(--text-main);
      margin-bottom: 8px;
    }
    .login-subtitle {
      color: var(--text-secondary);
      font-size: 0.95rem;
      margin-bottom: 24px;
    }
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 18px;
      text-align: left;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .form-group label {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .form-control {
      background: #12151b;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: var(--radius-sm);
      padding: 12px 16px;
      color: var(--text-main);
      font-family: inherit;
      font-size: 0.95rem;
      outline: none;
      transition: all 0.2s ease;
    }
    .form-control:focus {
      border-color: var(--primary-accent);
      box-shadow: 0 0 10px rgba(109, 214, 35, 0.2);
    }
    .form-control-sm {
      padding: 8px 12px;
      font-size: 0.85rem;
    }
    .btn-primary {
      background-color: var(--primary-accent);
      color: var(--bg-dark);
      border: none;
      padding: 12px 20px;
      border-radius: var(--radius-sm);
      font-weight: 700;
      font-size: 0.95rem;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .btn-primary:hover:not(:disabled) {
      background-color: var(--primary-hover);
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(109, 214, 35, 0.3);
    }
    .btn-secondary {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: var(--text-main);
      padding: 10px 16px;
      border-radius: var(--radius-sm);
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.2);
    }
    .btn-logout {
      background: transparent;
      border: 1px solid rgba(255, 77, 77, 0.4);
      color: #ff6b6b;
      padding: 10px 16px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .btn-logout:hover {
      background: rgba(255, 77, 77, 0.15);
      border-color: #ff4d4d;
      color: #ff4d4d;
    }
    .btn-ghost-danger {
      background: none;
      border: none;
      color: #ff6b6b;
      cursor: pointer;
      font-size: 0.85rem;
      font-weight: 600;
      padding: 4px 8px;
    }
    .btn-ghost-danger:hover {
      text-decoration: underline;
    }
    .btn-sm {
      padding: 6px 12px;
      font-size: 0.8rem;
    }
    .w-100 {
      width: 100%;
    }
    /* Hero Buttons in Header */
    .admin-dashboard {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .admin-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
      padding-bottom: 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .admin-header-title {
      max-width: 500px;
    }
    .admin-badge {
      background: rgba(109, 214, 35, 0.15);
      color: var(--primary-accent);
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 3px 10px;
      border-radius: 20px;
      display: inline-block;
      margin-bottom: 8px;
    }
    .admin-title {
      font-size: 2rem;
      font-weight: 800;
      color: var(--text-main);
    }
    .admin-subtitle {
      color: var(--text-secondary);
      font-size: 0.95rem;
      line-height: 1.4;
    }
    .admin-hero-actions {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }
    .btn-hero {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 18px;
      border-radius: 10px;
      font-family: inherit;
      font-weight: 700;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.25s ease;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    }
    .btn-new-product {
      background: var(--primary-accent);
      color: var(--bg-dark);
      border: none;
    }
    .btn-new-product:hover {
      background: var(--primary-hover);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(109, 214, 35, 0.4);
    }
    .btn-excel-export {
      background: rgba(15, 23, 21, 0.85);
      border: 1.5px solid var(--primary-accent);
      color: var(--primary-accent);
    }
    .btn-excel-export:hover {
      background: rgba(109, 214, 35, 0.15);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(109, 214, 35, 0.25);
    }
    .btn-excel-import {
      background: rgba(26, 29, 36, 0.9);
      border: 1.5px solid rgba(255, 255, 255, 0.15);
      color: var(--text-main);
    }
    .btn-excel-import:hover {
      border-color: rgba(255, 255, 255, 0.35);
      background: rgba(35, 39, 48, 1);
      transform: translateY(-2px);
    }
    .btn-icon-symbol {
      font-size: 1.1rem;
      line-height: 1;
    }
    .file-upload-label {
      cursor: pointer;
    }
    .admin-card {
      background: var(--bg-surface);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: var(--radius-md);
      padding: 24px;
    }
    /* Compact Sync Section */
    .sync-compact-card {
      padding: 16px 20px;
      background: rgba(26, 29, 36, 0.6);
      border-color: rgba(255, 255, 255, 0.05);
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .sync-compact-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
    }
    .sync-compact-title {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .sync-mini-tag {
      background: rgba(255, 255, 255, 0.06);
      color: var(--text-secondary);
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      padding: 2px 6px;
      border-radius: 4px;
    }
    .sync-compact-title h4 {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--text-main);
    }
    .last-sync-badge {
      font-size: 0.75rem;
      color: var(--primary-accent);
      background: rgba(109, 214, 35, 0.1);
      padding: 3px 8px;
      border-radius: 4px;
    }
    .sync-compact-row {
      display: flex;
      gap: 10px;
    }
    .flex-1 {
      flex: 1;
    }
    /* Alerts */
    .alert {
      padding: 14px 18px;
      border-radius: var(--radius-sm);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.95rem;
      font-weight: 500;
    }
    .alert-success {
      background: rgba(37, 211, 102, 0.15);
      border: 1px solid rgba(37, 211, 102, 0.3);
      color: #25d366;
    }
    .alert-error {
      background: rgba(255, 77, 77, 0.15);
      border: 1px solid rgba(255, 77, 77, 0.3);
      color: #ff4d4d;
    }
    .close-alert {
      background: none;
      border: none;
      color: inherit;
      cursor: pointer;
      font-size: 1.1rem;
      padding: 0 4px;
    }
    /* Table */
    .table-controls-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 12px;
    }
    .search-box {
      width: 340px;
      max-width: 100%;
    }
    .table-stats {
      display: flex;
      align-items: center;
      gap: 16px;
      color: var(--text-secondary);
      font-size: 0.9rem;
    }
    .table-responsive {
      overflow-x: auto;
    }
    .admin-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.9rem;
    }
    .admin-table th {
      padding: 12px 14px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      color: var(--text-secondary);
      font-weight: 700;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.5px;
    }
    .admin-table td {
      padding: 14px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      vertical-align: middle;
    }
    .admin-table tr:hover td {
      background: rgba(255, 255, 255, 0.02);
    }
    .table-thumb {
      width: 44px;
      height: 44px;
      object-fit: contain;
      background: #11141a;
      border-radius: 6px;
      padding: 3px;
    }
    .product-id-sub {
      display: block;
      font-size: 0.75rem;
      color: var(--text-secondary);
    }
    .badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }
    .badge-brand {
      background: rgba(255, 255, 255, 0.08);
      color: var(--text-main);
    }
    .badge-category {
      background: rgba(109, 214, 35, 0.1);
      color: var(--primary-accent);
    }
    .variants-summary-list, .flavors-summary-list {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      max-width: 320px;
    }
    .variant-pill {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.75rem;
    }
    .flavor-mini-chip {
      background: rgba(109, 214, 35, 0.08);
      color: var(--text-secondary);
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.75rem;
    }
    .btn-icon {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: var(--text-main);
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-family: inherit;
      font-size: 0.85rem;
      margin-left: 6px;
      transition: all 0.2s;
    }
    .btn-icon:hover {
      background: rgba(255, 255, 255, 0.15);
      border-color: var(--primary-accent);
    }
    .btn-delete:hover {
      background: rgba(255, 77, 77, 0.15);
      border-color: #ff4d4d;
      color: #ff4d4d;
    }
    .text-right {
      text-align: right;
    }
    .text-center {
      text-align: center;
    }
    /* Modal Editor */
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(8px);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .modal-dialog {
      background: #161920;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: var(--radius-lg);
      width: 100%;
      max-width: 850px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8);
      overflow: hidden;
    }
    .modal-header {
      padding: 20px 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .modal-header h2 {
      font-size: 1.3rem;
      font-weight: 700;
      color: var(--text-main);
    }
    .close-modal-btn {
      background: none;
      border: none;
      color: var(--text-secondary);
      font-size: 1.8rem;
      cursor: pointer;
      line-height: 1;
    }
    .modal-body {
      padding: 24px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .form-row-3 {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }
    .form-row-img-config {
      display: flex;
      align-items: center;
      gap: 20px;
      background: rgba(255, 255, 255, 0.02);
      padding: 16px;
      border-radius: var(--radius-sm);
      border: 1px solid rgba(255, 255, 255, 0.04);
    }
    .img-preview-box {
      width: 70px;
      height: 70px;
      background: #101318;
      border-radius: 8px;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .preview-img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
    .editor-section-box {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: var(--radius-sm);
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .section-title-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .section-title-row h4 {
      font-size: 1rem;
      font-weight: 700;
      color: var(--primary-accent);
    }
    .font-sm {
      font-size: 0.8rem;
    }
    .flavor-chips-editor {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .flavor-badge-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(109, 214, 35, 0.15);
      border: 1px solid var(--primary-accent);
      color: var(--primary-accent);
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
    }
    .remove-chip-btn {
      background: none;
      border: none;
      color: var(--primary-accent);
      cursor: pointer;
      font-size: 1.1rem;
      line-height: 1;
      padding: 0 2px;
    }
    .remove-chip-btn:hover {
      color: #ff4d4d;
    }
    .add-flavor-row {
      display: flex;
      gap: 10px;
    }
    .variants-table-wrapper {
      overflow-x: auto;
    }
    .variants-editor-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.85rem;
    }
    .variants-editor-table th {
      padding: 8px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      color: var(--text-secondary);
      font-size: 0.75rem;
      text-transform: uppercase;
    }
    .variants-editor-table td {
      padding: 6px;
    }
    .btn-icon-danger {
      background: none;
      border: none;
      color: #ff4d4d;
      cursor: pointer;
      font-size: 1rem;
      padding: 4px 8px;
      border-radius: 4px;
    }
    .btn-icon-danger:hover:not(:disabled) {
      background: rgba(255, 77, 77, 0.15);
    }
    .btn-icon-danger:disabled {
      opacity: 0.2;
      cursor: not-allowed;
    }
    .modal-footer {
      padding: 16px 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      background: #12151b;
    }
    .spinner {
      width: 14px;
      height: 14px;
      border: 2px solid rgba(0,0,0,0.2);
      border-top-color: #000;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
      display: inline-block;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class AdminComponent implements OnInit {
  authService = inject(AuthService);
  productService = inject(ProductService);
  private router = inject(Router);

  passwordInput = '';
  loginError = '';

  sheetUrlInput = '';
  adminSearchQuery = '';

  // Modal Editor State
  isEditingModalOpen = false;
  isNewProduct = false;
  currentEditingProduct: Product | null = null;
  currentEditingFlavors: string[] = [];
  newFlavorInput = '';
  editorImageInput = '';

  ngOnInit(): void {
    this.sheetUrlInput = this.productService.savedSheetUrl();
  }

  onLogin(event: Event): void {
    event.preventDefault();
    this.loginError = '';
    const ok = this.authService.login(this.passwordInput);
    if (!ok) {
      this.loginError = 'Contraseña incorrecta. Verifícala e intenta nuevamente.';
    } else {
      this.passwordInput = '';
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  async syncFromUrl(): Promise<void> {
    if (!this.sheetUrlInput) return;
    await this.productService.loadProductsFromUrl(this.sheetUrlInput);
  }

  exportExcel(): void {
    this.productService.exportExcel();
  }

  async onImportExcel(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      await this.productService.importExcel(input.files[0]);
      input.value = '';
    }
  }

  confirmResetDefault(): void {
    if (confirm('¿Estás seguro de restablecer el catálogo a los datos originales de fábrica? Se perderán las modificaciones locales.')) {
      this.productService.resetToDefault();
      this.productService.syncSuccessMessage.set('Catálogo restablecido a valores por defecto.');
    }
  }

  get displayedProducts(): Product[] {
    const query = this.adminSearchQuery.trim().toLowerCase();
    const all = this.productService.products();
    if (!query) return all;

    return all.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.brand.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.variants.some(v => v.code.toLowerCase().includes(query) || v.flavor.toLowerCase().includes(query))
    );
  }

  getProductThumbnail(product: Product): string {
    const v = product.variants[0];
    return v?.image || `assets/img/todas/${v?.code || 'A001'}.webp`;
  }

  getProductFlavors(product: Product): string[] {
    return [...new Set(product.variants.map(v => v.flavor))];
  }

  // Edit / Create Modal Handlers
  editProduct(product: Product): void {
    this.isNewProduct = false;
    this.currentEditingProduct = JSON.parse(JSON.stringify(product));
    this.currentEditingFlavors = this.getProductFlavors(this.currentEditingProduct!);
    this.editorImageInput = this.currentEditingProduct!.variants[0]?.image || `assets/img/todas/${this.currentEditingProduct!.variants[0]?.code}.webp`;
    this.newFlavorInput = '';
    this.isEditingModalOpen = true;
  }

  openNewProductModal(): void {
    this.isNewProduct = true;
    const newId = 'prod-' + Date.now();
    this.currentEditingProduct = {
      id: newId,
      name: '',
      brand: 'Star Nutrition',
      category: 'proteina',
      variants: [
        {
          code: 'P01',
          size: 'Único',
          flavor: 'Neutro',
          price: 25000,
          originalName: '',
          image: 'assets/img/todas/A001.webp'
        }
      ]
    };
    this.currentEditingFlavors = ['Neutro'];
    this.editorImageInput = 'assets/img/todas/A001.webp';
    this.newFlavorInput = '';
    this.isEditingModalOpen = true;
  }

  closeEditorModal(): void {
    this.isEditingModalOpen = false;
    this.currentEditingProduct = null;
  }

  onEditorImageChange(newImg: string): void {
    if (this.currentEditingProduct) {
      this.currentEditingProduct.variants.forEach(v => {
        v.image = newImg;
      });
    }
  }

  addFlavor(): void {
    const flavor = this.newFlavorInput.trim();
    if (!flavor) return;
    if (!this.currentEditingFlavors.includes(flavor)) {
      this.currentEditingFlavors.push(flavor);
    }
    this.newFlavorInput = '';
  }

  removeFlavor(flavor: string): void {
    this.currentEditingFlavors = this.currentEditingFlavors.filter(f => f !== flavor);
    if (this.currentEditingProduct) {
      const fallbackFlavor = this.currentEditingFlavors[0] || 'Único';
      this.currentEditingProduct.variants.forEach(v => {
        if (v.flavor === flavor) {
          v.flavor = fallbackFlavor;
        }
      });
    }
  }

  addNewVariantSize(): void {
    if (!this.currentEditingProduct) return;
    const count = this.currentEditingProduct.variants.length + 1;
    const defaultFlavor = this.currentEditingFlavors[0] || 'Único';
    this.currentEditingProduct.variants.push({
      code: `VAR${count}`,
      size: 'Nuevo Tamaño',
      flavor: defaultFlavor,
      price: 30000,
      originalName: '',
      image: this.editorImageInput || 'assets/img/todas/A001.webp'
    });
  }

  removeVariant(index: number): void {
    if (this.currentEditingProduct && this.currentEditingProduct.variants.length > 1) {
      this.currentEditingProduct.variants.splice(index, 1);
    }
  }

  togglePriceNull(variant: ProductVariant, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    variant.price = isChecked ? null : 20000;
  }

  saveProductChanges(): void {
    if (!this.currentEditingProduct) return;
    if (!this.currentEditingProduct.name.trim()) {
      alert('Por favor especifica un nombre para el producto.');
      return;
    }

    this.currentEditingProduct.variants.forEach(v => {
      v.originalName = `${this.currentEditingProduct!.name} ${v.size !== 'Único' ? v.size : ''} ${v.flavor !== 'Único' ? '- ' + v.flavor : ''}`.trim();
      if (!v.image) {
        v.image = this.editorImageInput || `assets/img/todas/${v.code}.webp`;
      }
    });

    if (this.isNewProduct) {
      this.productService.addProduct(this.currentEditingProduct);
      this.productService.syncSuccessMessage.set(`Producto "${this.currentEditingProduct.name}" agregado con éxito.`);
    } else {
      this.productService.updateProduct(this.currentEditingProduct);
      this.productService.syncSuccessMessage.set(`Producto "${this.currentEditingProduct.name}" actualizado con éxito.`);
    }

    this.closeEditorModal();
  }

  deleteProduct(product: Product): void {
    if (confirm(`¿Estás seguro de eliminar "${product.name}" (${product.brand})?`)) {
      this.productService.deleteProduct(product.id);
      this.productService.syncSuccessMessage.set(`Producto "${product.name}" eliminado.`);
    }
  }
}
