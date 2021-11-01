import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsPluginsComponent } from './details-plugins/details-plugins.component';

const routes: Routes = [
  {
    path: '',
    component: DetailsPluginsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailsPluginRoutingModule { }
