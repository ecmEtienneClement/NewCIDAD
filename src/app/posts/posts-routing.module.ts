import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GardDetailGuard } from '../Mes_Services/gard-detail.guard';
import { GardUpdateGuardBug } from '../Mes_Services/gard-update-bug.guard';
import { GardGuard } from '../Mes_Services/gard.guard';

const routes: Routes = [
  {
    path: 'ecm',
    canActivate: [GardGuard],
    loadChildren: () => import('./ecm/ecm.module').then((mod) => mod.EcmModule),
  },
  {
    path: 'ecm/details/:indice',
    canActivate: [GardGuard, GardDetailGuard],
    loadChildren: () =>
      import('./details/details.module').then((mod) => mod.DetailsModule),
  },
  {
    path: 'ecm/:idUser/modifier/:indice/:idBug',
    canActivate: [GardGuard, GardUpdateGuardBug],
    loadChildren: () =>
      import('./add-and-update-bug/update/update.module').then(
        (mod) => mod.UpdateModule
      ),
  },
  {
    path: 'enregistre',
    canActivate: [GardGuard],
    loadChildren: () =>
      import('./add-and-update-bug/add/add.module').then(
        (mod) => mod.AddModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostsRoutingModule {}
