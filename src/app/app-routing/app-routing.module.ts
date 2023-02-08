import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';

import {WelcomeComponent} from '../welcome/welcome.component';
import {AuthGuard} from "../auth/auth.guard";

const routes: Routes = [
  {path: '', component: WelcomeComponent},
  {path: 'training',
    loadChildren: () =>
      import('../training/training.module')
        .then(m => m.TrainingModule),canLoad: [AuthGuard]}
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {
}
