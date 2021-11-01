import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppVideoCmpComponent } from './app-video-cmp/app-video-cmp.component';

const routes: Routes = [
  {
    path: '',
    component: AppVideoCmpComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppVideoRoutingModule {}
