import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AppVideoService } from 'src/app/Mes_Services/appVideo.Service';
import { GardGuard } from 'src/app/Mes_Services/gard.guard';
import { Notification } from 'src/app/Mes_Services/notification.service';

@Component({
  selector: 'app-enrgistre-video-cmp',
  templateUrl: './enrgistre-video-cmp.component.html',
  styleUrls: ['./enrgistre-video-cmp.component.css'],
})
export class EnrgistreVideoCmpComponent implements OnInit {
  //Variable pour le btn d'enregistrement desactiver le btn enregistrer d'est k'il click une fw
  diseableBtnEnregistre: boolean = false;
  myForm: FormGroup;
  user_Id_Connect: string = '';
  constructor(
    private formBuilder: FormBuilder,
    private appVideoService: AppVideoService,
    private authService: GardGuard,
    private _snackBar: MatSnackBar,
    private route: Router,
    private notifyService: Notification
  ) {}

  ngOnInit(): void {
    //Recuperation du User_Id
    //TODO
    this.user_Id_Connect = this.authService.user_Id_Connect;
    this.initForm();
  }

  initForm() {
    this.myForm = this.formBuilder.group({
      cour: ['', Validators.required],
      titre: ['', Validators.required],
      url: ['', Validators.required],
    });
  }

  onSubmitForm(): boolean {
    this.diseableBtnEnregistre = true;
    //https://www.youtube.com/watch?v=VqNFvScAKA4
    //https://drive.google.com/file/d/1GdAxDtAbFgu2zye8f7P2HtSCejNNF2u3/view?usp=sharing
    const valueForm = this.myForm.value;
    let cour: string = valueForm['cour'];
    let titre: string = valueForm['titre'];
    let url: string = valueForm['url'];
    if (url.startsWith('http://') || url.startsWith('http:')) {
      const message = 'Désoler nous ne prenons pas les URL non sécurisés !';
      //Affichage de l'alerte
      this.openSnackBar(message, 'ECM');
      this.diseableBtnEnregistre = false;
      return false;
    }
    if (url.startsWith('https://www.youtube.com/')) {
      const message = 'Désoler nous ne prenons pas les URL videos de youtube !';
      //Affichage de l'alerte
      this.openSnackBar(message, 'ECM');
      this.diseableBtnEnregistre = false;
      return false;
    }
    if (url.startsWith('https://')) {
      this.appVideoService
        .creatNewAppVideo(
          this.user_Id_Connect,
          cour,
          titre,
          url,
          [],
          [this.user_Id_Connect]
        )
        .then((good: boolean) => {
          if (good) {
            //j'injecte notify ici pour eviter erreur N0200 circular ID avec le service appVideo
            //que je doit injecter dans notification service
            this.notifyService.notifyNewVideo(titre);
            const message = 'URL video a été bien publié !';
            //Affichage de l'alerte
            this.openSnackBar(message, 'ECM');
            this.route.navigate(['appVideo']);
          }
        })
        .catch(() => {
          this.diseableBtnEnregistre = false;
        });

      return true;
    }
    const message = 'Veillez entrez un URL valide !';
    //Affichage de l'alerte
    this.openSnackBar(message, 'ECM');
    return false;
  }

  //Methode Pour Les Notifications ...C'est un service..
  //TODO
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}
