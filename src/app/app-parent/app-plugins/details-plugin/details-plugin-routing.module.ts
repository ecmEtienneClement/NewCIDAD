import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GardGuard } from 'src/app/Mes_Services/gard.guard';
import { DetailsPluginsComponent } from './details-plugins/details-plugins.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [GardGuard],
    component: DetailsPluginsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailsPluginRoutingModule { }
