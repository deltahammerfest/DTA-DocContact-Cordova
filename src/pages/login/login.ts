import { Component } from '@angular/core';
import {Events, IonicPage, MenuController, NavController, ToastController} from 'ionic-angular';
import { InscriptionPage } from '../inscription/inscription';
import { ContactListPage } from '../contact-list/contact-list';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UserServicesProvider} from "../../providers/user-services/user-services";


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  phoneNumber: string = '0655545546'; // Supprimer la valeur dans la version finale
  password: string = '0000';    // Supprimer la valeur dans la version finale
  //rememberMe: boolean = false;  //On verra plus tard

  phoneNumberCtrl: FormControl;
  passwordCtrl: FormControl;
  userForm: FormGroup;


  constructor(fb: FormBuilder, private toastCtrl: ToastController, public navCtrl : NavController, public events: Events,
              public userServices : UserServicesProvider, public menuCtrl: MenuController) {

    this.userServices = userServices;
    this.menuCtrl.enable(false);
    this.phoneNumberCtrl = fb.control('', [Validators.maxLength(10), Validators.required]);
    this.passwordCtrl = fb.control('', [ Validators.minLength(4), Validators.maxLength(4), Validators.required]);

    this.userForm = fb.group({
      phoneNumber: this.phoneNumberCtrl,
      password: this.passwordCtrl,
    });
  }

  handleSubmit() {
    this.userServices.logTheUser(this.phoneNumber, this.password)
      .then((response: any)=>{
        if(response.status === 400){
          let toast = this.toastCtrl.create({
            message: 'Le nom d\'utilisateur ou le mot de passe est incorrect',
            duration: 3000,
            position: 'bottom'
          });
          toast.present().then();
        }
        if(response.token !== undefined){
          this.userServices.getUser(response.token).then(user=> {
            console.log(user);
            this.userServices.token=response.token; // Variable de debug, faire autrement pour la version finale
            this.goToContactList();
          });
        }
      })
      .catch();
  }

  ionViewDidLoad() {
  }

  goToInscription(){
    this.navCtrl.push(InscriptionPage).then();
  }

  goToContactList(){
    this.navCtrl.setRoot(ContactListPage).then();
  }

}
