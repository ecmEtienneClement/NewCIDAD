import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// typical import
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
gsap.registerPlugin(TextPlugin);
@Component({
  selector: 'app-send-questionnaire',
  templateUrl: './send-questionnaire.component.html',
  styleUrls: ['./send-questionnaire.component.css'],
})
export class SendQuestionnaireComponent implements OnInit {
  btnSendForm: boolean = true;

  constructor(private route: Router) {}

  ngOnInit(): void {}
  //Methode de send form questionnaire
  //TODO
  sendFormulaire() {
    this.btnSendForm = false;
    let instance = gsap.timeline();
    instance.to('.container-fluid .txtdemande h2', {
      delay: 0.5,
      text: 'DIADEUF',
      duration: 1.5,
    });
    instance.to('.container-fluid .txtdemande p', {
      delay: 0.5,
      text: 'MERCI ! ETIENNE CLEMENT MBAYE',
      duration: 2,
    });
    instance.to('.btnPasser', {
      delay: 0.5,
      text: 'Continuer',
      duration: 1,
    });
  }
  //Methode continuer ou passer idem
  //TODO
  next() {
    let instance = gsap.timeline();

    instance.to('.txtdemande', {
      opacity: 0,
      duration: 1,
    });
    instance.to('.txtdemande', {
      visibility: 'hidden',
      duration: 0.1,
    });

    instance.to('.param', {
      ease: 'back',
      y: 0,
      stagger: 1,
      duration: 1,
    });

    instance.to('.param', {
      rotate: 360,
      stagger: 1,
      duration: 1,
    });
  }
  continer() {
    let instance = gsap.timeline();
    instance.to('.param', {
      opacity: 0,
      stagger: 1,
      duration: 1,
    });
    setTimeout(() => {
      this.route.navigate(['aide']);
    }, 5000);
  }
  //Methode animation txt active
  //TODO
  animActiveCompte() {
    let instance = gsap.timeline();
    instance.to('.container-fluid h1', {
      delay: 2,
      text: 'COMPTE ACTIVÉ',
      duration: 3,
      repeat: -1,
    });
  }
}
