import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CpmdetailsComponent } from './cpmdetails/cpmdetails.component';

const routes: Routes = [
  {
    path: '',
    component: CpmdetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailsRoutingModule {}
