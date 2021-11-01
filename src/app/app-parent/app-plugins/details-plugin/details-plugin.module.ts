import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsPluginRoutingModule } from './details-plugin-routing.module';
import { ShearedModuleGeneralModule } from 'src/app/sheared-module-general/sheared-module-general.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DetailsPluginRoutingModule,
    ShearedModuleGeneralModule,
  ],
})
export class DetailsPluginModule {}
