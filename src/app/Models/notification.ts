import { NotifyModel } from './eventAction';

export class NotificationModel {
  constructor(
    public id_User?: string,
    public nbrTotalNotify: number = 0,
    public length_Tb_Bug: number = 0,
    public tbIdReponseBug: NotifyModel[] = [{ titre: '', nbr: 0 }],
    public tbIdCommentaireReponse: NotifyModel[] = [{ titre: '', nbr: 0 }],
    public length_Tb_AppPlugins: number = 0,
    public tbCommentairePlugins: NotifyModel[] = [{ titre: '', nbr: 0 }],
    public nbrTotalNotifyPlugin: number = 0,
    public tbNotifyVideo: NotifyModel[] = [{ titre: '', nbr: 0 }]
  ) {}
}
