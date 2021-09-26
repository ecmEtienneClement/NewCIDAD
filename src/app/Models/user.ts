/*
  ................................DEFINITION DU MODEL USER ................................
*/
//TODO
export class UserModel {
  constructor(
    public nom: string,
    public prenom: string,
    public promotion: string,
    public mail: string,
    public mdp: string,
    public fantome: string = 'false',
    public code: any = 1234,
    public securite: string = 'true'
  ) {}
}
