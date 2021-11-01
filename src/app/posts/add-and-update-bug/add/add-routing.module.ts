import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddBugComponent } from './add-bug/add-bug.component';

const routes: Routes = [
  {
    path: '',
    component: AddBugComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddRoutingModule {}
