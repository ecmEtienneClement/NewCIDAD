import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GardGuard } from 'src/app/Mes_Services/gard.guard';
import { AddBugComponent } from './add-bug/add-bug.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [GardGuard],
    component: AddBugComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddRoutingModule {}
