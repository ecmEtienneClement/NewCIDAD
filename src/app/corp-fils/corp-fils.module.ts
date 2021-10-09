import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CorpFilsRoutingModule } from './corp-fils-routing.module';
import { GardGuard } from '../Mes_Services/gard.guard';
import { AuthService } from '../Mes_Services/auth.Service';
import { BugService } from '../Mes_Services/bug.Service';
import { ReponseBugService } from '../Mes_Services/reponseBug.Service';
import { UserService } from '../Mes_Services/user.Service';
import { EmitEvent } from '../Mes_Services/emitEvent.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Notification } from '../Mes_Services/notification.service';
import { AppVideoService } from '../Mes_Services/appVideo.Service';
import { UserMoogoService } from '../Mes_Services/userMongo.Service';
import { AppPlugingService } from '../Mes_Services/appPlugin.Service';

@NgModule({
  declarations: [],
  imports: [CommonModule, CorpFilsRoutingModule],
  providers: [
    AuthService,
    BugService,
    ReponseBugService,
    UserService,
    EmitEvent,
    GardGuard,
    MatSnackBar,
    Notification,
    AppVideoService,
    UserMoogoService,
    AppPlugingService,
  ],
})
export class CorpFilsModule {}
