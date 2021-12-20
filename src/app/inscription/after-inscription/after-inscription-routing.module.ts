import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SavePpUserComponent } from './save-pp-user/save-pp-user.component';
import { SendQuestionnaireComponent } from './send-questionnaire/send-questionnaire.component';

const routes: Routes = [
  { path: 'inscription/savePpUser', component: SavePpUserComponent },
  { path: 'inscription/sendQuestionnaire', component: SendQuestionnaireComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AfterInscriptionRoutingModule {}
