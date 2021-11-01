export class CommentaireModel {
  //La valeur null c'est du au localStorage qui peut etre de valeur null
  constructor(
    public commentaire: string,
    public Id_User: string,
    public nomUser: string | null = 'fantome',
    public prenomUser: string | null = '',
    public promoUser: string | null = '',
    public dateCommentaire: number = Date.now()
  ) {}
}
