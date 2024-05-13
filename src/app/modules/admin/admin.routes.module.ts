import { Route, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EntListComponent } from './components/ent-list/ent-list.component';

export const adminRoutes: Route[] = [
  {
    path: '',
    redirectTo: '/admin/dashboard',
    pathMatch: 'full'
  },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'dashboard/:sessionId', component: DashboardComponent },
  { path: 'ent-list', component: EntListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
})
export class AdminRoutesModule {}