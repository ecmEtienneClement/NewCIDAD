import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Mes_Services/auth.Service';
import { GardGuard } from 'src/app/Mes_Services/gard.guard';
import { UserService } from 'src/app/Mes_Services/user.Service';
import { UserModel } from 'src/app/Models/user';
@Component({
  selector: 'app-parametre',
  templateUrl: './parametre.component.html',
  styleUrls: ['./parametre.component.css'],
})
export class ParametreComponent implements OnInit {
  mail: any = '@gmail.com';
  mdp: string | any;
  confmdp: string | any;
  confirmdp: any;
  afficheBlocMail: boolean | any = false;
  afficheBlocMdp: boolean | any = false;
  btnDisabledModifMdp: boolean | any = false;
  afficheBlocDeleteUser: boolean | any = false;
  colorSelectedMail: any = 'black';
  colorSelectedMdp: any = 'black';
  colorSelectedUser: any = 'black';
  User: UserModel;
  userId: string;
  constructor(
    private route: Router,
    private userService: UserService,
    private auth: GardGuard
  ) {}

  ngOnInit(): void {}

  updateMail() {
    this.colorSelectedMail = 'blue';
    this.afficheBlocMail = true;
  }

  noUpdateMail() {
    this.colorSelectedMail = 'black';
    this.mail = '@gmail.com';
    this.afficheBlocMail = false;
  }

  updatemdp() {
    this.colorSelectedMdp = 'blue';
    this.afficheBlocMdp = true;
  }
  noUpdateMdp() {
    this.colorSelectedMdp = 'black';
    this.mdp = '';
    this.confmdp = '';
    this.afficheBlocMdp = false;
  }
  deleteUser() {
    this.colorSelectedUser = 'blue';
    this.afficheBlocDeleteUser = true;
  }
  nodeleteUser() {
    this.colorSelectedUser = 'black';
    this.afficheBlocDeleteUser = false;
    this.confirmdp = '';
  }
  colorConfirmation() {
    if (this.mdp == this.confmdp) {
      this.btnDisabledModifMdp = true;
      return 'green';
    } else {
      this.btnDisabledModifMdp = false;
      return 'red';
    }
  }
}
