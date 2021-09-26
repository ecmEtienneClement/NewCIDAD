import { NotifyModel } from './eventAction';

export class NotificationModel {
  constructor(
    public id_User?: string,
    public nbrTotalNotify: number = 0,
    public length_Tb_Bug: number = 0,
    public tbIdReponseBug: NotifyModel[] = [{ id: '', nbr: 0 }],
    public tbIdCommentaireReponse: NotifyModel[] = [{ id: '', nbr: 0 }]
  ) {}
}
