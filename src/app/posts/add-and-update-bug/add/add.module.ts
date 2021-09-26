import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddRoutingModule } from './add-routing.module';
import { AddBugComponent } from './add-bug/add-bug.component';
import { ShearedModuleGeneralModule } from 'src/app/sheared-module-general/sheared-module-general.module';

@NgModule({
  declarations: [AddBugComponent],
  imports: [CommonModule, AddRoutingModule, ShearedModuleGeneralModule],
})
export class AddModule {}
