import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'Suplemental | Alcanza tu Objetivo'
  },
  {
    path: 'productos',
    loadComponent: () => import('./pages/catalog/catalog.component').then(m => m.CatalogComponent),
    title: 'Catálogo de Productos | Suplemental'
  },
  {
    path: 'objetivo/:id',
    loadComponent: () => import('./pages/objective-detail/objective-detail.component').then(m => m.ObjectiveDetailComponent),
    title: 'Detalle de Objetivo | Suplemental'
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent),
    title: 'Admin Catálogo | Suplemental'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
