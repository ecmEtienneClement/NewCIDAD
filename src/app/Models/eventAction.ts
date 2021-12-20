/*
    MISE EN PLACE DE MES DIFFERENTS TYPES D'EVENEMENTS A EMETTRE .....
*/

import { BugModel } from './bug';
import { ReponseBugModel } from './reponseBug';

export enum EventType {
  //.................EVENEMENTS EMISENT DE LA PARTIE  BUG........................
  //TODO
  VIEW_INFO_USER = '[BugModel] afficher information du user',
  NAVIGATBUG = '[BugModel] naviger ver detail bug',
  NBR_REPONSE = '[BugModel] le nombre de reponse de ce bug',
  UPDATEBUG = '[BugModel] modifier le bug',
  CHANGEETATBUG = '[BugModel] changer etat du bug',
  DELETEBUG = '[BugModel] supprimer cet bug',
  VIEW_REPONSE_BUG = '[BugModel] maquer vue a la reponse',
  VIEW_COMMENTAIRE_REPONSE_BUG = '[BugModel] maquer vue au commentaire de la reponse',
  ANIM_NOTIFY_SUCCESS_BUG = '[BugModel] animation suucess bdbug',
  // ANIM_TOTAL_CARD = '[BugModel] animation des cards ',
  //NO_ANIM_TOTAL_CARD = '[BugModel] arrete animation des cards ',
  //FIN_ANIM_CARD = '[BugModel] fin animation card ',
  //.................EVENEMENTS EMISENT DE LA PARTIE REPONSES BUG........................
  //TODO
  CHEKED_REPONSE_BUG = '[ReponseBugModel] coche cette reponse du bug',
  DELETE_REPONSE_BUG = '[ReponseBugModel] supprimer cette reponse du bug',
  VOIR_COMMENTAIRES__REPONSE_BUG = '[ReponseBugModel] voir commentaire de cette reponse du bug',
  COMMENTER__REPONSE_BUG = '[ReponseBugModel] commente de cette reponse du bug',
  DELETE_COMMENTAIRE_REPONSE_BUG = '[ReponseBugModel] supprimer le commentaire de la reponse',
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
  //.................EVENEMENTS EMISENT POUR LES PARAMETRE AFFICHAGE PLUGIN ,VIDEO ,DETAILE ECM........................
  OPEN_BTN = 'deployement boutons general',
  CLOSE_BTN = 'fermer boutons general',
  //.................EVENEMENTS EMISENT POUR PARAMETRE AFFICHAGE PLUGIN ........................
  AFFICHE_PARAMETRE_PLUGIN = 'affichage des parametre du plugin',
  OPEN_BTN_CARD_PLUGIN = 'deployement des boutons card',
  //.................EVENEMENTS EMISENT POUR PARAMETRE AFFICHAGE VIDEO........................
  AFFICHE_PARAMETRE_VIDEO = 'affichage des parametre du video',
  OPEN_BTN_CARD_VIDEO = 'deployement du bouton video',
  //.................EVENEMENTS EMISENT POUR PARAMETRE AFFICHAGE DETAILE ECM........................
  AFFICHE_PARAMETRE_DT_ECM = 'fermer les parametres du  detail ecm',
  OPEN_BTN_CARD_DT_ECM = 'deployement du bouton  detail ecm',
  ANNIM_CLIQUER_POUR_DEPLIER = 'annimer cliquer pour deplier',
  //.................EVENEMENTS EMISENT POUR LE CHANGE DE LA PAGE DE PAGINATION........................
  CHANGE_PAGINATE = 'changement de la page de pagination',
  //.................EVENEMENTS EMISENT POUR LES NOTIFICATIONS........................
  NEW_REPONSE = 'vous avez une nouvelle reponse',
  NEW_Commentaire = 'vous avez un nouveau commentaire',
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
  data_paylode_obj?: BugModel | ReponseBugModel;
  data_paylode_String?: string;
  data_paylode_Donnee_String?: string;
}
//Modele d'evenement pour objReponseBug ...
//TODO
export interface EventModelObjBug {
  type: EventType;
  data_paylode_obj_Bug: BugModel;
  data_paylode_String?: string;
  data_paylode_Number?: number;
}
//Modele d'evenement pour objReponseBug ...
//TODO
export interface EventModelObjReponse {
  type: EventType;
  data_paylode_obj_Reponse: ReponseBugModel;
  data_paylode_String?: string;
  data_paylode_Number?: number;
}

//Modele pour la notification id et valeur
//TODO
export interface NotifyModel {
  titre: string;
  nbr: number;
}
