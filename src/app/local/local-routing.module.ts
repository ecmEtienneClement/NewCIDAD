import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GardGuard } from '../Mes_Services/gard.guard';
import { DetailsBdActiveLocalComponent } from './details-bd-active-local/details-bd-active-local.component';
import { DetailsBdDesactiveLocalComponent } from './details-bd-desactive-local/details-bd-desactive-local.component';
import { InitialisationComponent } from './initialisation/initialisation.component';
import { SelectBDetPourcComponent } from './select-bdet-pourc/select-bdet-pourc.component';

const routes: Routes = [
  {
    path: 'local/init/EcmBd',
    canActivate: [GardGuard],
    component: InitialisationComponent,
  },
  {
    path: 'local/init/EcmBd/BdPourc',
    canActivate: [GardGuard],
    component: SelectBDetPourcComponent,
  },
  {
    path: 'local/details/EcmBd/ActiveLocal',
    canActivate: [GardGuard],
    component: DetailsBdActiveLocalComponent,
  },
  {
    path: 'local/details/EcmBd/DesactiveLocal',
    canActivate: [GardGuard],
    component: DetailsBdDesactiveLocalComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocalRoutingModule {}
