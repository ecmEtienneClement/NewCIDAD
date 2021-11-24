import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnregistrePluginRoutingModule } from './enregistre-plugin-routing.module';
import { ShearmoduleEnregistreVieoPluginModule } from '../shearmodule-enregistre-vieo-plugin/shearmodule-enregistre-vieo-plugin.module';
import { EnregistrePluginComponent } from './enregistre-plugin.component';

import {MatIconModule} from '@angular/material/icon';
@NgModule({
  declarations: [
    EnregistrePluginComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    EnregistrePluginRoutingModule,
    ShearmoduleEnregistreVieoPluginModule,
  ],
})
export class EnregistrePluginModule {}
