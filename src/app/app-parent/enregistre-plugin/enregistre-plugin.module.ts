import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnregistrePluginRoutingModule } from './enregistre-plugin-routing.module';
import { ShearmoduleEnregistreVieoPluginModule } from '../shearmodule-enregistre-vieo-plugin/shearmodule-enregistre-vieo-plugin.module';
import { EnregistrePluginComponent } from './enregistre-plugin.component';


@NgModule({
  declarations: [
    EnregistrePluginComponent
  ],
  imports: [
    CommonModule,
    EnregistrePluginRoutingModule,
    ShearmoduleEnregistreVieoPluginModule,
  ],
})
export class EnregistrePluginModule {}
