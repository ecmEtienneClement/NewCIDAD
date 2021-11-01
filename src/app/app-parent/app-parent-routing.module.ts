import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GardDetailGuard } from '../Mes_Services/gard-detail.guard';
import { GardDetailsPluginGuard } from '../Mes_Services/gard-details-plugin.guard';
import { GardGuard } from '../Mes_Services/gard.guard';
import { GuardUpdatePluginGuard } from '../Mes_Services/guard-update-plugin.guard';

const routes: Routes = [
  {
    path: 'appVideo',
    canActivate: [GardGuard],
    loadChildren: () =>
      import('./app-video/app-video.module').then((mod) => mod.AppVideoModule),
  },
  {
    path: 'appPlugin',
    canActivate: [GardGuard],
    loadChildren: () =>
      import('./app-plugins/app-plugins.module').then(
        (mod) => mod.AppPluginsModule
      ),
  },
  {
    path: 'EnregistreVideo',
    canActivate: [GardGuard],
    loadChildren: () =>
      import('./enregistre-video/enregistre-video.module').then(
        (mod) => mod.EnregistreVideoModule
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
    path: 'details/Pluging/:idPlugin',
    canActivate: [GardGuard, GardDetailsPluginGuard],
    loadChildren: () =>
      import('./app-plugins/details-plugin/details-plugin.module').then(
        (mod) => mod.DetailsPluginModule
      ),
  },
  {
    path: 'update/:idUser/Pluging/:idPlugin',
    canActivate: [GardGuard, GuardUpdatePluginGuard],
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
