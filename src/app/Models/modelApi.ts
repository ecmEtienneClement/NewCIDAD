//Model AppVideo
//TODO
export interface AppVideo {
  language: string;
  description: string;
  urlVideo: string;
  userId: string;
}
//Model AppPlugin
//TODO
export interface AppPlugin {
  _id?: any;
  language: string;
  documentation: string;
  code: string;
  tbCommentaire: Array<string>;
  userId: string;
  date: number;
}
//Model USER MONGO
//TODO
export interface UserMongo {
  _id?: any;
  email: string;
  password: string;
}
