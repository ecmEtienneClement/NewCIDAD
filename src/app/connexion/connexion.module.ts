import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnexionRoutingModule } from './connexion-routing.module';
import { ConnexionComponent } from './connexion/connexion.component';
import { ShearedModuleGeneralModule } from '../sheared-module-general/sheared-module-general.module';

@NgModule({
  declarations: [ConnexionComponent],
  imports: [CommonModule, ConnexionRoutingModule, ShearedModuleGeneralModule],
})
export class ConnexionModule {}
