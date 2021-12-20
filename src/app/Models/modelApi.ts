//Model USER MONGO

import { CommentaireModel } from './commentaire';
import { NotifyModel } from './eventAction';

//TODO
export interface UserECM {
  TK: string | null;
  userIdFB: string | null;
  userIdMG: string | null;
}
//TODO
export interface UserMongo {
  _id: any;
  email: string;
  password: string;
}
//Model AppPlugin
//TODO
export interface AppVideo {
  _id: any;
  userId: string;
  cour: string;
  titre: string;
  url: string;
  signaler: string[];
  viewUser: string[];
  date: number;
}

//Model AppPlugin
//TODO
export interface AppPlugin {
  _id?: any;
  language: string;
  documentation: string;
  code: string;
  tbCommentaire: CommentaireModel[];
  userId: string;
  date: string;
  update: number;
  tbViewUser: string[];
  tbSignalCommentaire: string[];
  tbViewCommentaire: string[];
}
//Model AppPlugin
//TODO
export interface NotifyMongo {
  _id?: any;
  idUser: string;
  tbAppPlugins: number;
  tbCommentairePlugins: NotifyModel[];
  updateMany: string;
}
