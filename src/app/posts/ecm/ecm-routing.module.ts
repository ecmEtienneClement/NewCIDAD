import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CmpecmComponent } from './cmpecm/cmpecm.component';

const routes: Routes = [
  {
    path: '',
    component: CmpecmComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EcmRoutingModule {}
