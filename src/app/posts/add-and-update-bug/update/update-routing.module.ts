import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GardGuard } from 'src/app/Mes_Services/gard.guard';
import { UpdateBugComponent } from './update-bug/update-bug.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [GardGuard],
    component: UpdateBugComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateRoutingModule {}
