/*export interface BugModel {
  bug_Id: string;
  user_Id: string | undefined;
  language: string;
  titre: string;
  details: string;
  etat: string;
  date: number;
}
*/

//Model du Bugs
//TODO
export class BugModel {
  constructor(
    public bug_Id: string,
    public user_Id: string | undefined,
    public language: string,
    public titre: string,
    public details: string,
    public etat: string,
    public bugUpdate: number,
    public date: number,
    public codeBug: string[]
  ) {}
}
