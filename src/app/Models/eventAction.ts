/*
    MISE EN PLACE DE MES DIFFERENTS TYPES D'EVENEMENTS A EMETTRE .....
*/

export enum EventType {
  //.................EVENEMENTS EMISENT DE LA PARTIE  BUG........................
  //TODO
  VIEW_INFO_USER = '[BugModel] afficher information du user',
  NAVIGATBUG = '[BugModel] naviger ver detail bug',
  NBR_REPONSE = '[BugModel] le nombre de reponse de ce bug',
  UPDATEBUG = '[BugModel] modifier le bug',
  CHANGEETATBUG = '[BugModel] changer etat du bug',
  DELETEBUG = '[BugModel] supprimer cet bug',
  //.................EVENEMENTS EMISENT DE LA PARTIE REPONSES BUG........................
  //TODO
  CHEKED_REPONSE_BUG = '[ReponseBugModel] coche cette reponse du bug',
  DELETE_REPONSE_BUG = '[ReponseBugModel] supprimer cette reponse du bug',
  VOIR_COMMENTAIRES__REPONSE_BUG = '[ReponseBugModel] voir commentaire de cette reponse du bug',
  COMMENTER__REPONSE_BUG = '[ReponseBugModel] commente de cette reponse du bug',
  //.................EVENEMENTS EMISENT POUR LA VERIFICATION DU CODE USER........................
  //TODO
  VERIFICATION_CODE = 'verifier si le mot de passe est correcte',
  //.................EVENEMENTS EMISENT POUR L'ARRIVE DE LA BD NOTIFY........................
  BD_NOTIFY_LOADED = 'la bd notification est bien rechargée',
  //.................EVENEMENTS EMISENT POUR PARAMETRE AFFICHAGE ECM........................
  AFFICHE_PARAMETRE_ECM = 'affichage des parametres de ecm',
  FERMER_PARAMETRE_ECM = 'fermer les parametres de ecm',
  OPEN_BTN_DETAILS = 'deployement du bouton details',
  OPEN_BLOC_BTN = 'deployement du bloc des boutons',
  ANIMATION_LIGNES = 'activer animation des lignes',
  //.................EVENEMENTS EMISENT POUR PARAMETRE AFFICHAGE PLUGIN........................
  AFFICHE_PARAMETRE_PLUGIN = 'affichage des parametre du plugin',
  FERMER_PARAMETRE_PLUGIN = 'fermer les parametres du plugin',
  OPEN_BTN_CARD_PLUGIN = 'deployement du bouton details',
}

//...................................................................................................
/*
    MISE EN PLACE DU MODEL D'EVENEMENTS A EMETTRE .....
*/
//Modele d'evenement pour data_paylode_PageNavigate voire commentaire ECM sur indice ...
//TODO
export interface EventModel {
  type: EventType;
  data_paylode_Number?: number;
  data_paylode_String?: string;
  data_paylode_Donnee_String?: string;
}

//Modele pour la notification id et valeur
//TODO
export interface NotifyModel {
  titre: string;
  nbr: number;
}
