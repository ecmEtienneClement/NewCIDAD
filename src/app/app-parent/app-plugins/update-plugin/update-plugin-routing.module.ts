import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UpdateAppPluginComponent } from './update-app-plugin/update-app-plugin.component';

const routes: Routes = [
  {
    path: '',
    component: UpdateAppPluginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdatePluginRoutingModule {}
