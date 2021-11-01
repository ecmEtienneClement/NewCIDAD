import { CommentaireModel } from './commentaire';

export class ReponseBugModel {
  constructor(
    public id_Reponse: string,
    public bug_Id: string,
    public user_Id: string,
    public reponse: string,
    public isGood: boolean,
    public commentaire: CommentaireModel[],
    public dateReponse: number,
    public tbcommentaireUser: string[] = [user_Id],
    public tbViewUser: string[] = [user_Id],
    public tbViewcommentaireUser: string[] = [user_Id]
  ) {}
}
