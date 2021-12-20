import * as moment from 'moment';
moment.locale('fr');
export class CommentaireModel {
  //La valeur null c'est du au localStorage qui peut etre de valeur null
  constructor(
    public commentaire: string,
    public Id_User: string,
    public nomUser: string | null = 'fantôme',
    public prenomUser: string | null = '',
    public promoUser: string | null = '',
    public dateCommentaire: string = moment().format('Do MMMM YYYY, HH:mm:ss')
  ) {}
}
