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
    public fantome: boolean = false,
    public code: string[] = ['A', 'B', 'C', 'D']
  ) {}
}
