import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';

// typical import
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { LocalService } from 'src/app/Mes_Services/local.Service';

gsap.registerPlugin(TextPlugin);
@Component({
  selector: 'app-initialisation',
  templateUrl: './initialisation.component.html',
  styleUrls: ['./initialisation.component.css'],
})
export class InitialisationComponent implements OnInit, AfterViewInit {
  constructor(
    private route: Router,
    private localService: LocalService,
 
  ) {}

  @ViewChild('itemTitre') titre: ElementRef;
  @ViewChild('itemTitreLocalActiver') titreActive: ElementRef;
  @ViewChild('menu') menu: ElementRef;
  @ViewChild('menuActiver') menuActive: ElementRef;

  localIsActivated: boolean = false;
  ngOnInit(): void {
    //Verification du mode local
    this.verifyLocalIsActivated();
  }
  ngAfterViewInit(): void {
    if (!this.localIsActivated) {
      this.animTitre();
    }
    if (this.localIsActivated) {
      this.animTitreLocalActive();
    }
  }
  //..........................................................
  //Methode pour animation titre
  //TODO
  animTitre() {
    let instance = gsap.timeline();
    instance.from(this.titre.nativeElement.childNodes, {
      ease: 'back',
      y: -200,
      stagger: 1,
      duration: 2,
    });
    instance.from(this.menu.nativeElement.childNodes, {
      ease: 'back',
      opacity: 0,
      x: 400,
      stagger: 3,
      duration: 3,
    });
    instance.from(this.menu.nativeElement.childNodes, {
      ease: 'back',
      y: -20,
      stagger: 1,
      repeat: -1,
      duration: 2,
    });
  }
  //Methode pour animation titre
  //TODO
  animTitreLocalActive() {
    let instance = gsap.timeline();
    instance.to('.titreLocal', {
      ease: 'back',
      text: 'Local Activé ...',
      duration: 5,
      repeat: -1,
    });
  }
  //Methode pour mener ver la selection des DB
  //TODO
  gotoSelectBdPour() {
    //Activation du mode local
    localStorage.setItem('ECM_Local', window.btoa('true'));
    this.route.navigate(['local/init/EcmBd/BdPourc']);
  }
  //Methode pour verifier si le mode local est activer
  //TODO
  verifyLocalIsActivated() {
    const result: boolean | number = this.localService.verifyModeLocal();
    if (result == true) {
      this.localIsActivated = true;
    } else if (result == false) {
      this.localIsActivated = false;
    }
  }
  //Methode pour voir les détails
  //TODO
  detailsModeLocal() {
    alert('ok');
    //this.showSuccess('Mode Local activé avec succés ');
  }
  //Methode pour desactiver le mode local
  //TODO
  DesactiveModeLocal() {
    //Activation du mode local
    localStorage.setItem('ECM_Local', window.btoa('false'));
  }
}
