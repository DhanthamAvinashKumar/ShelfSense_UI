import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Layout } from './components/layout/layout';
import { HomeAnimation } from './components/dashboard/home-animation/home-animation';
import { ProductComponent } from './components/dashboard/add-product/add-product';
import { ShelfComponent } from './components/dashboard/shelf/shelf';
import { Category } from './components/dashboard/category/category';
import { Register } from './components/register/register';
import { RoleGuard } from './components/guards/role-guard';
import { ProductShelf } from './components/dashboard/product-shelf/product-shelf';
import { ShelfMetricsComponent } from './components/dashboard/shelf-metrics/shelf-metrics';

export const routes: Routes = [
  // removed automatic redirect so Layout can exist at root
  { path: 'login', component: Login },
  {
    path: '',
    component: Layout,
    canActivateChild: [RoleGuard],
    children: [
      // default child shows home animation (no endpoint visited yet)
      { path: '', component: HomeAnimation, data: { roles: ['admin','manager','staff'] } },
      { path: 'add-product', component: ProductComponent, data: { roles: ['admin', 'manager', 'staff'] } },
      { path: 'add-category', component: Category, data: { roles: ['admin', 'manager', 'staff'] } },
      { path: 'add-shelf', component: ShelfComponent, data: { roles: ['admin', 'manager', 'staff'] } },
      { path: 'register', component: Register, data: { roles: ['admin', 'manager'] } },
      { path: 'product-Shelf', component: ProductShelf, data: { roles: ['admin', 'manager', 'staff'] } },
      { path: 'shelf_metrics', component: ShelfMetricsComponent, data: { roles: ['admin', 'manager', 'staff'] } }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
