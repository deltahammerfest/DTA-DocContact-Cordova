import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {ApiServicesProvider} from "../api-services/api-services";
import { Md5 } from "ts-md5/dist/md5"
import {Contact} from "../../model/Contact";
import {Storage} from "@ionic/storage";
import {User} from "../../model/User";

@Injectable()
export class ContactServicesProvider {

  constructor(public http: HttpClient, public apiServices: ApiServicesProvider, private storage: Storage) {
    console.log('Hello ContactServicesProvider Provider');
  }

  getContacts(token: string){
    return new Promise(resolve => {
      this.apiServices.getContacts(token).toPromise().then((contacts: any)=>{
       resolve(contacts)
      })
        .catch(error=>{
        console.log(error)
      })
    })
  }

  createContact(firstName: string, lastName: string, phone: string, email: string, profile: string, emergency: boolean, token: string){
    let gravatar = this.createGravatar(email);
    return new Promise( resolve =>{
      this.apiServices.createContact(firstName, lastName, phone, email, profile, gravatar, emergency, token).toPromise().then( contact=>{
        resolve(contact)
      })
        .catch(error=>{
        console.log(error)
      })
    })

  }

  updateContact(firstName: string, lastName: string, phone: string, email: string, profile: string, emergency: boolean, token: string, id: string){
    let gravatar = this.createGravatar(email);
    return new Promise( resolve =>{
      this.apiServices.updateContact(firstName, lastName, phone, email, profile, gravatar, emergency, token, id).toPromise().then( contact=>{
        resolve(contact)
      })
    })
      .catch(error=>{
        console.log(error)
      })
  }

  deleteContact(id: string, token: string){
    return new Promise( resolve=> {
      this.apiServices.deleteContact(id, token).toPromise().then( reponse=>{
        resolve(reponse)
      })
        .catch(error=>{
          console.log(error)
        })
    })
  }

  createGravatar(mail: string){
    var mailMd5 = Md5.hashStr(mail.trim().toLowerCase());
    var gravatar = `https://www.gravatar.com/avatar/${mailMd5}`;
    return gravatar;
  }

  storeContact(contact: Contact){
    this.storage.get('user').then((user: User)=>{
      user.contacts.push(contact);
      })
  }
  /*storeContacts(user: User,contacts: any){
    this.storage.get('user').then((user: User)=>{
      for contact: Contact of contacts {
        this.storeContact(user, contact)
      }
    })
  }*/
}
