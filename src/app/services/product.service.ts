import { Injectable, computed, signal } from '@angular/core';
import * as XLSX from 'xlsx';
import { Product, ProductVariant, ProductCategory } from '../models/product.model';
import { DEFAULT_PRODUCTS } from '../data/default-products';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly STORAGE_PRODUCTS_KEY = 'suplemental_custom_products';
  private readonly STORAGE_SHEET_URL_KEY = 'suplemental_sheet_url';
  private readonly STORAGE_LAST_SYNC_KEY = 'suplemental_last_sync';
  
  // Endpoint en Hostinger y clave para autorizar guardados en el servidor
  private readonly API_URL = '/api.php';
  private readonly ADMIN_SECRET = 'supleadmin2026';

  // Signals
  products = signal<Product[]>(this.loadInitialProducts());
  selectedBrand = signal<string>('all');
  selectedCategory = signal<string>('all');
  searchQuery = signal<string>('');

  isSyncing = signal<boolean>(false);
  syncError = signal<string | null>(null);
  syncSuccessMessage = signal<string | null>(null);
  lastSyncDate = signal<string | null>(this.loadInitialLastSync());
  savedSheetUrl = signal<string>(this.loadInitialSheetUrl());

  constructor() {
    // Apenas cualquier usuario entra a la web (celular o PC), busca el catálogo actualizado del servidor
    this.fetchProductsFromServer();
  }

  // Computed Filtered Products
  filteredProducts = computed(() => {
    const prods = this.products();
    const brand = this.selectedBrand();
    const category = this.selectedCategory();
    const query = this.searchQuery().trim().toLowerCase();

    return prods.filter(product => {
      const matchBrand = brand === 'all' || product.brand === brand;
      const matchCategory = category === 'all' || product.category === category;
      const matchQuery = !query || 
        product.name.toLowerCase().includes(query) || 
        product.brand.toLowerCase().includes(query) ||
        product.variants.some(v => v.flavor.toLowerCase().includes(query) || v.size.toLowerCase().includes(query));

      return matchBrand && matchCategory && matchQuery;
    });
  });

  /**
   * Descarga los productos guardados en el servidor (productos.json a través de api.php)
   */
  async fetchProductsFromServer(): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      // ?t=Date.now() evita que el navegador del celular use una respuesta vieja en caché
      const response = await fetch(`${this.API_URL}?t=${Date.now()}`, {
        method: 'GET',
        headers: { 'Cache-Control': 'no-cache' }
      });

      if (!response.ok) return;

      const serverProducts = await response.json();
      if (Array.isArray(serverProducts) && serverProducts.length > 0) {
        this.products.set(serverProducts);
        localStorage.setItem(this.STORAGE_PRODUCTS_KEY, JSON.stringify(serverProducts));
      }
    } catch (e) {
      // En localhost (ng serve) api.php no existe, por lo que usa localStorage sin romper nada
      console.warn('Usando catálogo local (servidor PHP no detectado en entorno de desarrollo).');
    }
  }

  /**
   * Envía el catálogo modificado al servidor de Hostinger para que impacte en todos los dispositivos
   */
  private async saveProductsToServer(products: Product[]): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: this.ADMIN_SECRET,
          products: products
        })
      });

      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
      }
    } catch (e) {
      console.error('No se pudo guardar en el servidor remoto:', e);
      this.syncError.set('Se guardó en tu navegador, pero hubo un error al publicar en el servidor.');
    }
  }

  private loadInitialProducts(): Product[] {
    if (typeof window === 'undefined') return DEFAULT_PRODUCTS;
    try {
      const stored = localStorage.getItem(this.STORAGE_PRODUCTS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading stored products, using default data:', e);
    }
    return DEFAULT_PRODUCTS;
  }

  private loadInitialSheetUrl(): string {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(this.STORAGE_SHEET_URL_KEY) || '';
  }

  private loadInitialLastSync(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.STORAGE_LAST_SYNC_KEY) || null;
  }

  setBrandFilter(brand: string): void {
    this.selectedBrand.set(brand);
  }

  setCategoryFilter(category: string): void {
    this.selectedCategory.set(category);
  }

  setSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }

  getProductById(id: string): Product | undefined {
    return this.products().find(p => p.id === id);
  }

  // CRUD Methods (Actualizan Signal + LocalStorage + Servidor Hostinger)
  saveAllProducts(products: Product[]): void {
    this.products.set(products);
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_PRODUCTS_KEY, JSON.stringify(products));
      this.saveProductsToServer(products);
    }
  }

  updateProduct(updatedProduct: Product): void {
    const current = [...this.products()];
    const index = current.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) {
      current[index] = updatedProduct;
      this.saveAllProducts(current);
    }
  }

  addProduct(newProduct: Product): void {
    const current = [newProduct, ...this.products()];
    this.saveAllProducts(current);
  }

  deleteProduct(productId: string): void {
    const current = this.products().filter(p => p.id !== productId);
    this.saveAllProducts(current);
  }

  resetToDefault(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_PRODUCTS_KEY);
      fetch(this.API_URL, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: this.ADMIN_SECRET })
      }).catch(e => console.error('Error al borrar productos.json en el servidor:', e));
    }
    this.products.set(DEFAULT_PRODUCTS);
  }

  // Remote URL Sync (CSV / Google Sheets / JSON)
  async loadProductsFromUrl(url: string): Promise<boolean> {
    const cleanUrl = url.trim();
    if (!cleanUrl) {
      this.syncError.set('Por favor ingresa una URL válida.');
      return false;
    }

    this.isSyncing.set(true);
    this.syncError.set(null);
    this.syncSuccessMessage.set(null);

    try {
      const response = await fetch(cleanUrl);
      if (!response.ok) {
        throw new Error(`Error de conexión HTTP: ${response.status} ${response.statusText}`);
      }

      const text = await response.text();
      let importedProducts: Product[] = [];

      // Check if JSON or CSV
      const trimmed = text.trim();
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        const json = JSON.parse(trimmed);
        importedProducts = Array.isArray(json) ? json : (json.products || []);
      } else {
        importedProducts = this.parseCsvToProducts(trimmed);
      }

      if (!importedProducts || importedProducts.length === 0) {
        throw new Error('No se encontraron productos válidos en el archivo o planilla.');
      }

      this.saveAllProducts(importedProducts);
      
      const now = new Date().toLocaleString('es-AR');
      this.lastSyncDate.set(now);
      this.savedSheetUrl.set(cleanUrl);

      if (typeof window !== 'undefined') {
        localStorage.setItem(this.STORAGE_SHEET_URL_KEY, cleanUrl);
        localStorage.setItem(this.STORAGE_LAST_SYNC_KEY, now);
      }

      this.syncSuccessMessage.set(`¡Catálogo sincronizado y publicado en el servidor con éxito! (${importedProducts.length} productos actualizados).`);
      this.isSyncing.set(false);
      return true;
    } catch (err: any) {
      this.syncError.set(`Fallo al sincronizar: ${err?.message || 'Error desconocido'}`);
      this.isSyncing.set(false);
      return false;
    }
  }

  // CSV Parsing
  private parseCsvToProducts(csvText: string): Product[] {
    const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2) return [];

    const headers = this.parseCsvLine(lines[0]).map(h => h.toLowerCase().trim());
    
    const codeIdx = headers.findIndex(h => h.includes('código') || h.includes('codigo') || h === 'code' || h === 'id');
    const nameIdx = headers.findIndex(h => h.includes('producto') || h.includes('nombre') || h === 'name');
    const brandIdx = headers.findIndex(h => h.includes('marca') || h === 'brand');
    const categoryIdx = headers.findIndex(h => h.includes('categor') || h === 'category');
    const sizeIdx = headers.findIndex(h => h.includes('tamaño') || h.includes('tamano') || h.includes('peso') || h === 'size');
    const flavorIdx = headers.findIndex(h => h.includes('sabor') || h === 'flavor' || h.includes('sabores'));
    const priceIdx = headers.findIndex(h => h.includes('precio') || h === 'price');
    const imageIdx = headers.findIndex(h => h.includes('imagen') || h.includes('foto') || h === 'image' || h === 'img');

    const productsMap = new Map<string, Product>();

    for (let i = 1; i < lines.length; i++) {
      const cols = this.parseCsvLine(lines[i]);
      if (cols.length === 0 || !cols.some(c => c.trim().length > 0)) continue;

      const code = (codeIdx !== -1 && cols[codeIdx]) ? cols[codeIdx].trim() : `P${i}`;
      const name = (nameIdx !== -1 && cols[nameIdx]) ? cols[nameIdx].trim() : 'Suplemento';
      let brand = (brandIdx !== -1 && cols[brandIdx]) ? cols[brandIdx].trim() : '';
      if (!brand) {
        brand = code.startsWith('A') ? 'Star Nutrition' : (code.startsWith('B') ? 'Body Advance' : 'Suplemental');
      }

      const category = (categoryIdx !== -1 && cols[categoryIdx]) ? cols[categoryIdx].trim().toLowerCase() : 'proteina';
      const size = (sizeIdx !== -1 && cols[sizeIdx]) ? cols[sizeIdx].trim() : 'Único';
      const flavor = (flavorIdx !== -1 && cols[flavorIdx]) ? cols[flavorIdx].trim() : 'Único';
      
      const rawPrice = (priceIdx !== -1 && cols[priceIdx]) ? cols[priceIdx].trim() : '';
      const cleanPrice = rawPrice.replace(/[^\d]/g, '');
      const price = cleanPrice ? parseInt(cleanPrice, 10) : null;

      let image = (imageIdx !== -1 && cols[imageIdx]) ? cols[imageIdx].trim() : '';
      if (!image) {
        image = `assets/img/todas/${code}.webp`;
      }

      const originalName = `${name} ${size !== 'Único' ? size : ''} ${flavor !== 'Único' ? '- ' + flavor : ''}`.trim();

      const variant: ProductVariant = {
        code,
        size,
        flavor,
        price,
        originalName,
        image
      };

      const productId = this.slugify(`${brand}-${name}`);
      if (!productsMap.has(productId)) {
        productsMap.set(productId, {
          id: productId,
          brand,
          name,
          category: category as ProductCategory,
          variants: [variant]
        });
      } else {
        const prod = productsMap.get(productId)!;
        const existingVarIdx = prod.variants.findIndex(v => v.code === code);
        if (existingVarIdx >= 0) {
          prod.variants[existingVarIdx] = variant;
        } else {
          prod.variants.push(variant);
        }
      }
    }

    return Array.from(productsMap.values());
  }

  private parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        inQuotes = !inQuotes;
      } else if ((c === ',' || c === ';') && !inQuotes) {
        result.push(cur);
        cur = '';
      } else {
        cur += c;
      }
    }
    result.push(cur);
    return result.map(v => v.replace(/^"|"$/g, '').trim());
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // ==========================================
  // EXCEL (.xlsx) EXPORT & IMPORT
  // ==========================================

  exportExcel(): void {
    const prods = this.products();
    const rows: Array<{
      'Código': string;
      'Categoría': string;
      'Producto': string;
      'Precio': number | string;
      'Sabores': string;
      'Marca': string;
      'Imagen': string;
    }> = [];

    prods.forEach(prod => {
      prod.variants.forEach(variant => {
        rows.push({
          'Código': variant.code || '',
          'Categoría': prod.category || '',
          'Producto': variant.originalName || prod.name,
          'Precio': variant.price !== null ? variant.price : '',
          'Sabores': variant.flavor || 'Único',
          'Marca': prod.brand || '',
          'Imagen': variant.image || `assets/img/todas/${variant.code}.webp`
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(rows, {
      header: ['Código', 'Categoría', 'Producto', 'Precio', 'Sabores', 'Marca', 'Imagen']
    });

    const colWidths = [
      { wch: 10 },
      { wch: 15 },
      { wch: 40 },
      { wch: 12 },
      { wch: 18 },
      { wch: 18 },
      { wch: 35 }
    ];
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Catálogo');

    XLSX.writeFile(workbook, 'suplemental_catalogo.xlsx');
  }

  async importExcel(file: File): Promise<boolean> {
    this.syncError.set(null);
    this.syncSuccessMessage.set(null);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      
      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        throw new Error('El archivo Excel no contiene hojas de cálculo.');
      }

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, { defval: '' });

      if (!rawRows || rawRows.length === 0) {
        throw new Error('El archivo Excel está vacío o no contiene filas con datos.');
      }

      const productsMap = new Map<string, Product>();

      rawRows.forEach((row, index) => {
        const getVal = (possibleKeys: string[]): string => {
          for (const key of Object.keys(row)) {
            const cleanKey = key.toLowerCase().trim();
            if (possibleKeys.some(pk => cleanKey === pk || cleanKey.includes(pk))) {
              return String(row[key] ?? '').trim();
            }
          }
          return '';
        };

        const code = getVal(['código', 'codigo', 'code', 'id']) || `P${index + 1}`;
        const rawProductName = getVal(['producto', 'nombre', 'name']) || 'Suplemento';
        let brand = getVal(['marca', 'brand']);
        if (!brand) {
          brand = code.startsWith('A') ? 'Star Nutrition' : (code.startsWith('B') ? 'Body Advance' : 'Suplemental');
        }

        const category = (getVal(['categoría', 'categoria', 'category']) || 'proteina').toLowerCase() as ProductCategory;
        const flavor = getVal(['sabores', 'sabor', 'flavor']) || 'Único';
        
        const rawPrice = getVal(['precio', 'price']);
        let price: number | null = null;
        if (rawPrice !== '' && rawPrice !== '-' && rawPrice !== 'null') {
          const cleanPrice = String(rawPrice).replace(/[^\d]/g, '');
          price = cleanPrice ? parseInt(cleanPrice, 10) : null;
        }

        let image = getVal(['imagen', 'image', 'foto']);
        if (!image) {
          image = `assets/img/todas/${code}.webp`;
        }

        let baseName = rawProductName;
        let size = 'Único';

        const sizeRegex = /\b(\d+(?:[.,]\d+)?\s*(?:kg|g|lbs|lb|caps|cápsulas|comprimidos|comp))\b/i;
        const sizeMatch = rawProductName.match(sizeRegex);
        if (sizeMatch) {
          size = sizeMatch[1].trim();
        }

        let cleanName = rawProductName;
        if (flavor && flavor !== 'Único') {
          const flavorRegex = new RegExp(`\\s*-\\s*${flavor}`, 'i');
          cleanName = cleanName.replace(flavorRegex, '').trim();
        }
        if (sizeMatch) {
          cleanName = cleanName.replace(sizeRegex, '').replace(/\s*-\s*$/, '').trim();
        }

        baseName = cleanName || rawProductName;

        const variant: ProductVariant = {
          code,
          size,
          flavor,
          price,
          originalName: rawProductName,
          image
        };

        const productId = this.slugify(`${brand}-${baseName}`);
        if (!productsMap.has(productId)) {
          productsMap.set(productId, {
            id: productId,
            brand,
            name: baseName,
            category,
            variants: [variant]
          });
        } else {
          const prod = productsMap.get(productId)!;
          const existingVarIdx = prod.variants.findIndex(v => v.code === code);
          if (existingVarIdx >= 0) {
            prod.variants[existingVarIdx] = variant;
          } else {
            prod.variants.push(variant);
          }
        }
      });

      const importedProducts = Array.from(productsMap.values());
      if (importedProducts.length === 0) {
        throw new Error('No se pudieron extraer productos válidos del archivo Excel.');
      }

      this.saveAllProducts(importedProducts);
      this.syncSuccessMessage.set(`¡Catálogo importado desde Excel y publicado para todos los usuarios! (${importedProducts.length} productos actualizados).`);
      return true;
    } catch (err: any) {
      this.syncError.set(`Error importando archivo Excel: ${err?.message || 'Formato no reconocido'}`);
      return false;
    }
  }
}