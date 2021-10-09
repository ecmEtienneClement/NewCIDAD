import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShearmoduleEnregistreVieoPluginRoutingModule } from './shearmodule-enregistre-vieo-plugin-routing.module';
import { ShearedModuleGeneralModule } from 'src/app/sheared-module-general/sheared-module-general.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, ShearmoduleEnregistreVieoPluginRoutingModule],
  exports: [ShearedModuleGeneralModule],
})
export class ShearmoduleEnregistreVieoPluginModule {}
