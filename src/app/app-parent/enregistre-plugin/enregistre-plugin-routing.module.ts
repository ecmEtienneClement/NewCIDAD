import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnregistrePluginComponent } from './enregistre-plugin.component';

const routes: Routes = [
  {
    path: '',
    component: EnregistrePluginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnregistrePluginRoutingModule {}
