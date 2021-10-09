import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GardGuard } from 'src/app/Mes_Services/gard.guard';
import { EnregistrePluginComponent } from './enregistre-plugin.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [GardGuard],
    component: EnregistrePluginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnregistrePluginRoutingModule {}
