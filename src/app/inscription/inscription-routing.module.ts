import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IncriptionComponent } from './incription/incription.component';

const routes: Routes = [{ path: '', component: IncriptionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InscriptionRoutingModule {}
