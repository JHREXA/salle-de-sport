/* Ce code est une classe TypeScript pour un composant Angular qui gère un CRUD (Create, Read, Update, Delete) de membres. Voici une explication détaillée de chaque partie du code :
1 - Décorateur '@Component'
2 - Classe 'AppComponent' et implémentation de 'OnInit'
3 - Propriétés
4 - Constructeur
5 - Méthode 'ngOnInit'
6 - Gestion des modals
7 - Gestion des membres (Ajouter, Éditer, Supprimer)
8 - Chargement des membres
9 - Classe Member */

import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/* 1 - Décorateur '@Component' */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']  // Corregido a styleUrls
})

/* 2 - Classe 'AppComponent' et implémentation de 'OnInit' */
export class AppComponent implements OnInit {
  title = 'crud';

/* 3 - Propriétés */
  @ViewChild('myModal') modal: ElementRef | undefined;
  memberObj: Member = new Member();
  memberList: Member[] = []; 

/* 4 - Constructeur */
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

/* 5 - Méthode 'ngOnInit' */
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadMembers();
    }
  }

/* 6 - Gestion des modals */
  openModal() {
    const modal = document.getElementById("myModal");
    if (modal != null) {
      modal.style.display = 'block';
    }
  }

  closeModal() {
    this.memberObj = new Member();
    if (this.modal != null) {
      this.modal.nativeElement.style.display = 'none';
    }
  }

/* 7 - Gestion des membres (Ajouter, Éditer, Supprimer) */
  onEdit(item: Member){
    this.memberObj = item;
    this.openModal();
  }

  saveMember() {
    if (isPlatformBrowser(this.platformId) && typeof window !== 'undefined' && window.localStorage) {
      const storageKey = 'angular17crud';
      const isLocalPresent = localStorage.getItem(storageKey);

      if (isLocalPresent) {
        const oldArr = JSON.parse(isLocalPresent);
        this.memberObj.id = oldArr.length + 1;
        oldArr.push(this.memberObj);
        localStorage.setItem(storageKey, JSON.stringify(oldArr));
      } else {
        const newArr = [this.memberObj];
        this.memberObj.id = 1; 
        localStorage.setItem(storageKey, JSON.stringify(newArr));
      }
    } else {
      console.error('localStorage is not available');
    }
    this.closeModal();
    this.loadMembers()
  }

  updateMember(){
    const currentRecord = this.memberList.find(m=> m.id === this.memberObj.id);
    if(currentRecord != undefined){
        currentRecord.nom = this.memberObj.nom;
        currentRecord.adresse = this.memberObj.adresse;
        currentRecord.numeroTel = this.memberObj.numeroTel;
    } 
    localStorage.setItem('angular17crud', JSON.stringify(this.memberList));
    this.closeModal();
  }

  onDelete(item: Member){
    const isDelete = confirm("Êtes-vous sûr(e) de vouloir éliminer ce(tte) membre ?");
    if(isDelete){
        const currentRecord = this.memberList.findIndex(m=> m.id === this.memberObj.id);
        this.memberList.splice(currentRecord,1);
        localStorage.setItem('angular17crud', JSON.stringify(this.memberList));
    }
  }

/* 8 - Chargement des membres */
  loadMembers() {
    const localData = localStorage.getItem('angular17crud');
    if (localData) {
      this.memberList = JSON.parse(localData);
    }
  }
}

/* 9 - Classe Member */
export class Member {
  id: number;
  nom: string;
  email: string;
  numeroTel: string;
  ville: string;
  region: string;
  codePostal: string;
  adresse: string;

  constructor() {
    this.id = 0;
    this.nom = '';
    this.email = '';
    this.numeroTel = '';
    this.ville = '';
    this.region = '';
    this.codePostal = '';
    this.adresse = '';
  }
}
