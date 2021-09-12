export class ReponseBugModel {
  constructor(
    public id_Reponse: string,
    public bug_Id: string,
    public user_Id: string | undefined,
    public reponse: string,
    public isGood: boolean,
    public commentaire: string[],
    public dateReponse: number
  ) {}
}
