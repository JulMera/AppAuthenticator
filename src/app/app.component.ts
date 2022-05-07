import { Component, ViewChild  } from '@angular/core';
import {  Nav, Platform, AlertController, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {TranslateService} from '@ngx-translate/core';
import { SQLite } from '@ionic-native/sqlite';
import { TasksServiceProvider } from '../providers/tasks-service/tasks-service';
import { App } from 'ionic-angular';
import { Push, PushObject, PushOptions } from '@ionic-native/push/';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpProvider } from '../providers/http/http';
import { UtilsProvider } from '../providers/utils/utils';
//import { Keyboard } from '@ionic-native/keyboard';


@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class MyApp {
  rootPage = 'LoginPage';
  //rootPage = 'InboxPage';
  //rootPage = 'BandejaMenuPage';
  @ViewChild(Nav) nav: Nav;
  //rootPage = 'AfiliacionPage';
  //rootPage = 'ValidacionPositivaPage';
  //rootPage = 'InboxPage';
  //private navCtrl: NavController;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, 
              private translateService: TranslateService, public sqlite: SQLite, public push: Push, private storage: Storage,
              public tasksService: TasksServiceProvider,public  app: App, public alertCtrl: AlertController, private geolocation: Geolocation, public http:HttpProvider,
              public utils: UtilsProvider){

    //this.navCtrl = app.getActiveNav();

    this.platform.ready().then(() => {
      //Language
      this.translateService.setDefaultLang('en_us');
      this.translateService.use('en_us');

      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.geolocation.getCurrentPosition().then((resp) => {
        
        this.storage.set('latitud', resp.coords.latitude);
        this.storage.set('longitud', resp.coords.longitude);
        
      }).catch((error) => {
        
        this.storage.set('latitud', 0);
        this.storage.set('longitud', 0);
      });

      this.push.hasPermission()
           .then(res => {
             //alert("res"+res)
             if (res.isEnabled) {
               //alert('We have permission to send push notifications'); 
             } else {
               //alert('We do not have permission to send push notifications');
             }
           });

            // inicializamos la configuraciÃ³n para android y ios
         const options: PushOptions = {
          android: {
            senderID: '663636742494',
            //foreground: 'true',
            forceShow: true,
            sound: 'true'
          },
          ios: {
            alert: true,
            badge: true,
            sound: 'false'
          },
          windows: {}
        };

        const pushObject: PushObject = this.push.init(options);

        pushObject.on('notification').subscribe((notification: any) => {
          this.storage.set('pushMensaje', notification);
        });
        
        pushObject.on('registration').subscribe((registration: any) => {
          const registrationId = registration.registrationId;
          this.storage.set('pushID', registrationId);

        });

        pushObject.on('error').subscribe(error => {
          console.error('Error with Push plugin', error)
        });

      

    });

    this.http.callServerP().then(res => {
      console.log("mensaje=>Respuesta : "+JSON.stringify(res));

      let  respuesta=  this.utils.decodeText(res.key);
        console.log("mensaje=>Respuesta2 : "+respuesta);
     
        this.http.salt = respuesta.split(",")[0];
        this.http.iv = respuesta.split(",")[1];         
        this.http.passphrase = respuesta.split(",")[2];
        this.http.idkey= respuesta.split(",")[3];


        console.log("mensaje=>key salt= "+ this.http.salt);
        console.log("mensaje=>key iv= "+ this.http.iv);
        console.log("mensaje=>key passphrase= "+ this.http.passphrase);
        console.log("mensaje=>key idkey= "+ this.http.idkey);


    },
    error => {
       
      console.log("mensaje=>1="+ error);
      if (error) {

        console.log("mensaje=>2="+ error);
        
      }

    })
    .catch(error => {
      if (error) {
         console.log("mensaje=>3="+ error);
           
      }
    });

  }
/*
  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    this.platform.registerBackButtonAction(() => {
      // Catches the active view
      let nav = this.app.getActiveNavs()[0];
      let activeView = nav.getActive();                
      // Checks if can go back before show up the alert
      if(activeView.name === 'HomePage') {
          if (nav.canGoBack()){
              nav.pop();
          } else {
              const alert = this.alertCtrl.create({
                  title: 'MENSAJE',
                  message: 'Desea salir de la aplicaciÃ³n?',
                  buttons: [{
                      text: 'Cancelar',
                      role: 'cancel',
                      handler: () => {
                        //this.nav.setRoot('HomePage');
                        console.log('** Salida Cancelada!');
                      }
                  },{
                      text: 'ACEPTAR',
                      handler: () => {
                        this.platform.exitApp();
                      }
                  }]
              });
              alert.present();
          }
      }
  });
  }
*/
}