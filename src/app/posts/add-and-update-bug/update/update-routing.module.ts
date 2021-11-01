import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UpdateBugComponent } from './update-bug/update-bug.component';

const routes: Routes = [
  {
    path: '',
    component: UpdateBugComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateRoutingModule {}
