import { Route, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ChatPageComponent } from './components/chatpage/chatPage.component';

export const userRoutes: Route[] = [
  {
    path: '',
    redirectTo: '/user/chat',
    pathMatch: 'full'
  },
  { path: 'chat', component: ChatPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(userRoutes)],
  exports: [RouterModule]
})
export class UserRoutesModule {}