import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UpdateRoutingModule } from './update-routing.module';
import { UpdateBugComponent } from './update-bug/update-bug.component';

import { ShearedModuleGeneralModule } from 'src/app/sheared-module-general/sheared-module-general.module';
@NgModule({
  declarations: [UpdateBugComponent],
  imports: [CommonModule, UpdateRoutingModule, ShearedModuleGeneralModule],
})
export class UpdateModule {}
