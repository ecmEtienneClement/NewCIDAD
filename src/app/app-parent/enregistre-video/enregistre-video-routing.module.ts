import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnrgistreVideoCmpComponent } from './enrgistre-video-cmp/enrgistre-video-cmp.component';

const routes: Routes = [
  {
    path: '',
    component: EnrgistreVideoCmpComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnregistreVideoRoutingModule {}
