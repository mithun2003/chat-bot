import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/user',
    pathMatch: 'full'
  },
  {
    path: 'user',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/user/user.routes.module').then((m) => m.UserRoutesModule)
      }
    ]
  },
  {
    path: 'admin',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/admin/admin.routes.module').then(
            (m) => m.AdminRoutesModule
          )
      }
    ]
  }
];
