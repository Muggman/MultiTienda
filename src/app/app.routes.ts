import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'tienda1'
  },
  {
    path: ':tiendaSlug',
    loadComponent: () => import('./features/tienda/tienda-layout.component').then(m => m.TiendaLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/tienda/home/home.component').then(m => m.HomeComponent),
        title: 'Inicio'
      },
      {
        path: 'carrito',
        loadComponent: () => import('./features/tienda/carrito/carrito-page.component').then(m => m.CarritoPageComponent),
        title: 'Carrito de Compras'
      },
      {
        path: 'checkout',
        loadComponent: () => import('./features/tienda/checkout/checkout.component').then(m => m.CheckoutComponent),
        title: 'Confirmar Pedido'
      },
      {
        path: 'confirmacion',
        loadComponent: () => import('./features/tienda/checkout/confirmacion.component').then(m => m.ConfirmacionComponent),
        title: 'Confirmación'
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./features/tienda/not-found/tienda-not-found.component').then(m => m.TiendaNotFoundComponent),
    title: 'Tienda No Encontrada'
  }
];
