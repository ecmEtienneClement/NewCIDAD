import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GardGuard } from 'src/app/Mes_Services/gard.guard';
import { CmpecmComponent } from './cmpecm/cmpecm.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [GardGuard],
    component: CmpecmComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EcmRoutingModule {}
