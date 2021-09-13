/*
    MISE EN PLACE DE MES DIFFERENTS TYPES D'EVENEMENTS A EMETTRE .....
*/

export enum EventType {
  //.................EVENEMENTS EMISENT DE LA PARTIE  BUG........................
  //TODO
  VIEW_INFO_USER = '[BugModel] afficher information du user',
  NAVIGATBUG = '[BugModel] naviger ver detail bug',
  UPDATEBUG = '[BugModel] modifier le bug',
  CHANGEETATBUG = '[BugModel] changer etat du bug',
  DELETEBUG = '[BugModel] supprimer cet bug',
  //.................EVENEMENTS EMISENT DE LA PARTIE REPONSES BUG........................
  //TODO
  CHEKED_REPONSE_BUG = '[ReponseBugModel] coche cette reponse du bug',
  DELETE_REPONSE_BUG = '[ReponseBugModel] supprimer cette reponse du bug',
  VOIR_COMMENTAIRES__REPONSE_BUG = '[ReponseBugModel] voir commentaire de cette reponse du bug',
  COMMENTER__REPONSE_BUG = '[ReponseBugModel] commente de cette reponse du bug',
}

//...................................................................................................
/*
    MISE EN PLACE DU MODEL D'EVENEMENTS A EMETTRE .....
*/
//Modele d'evenement pour data_paylode_PageNavigate voire commentaire ECM sur indice ...
//TODO
export interface EventModel {
  type: EventType;
  data_paylode_Number: number;
  data_paylode_String?: string;
  data_paylode_PageNavigate?: number;
}
