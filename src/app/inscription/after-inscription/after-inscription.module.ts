import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AfterInscriptionRoutingModule } from './after-inscription-routing.module';
import { SavePpUserComponent } from './save-pp-user/save-pp-user.component';
import { SendQuestionnaireComponent } from './send-questionnaire/send-questionnaire.component';


@NgModule({
  declarations: [SavePpUserComponent, SendQuestionnaireComponent],
  imports: [CommonModule, AfterInscriptionRoutingModule],
})
export class AfterInscriptionModule {}
