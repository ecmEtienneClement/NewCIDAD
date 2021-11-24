import {
  Component,
  AfterViewInit,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import gsap from 'gsap';
import { AppPlugingService } from 'src/app/Mes_Services/appPlugin.Service';
import { AppVideoService } from 'src/app/Mes_Services/appVideo.Service';
import { BugService } from 'src/app/Mes_Services/bug.Service';
import { ErrorService } from 'src/app/Mes_Services/error.Service';
import { LocalService } from 'src/app/Mes_Services/local.Service';
@Component({
  selector: 'app-select-bdet-pourc',
  templateUrl: './select-bdet-pourc.component.html',
  styleUrls: ['./select-bdet-pourc.component.css'],
})
export class SelectBDetPourcComponent implements OnInit, AfterViewInit {
  pourcentage: any = 0;
  checkedPost: boolean = false;
  checkedPluging: boolean = false;
  checkedVideo: boolean = false;
  @ViewChild('bd') itemBd: ElementRef;
  constructor(
    private bugService: BugService,
    private pluginService: AppPlugingService,
    private videoService: AppVideoService,
    private localService: LocalService,
    private alertError: ErrorService
  ) {}

  ngOnInit(): void {}
  ngAfterViewInit(): void {
    this.animBd();
  }
  animBd() {
    let instance = gsap.timeline();
    instance.from(this.itemBd.nativeElement.childNodes, {
      ease: 'back',
      y: -400,
      opacity: 0,
      stagger: 1,
      duration: 2,
    });
    instance.from('.row-progress', {
      opacity: 0,
      duration: 1.5,
    });
    instance.from('.col-select', {
      opacity: 0,
      duration: 1.5,
    });
    instance.from('.col-btn', {
      opacity: 0,
      duration: 1.5,
    });
    instance.to(this.itemBd.nativeElement.childNodes, {
      ease: 'back',
      y: -15,
      stagger: 1,
      repeat: -1,
      duration: 2,
    });
  }
  //Methode pour le demarage du sauvegarde
  //TODO
  demarrerSauvegard(): boolean {
    if (!this.checkedPost && !this.checkedPluging && !this.checkedVideo) {
      this.alertError.notifyAlertErrorDefault(
        'Veillez choisir au moins une BD ...'
      );
      return false;
    }
    if (this.pourcentage == 0 || this.pourcentage == '0') {
      this.alertError.notifyAlertErrorDefault(
        'Veillez définir le pourcentage de sauvegarde ...'
      );
      return false;
    }
    this.traitementPourcentage();
    this.localService.onCheckedBdSauvegarde(
      this.checkedPost,
      this.checkedPluging,
      this.checkedVideo
    );
    if (this.checkedPost) {
      this.bugService.sauvegardeDbBugCryptLocal();
    }
    if (this.checkedPluging) {
      this.pluginService.sauvegardeDbPluginCryptLocal();
    }
    if (this.checkedVideo) {
      this.videoService.sauvegardeDbVideoCryptLocal();
    }
    return true;
  }
  //Methode pour le traitement du pourcentage
  //TODO
  traitementPourcentage() {
    switch (this.pourcentage) {
      case '100':
        this.localService.savePoucentageDoneLocal(1);
        break;
      case '75':
        this.localService.savePoucentageDoneLocal(3);
        break;
      case '50':
        this.localService.savePoucentageDoneLocal(2);
        break;
      case '25':
        this.localService.savePoucentageDoneLocal(4);
        break;
    }
  }
}
