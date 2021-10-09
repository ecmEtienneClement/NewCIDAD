import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GardGuard } from 'src/app/Mes_Services/gard.guard';
import { UpdateAppPluginComponent } from './update-app-plugin/update-app-plugin.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [GardGuard],
    component: UpdateAppPluginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdatePluginRoutingModule {}
