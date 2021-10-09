import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GardGuard } from 'src/app/Mes_Services/gard.guard';
import { AppPluginCmpComponent } from './app-plugin-cmp/app-plugin-cmp.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [GardGuard],
    component: AppPluginCmpComponent,
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppPluginsRoutingModule {}
