import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GardGuard } from '../Mes_Services/gard.guard';

const routes: Routes = [
  {
    path: 'appPlugin',
    canActivate: [GardGuard],
    loadChildren: () =>
      import('./app-plugins/app-plugins.module').then(
        (mod) => mod.AppPluginsModule
      ),
  },
  {
    path: 'EnregistrePlugin',
    canActivate: [GardGuard],
    loadChildren: () =>
      import('./enregistre-plugin/enregistre-plugin.module').then(
        (mod) => mod.EnregistrePluginModule
      ),
  },
  {
    path: 'detailsPluging/:idPlugin',
    canActivate: [GardGuard],
    loadChildren: () =>
      import('./app-plugins/details-plugin/details-plugin.module').then(
        (mod) => mod.DetailsPluginModule
      ),
  },
  {
    path: 'updatePluging/:idPlugin',
    canActivate: [GardGuard],
    loadChildren: () =>
      import('./app-plugins/update-plugin/update-plugin.module').then(
        (mod) => mod.UpdatePluginModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppParentRoutingModule {}
