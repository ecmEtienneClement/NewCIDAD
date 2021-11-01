import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPluginCmpComponent } from './app-plugin-cmp/app-plugin-cmp.component';

const routes: Routes = [
  {
    path: '',
    component: AppPluginCmpComponent,
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppPluginsRoutingModule {}
