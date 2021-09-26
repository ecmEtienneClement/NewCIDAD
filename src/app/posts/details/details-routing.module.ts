import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GardGuard } from 'src/app/Mes_Services/gard.guard';
import { CpmdetailsComponent } from './cpmdetails/cpmdetails.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [GardGuard],
    component: CpmdetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailsRoutingModule {}
