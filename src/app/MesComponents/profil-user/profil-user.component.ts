import { Component, OnInit } from '@angular/core';
import { GardGuard } from 'src/app/Mes_Services/gard.guard';
import { UserService } from 'src/app/Mes_Services/user.Service';

@Component({
  selector: 'app-profil-user',
  templateUrl: './profil-user.component.html',
  styleUrls: ['./profil-user.component.css'],
})
export class ProfilUserComponent implements OnInit {
  nomUser: string = '';
  prenomUser: string = '';
  emailUser: null | string = '';
  promoUser: string = '';
  modeNavUser: string = 'false';
  Id_User_Connected: string = '';
  constructor(private user: UserService, private gard: GardGuard) {}

  ngOnInit(): void {
    ///Recuperation de l'ID du User Connecter et son email
    //TODO
    this.Id_User_Connected = this.gard.user_Id_Connect;

    //recuperation des information du User Connected
    //TODO
    this.user
      .getInfoUser(this.Id_User_Connected)
      .then((data_User) => {
        this.nomUser = data_User.nom;
        this.prenomUser = data_User.prenom;
        this.promoUser = data_User.promotion;
        this.modeNavUser = data_User.fantome;

        //Recupere par le gard nom pas par userService mise ici pour tout les donnees
        //s'affiche en mm temps...tout simplement
        this.emailUser = this.gard.user_Email_Connect;
      })
      .catch((error) => {
        alert("Une erreur s'est produite ...");
      });
  }
}
