import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'tables',         component: TablesComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    {
        path: '',
        children: [
            {
                path: 'theaters',
                loadChildren: () => import('src/app/pages/theaters/theaters.module').then(m => m.TheatersModule)
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'drivers',
                loadChildren: () => import('src/app/pages/drivers/drivers.module').then(m => m.DriversModule)
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'customers',
                loadChildren: () => import('src/app/pages/customers/customers.module').then(m => m.CustomersModule)
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'motorcycles',
                loadChildren: () => import('src/app/pages/motorcycles/motorcycles.module').then(m => m.MotorcyclesModule)
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'products',
                loadChildren: () => import('src/app/pages/products/products.module').then(m => m.ProductsModule)
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'restaurants',
                loadChildren: () => import('src/app/pages/restaurants/restaurants.module').then(m => m.RestaurantsModule)
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'menus',
                loadChildren: () => import('src/app/pages/menus/menus.module').then(m => m.MenusModule)
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'orders',
                loadChildren: () => import('src/app/pages/orders/orders.module').then(m => m.OrdersModule)
            }
        ]
    }
];