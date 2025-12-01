import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { AuthenticationGuard } from 'src/app/guards/authentication.guard';

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
                path: 'drivers',
                canActivate: [AuthenticationGuard],
                loadChildren: () => import('src/app/pages/drivers/drivers.module').then(m => m.DriversModule)
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'customers',
                canActivate: [AuthenticationGuard],
                loadChildren: () => import('src/app/pages/customers/customers.module').then(m => m.CustomersModule)
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'motorcycles',
                canActivate: [AuthenticationGuard],
                loadChildren: () => import('src/app/pages/motorcycles/motorcycles.module').then(m => m.MotorcyclesModule)
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'products',
                canActivate: [AuthenticationGuard],
                loadChildren: () => import('src/app/pages/products/products.module').then(m => m.ProductsModule)
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'restaurants',
                canActivate: [AuthenticationGuard],
                loadChildren: () => import('src/app/pages/restaurants/restaurants.module').then(m => m.RestaurantsModule)
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'menus',
                canActivate: [AuthenticationGuard],
                loadChildren: () => import('src/app/pages/menus/menus.module').then(m => m.MenusModule)
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'orders',
                canActivate: [AuthenticationGuard],
                loadChildren: () => import('src/app/pages/orders/orders.module').then(m => m.OrdersModule)
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'addresses',
                canActivate: [AuthenticationGuard],
                loadChildren: () => import('src/app/pages/address/address.module').then(m => m.AddressModule)
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'shifts',
                canActivate: [AuthenticationGuard],
                loadChildren: () => import('src/app/pages/shifts/shifts.module').then(m => m.ShiftsModule)
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'issues',
                canActivate: [AuthenticationGuard],
                loadChildren: () => import('src/app/pages/issues/issues.module').then(m => m.IssuesModule)
            }
        ]
    },
    {
        path: '',
        children: [
            {
                path: 'photos',
                canActivate: [AuthenticationGuard],
                loadChildren: () => import('src/app/pages/photos/photos.module').then(m => m.PhotosModule)
            }
        ]
    }
];