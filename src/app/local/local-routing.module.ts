import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GardGuard } from '../Mes_Services/gard.guard';
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocalRoutingModule {}
