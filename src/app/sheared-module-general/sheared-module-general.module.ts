import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShearedModuleGeneralRoutingModule } from './sheared-module-general-routing.module';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
@NgModule({
  declarations: [],
  imports: [CommonModule, ShearedModuleGeneralRoutingModule],
  exports: [
    MatInputModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatSelectModule,
  ],
})
export class ShearedModuleGeneralModule {}
