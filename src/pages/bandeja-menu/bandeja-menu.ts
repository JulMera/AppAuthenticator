import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UtilsProvider } from '../../providers/utils/utils';
import { HttpProvider } from '../../providers/http/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { LoadingController } from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { Push, PushObject, PushOptions } from '@ionic-native/push/';

declare var AesUtil: any;

/**
 * Generated class for the BandejaMenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bandeja-menu',
  templateUrl: 'bandeja-menu.html',
})
export class BandejaMenuPage {

  //Variables de la BD
  private dba: SQLiteObject;
  ide: number;
  nombre: string;
  movies: string[] = [];
  public f: Date;
  public fecha: string;
  public hora: string;
  public fechaHora: string;
  public infoDevice: any;
  public grilla: Array<Array<String>>;
  public requestId: string;
  public crearBD: boolean = false;
  public deliveryCh: boolean;
  public responseCh: boolean;
  public passw: any;

  public authType: string;
  public mostarTabla: boolean = false;
  public page: any;
  public jsonDataDevice: any;
  public message: any;
  public userName: string;
  public messageId: string;
  public msgjsessionId: string;
  public flagLoadInbox: any = 2;
  private urlInbox: string = "auth/loadInbox/";

  public data: any;
  public jsonDataDevice2: any;
  public encripData: string;
  public passphrase: string = "323W0RKS";
  public latitud: any;
  public longitud: any;
  public notaContador: boolean = false;
  public loadingPage: any;

  constructor(/*private device: Device,*/  public navCtrl: NavController, public navParams: NavParams, private storage: Storage, public utils: UtilsProvider, public http: HttpProvider, private sqlite: SQLite, public push: Push,
    public loadingCtrl: LoadingController, public menuCtrl: MenuController, public platform: Platform, public translate: TranslateService, private alertCtrl: AlertController) {

  this.loadingPage = this.loadingCtrl.create({});
    // Inicia y valida el tiempo de sesion "esta configurado para 1 minuto"
    this.utils.initTimeOut();

    // Metodo que escucha el llamado de las notificaciones push
    platform.ready().then(() => {
      this.notificacionPush();
    });

    // Obtencion de la longitud y la latitud de la persona
    this.storage.get('latitud').then((lat) => {
      this.storage.get('longitud').then((lon) => {
        if (lat != null && lon != null) {
          this.latitud = lat;
          this.longitud = lon;
        }
      });
    });

    //Metodo para cuando se le de back al celular cierre la app y lo envie al login
    this.utils.outApp("LoginPage");

    //Obtención del userName - Ya viene encriptado
    this.storage.get('userName').then((val) => {
      if (val != null) {
        //this.userName = val;
        //alert("username antes: "+val);
        //var aesUtil = new AesUtil(128, 1000);
        // Se encripta el usuario con el nuevo encript que paso hernan 2019
        this.userName = val;
        //alert("username despues: "+this.userName);
      }
    });

    //Obtención del password - Ya viene encriptado
    this.storage.get('password').then((val) => {
      if (val != null) {
        this.passw = val;
      }
    });

    //Obtención de los datos del equipo
    this.storage.get('infoDevice').then((val) => {
      if (val != null) {
        this.infoDevice = val;
      }
    });

    //Obtención del DeliveryCh del login
    this.storage.get('DELIVERYCH').then((val) => {
      if (val != null) {
        this.deliveryCh = val;
      }
    });

    //Obtención del ResponseCh del login
    this.storage.get('RESPONSECH').then((val) => {
      if (val != null) {
        this.responseCh = val;
      }
    });

    this.notaContador = this.navParams.get('bandera')

    //this.loadingPage.present();
    //Obtención del messageId - PROVIENE DEL LOGIN
    this.storage.get('MESSAGEID').then((val) => {
      if (val != null) {
        this.messageId = val;

        this.storage.get('msgjsessionId').then((val) => {
          if (val != null) {
            this.msgjsessionId = val;
          }
          this.loadInbox();
        });

      }
    });

    platform.registerBackButtonAction(() => {
      this.presentConfirm();
    });

  }

  //ionViewCanEnter() {

  // Metodo para carga si el usuario tiene o no msj
  //this.refreshInbox();

  // Inicia y valida el tiempo de sesion "esta configurado para 1 minuto"
  //this.utils.initTimeOut();
  // }

  //metodo para recargar LOAD INBOX
  public loadInbox() {

    var aesUtil = new AesUtil(128, 1000);


    /*  var newModel: string = this.utils.changePuntoComa(this.device.model);

      var data = '{"iddev":"' + this.device.uuid + '",' +
        '"model":"' + newModel + '",' +
        '"cordova":"' + this.device.cordova + '",' +
        '"plataform":"' + this.device.platform + '",' +
        '"version":"' + this.device.version + '",' +
        '"manufacturer":"' + this.device.manufacturer + '",' +
        '"serial":"' + this.device.serial + '",' +
        '"isVirtual":"' + this.device.isVirtual + '"}';

      var deviceDATA = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, data);
*/
    this.data = this.utils.infoDevice();
    //console.log("mensaje=>loadInbox1:"+ JSON.stringify(this.data));
    
    var deviceDATA = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, JSON.stringify(this.data));


    //Datos del dispositivo
    this.jsonDataDevice =
    {
      "userName": aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.userName),
      "messageId": this.messageId,
      "msgjsessionId": this.msgjsessionId,
      "keyMessage": "key1234",
      "device": {
        "iddev": aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.utils.deviceId)
      },
      "authType": "AUTH",
      "reasonCalled": "auth_inbox",
      "scoreRiskCustomer": "0",
      "geoRefLatitude": this.latitud,
      "geoRefLongitude": this.longitud,
      "deviceTrustId": aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.utils.deviceId),
      "deviceTrustData": deviceDATA,
      "idkey": this.http.idkey
    }
    console.log("mensaje=>Envio auth/loadInbox/: " + JSON.stringify(this.jsonDataDevice));
    this.http.callServer(this.jsonDataDevice, this.urlInbox).then(res => {

      this.message = JSON.stringify(res);
      console.log("mensaje=>Resultado auth/loadInbox/: " + this.message);
      console.log("res.message.code1 " + res.message.code);
      console.log("res.message.description1 " + res.message.description);
      this.storage.set('MESSAGEID', res.messageId);
      this.storage.set('msgjsessionId', res.msgjsessionId);
      if (res.messageId != null || res.messageId != "") {
        this.storage.set('MESSAGEID', res.messageId);
        this.storage.set('msgjsessionId', res.msgjsessionId);
      }

      this.storage.set('AUTHDATA', res.authData);
      this.storage.set('DELIVERYCH', res.deliveryCh);
      this.storage.set('RESPONSECH', res.responseCh);
      this.storage.set('REQUESTID', res.requestId);
      this.storage.set('AUTHTYPE', res.authType); // <-- nuevo

      this.authType = res.authType;
      this.loadingPage.dismiss();
      try {

        // if(this.authType != "OT" && this.authType != "QR" && this.authType != "TK" && this.authType != "PN" && this.authType != "BV"){
        if (this.authType != "VB" && this.authType != "OT" && this.authType != "QR" && this.authType != "PN" && this.authType != "BV") {
          this.notaContador = false;
        }
        else {
          this.notaContador = true;
        }

        if (res.message.code == "000" && res.message.description == "Service OK") {
          //if (this.authType == "OT") {
           //this.navCtrl.push('HomePage');

            
         // }
        }
        else {
          this.notaContador = false;
          this.utils.errorControl(res.message.code);
        }

      }
      catch (error) {
        this.utils.presentAlert("mensajeErrorControlado" + error);
      }

    },
      error => {
        if (error) {
          this.loadingPage.dismiss();
          this.utils.presentAlert("mensajePeticion" + error);
          this.storage.clear();
          this.utils.clearVariableSesion();
          this.navCtrl.setRoot("LoginPage");
        }
      })
    // }
    //});
    //}
    // });
  }

  //Metodo para refrescar la bandeja de entrada
  /* public refreshInbox() {
     this.presentLoading();
     this.loadInbox();
   }*/

  // Metodo loading
  public presentLoading() {

    var msj = this.utils.getMessageLanguage("inbox.loanding");
    let loading = this.loadingCtrl.create({
      content: msj
    });

    loading.present();

    setTimeout(() => {
      loading.dismiss();
    }, 2000);
  }

  // Metodo de logout de la aplicacion
  public logoutApp() {

    //Obtención del messageId - PROVIENE DEL LOGIN
    
        console.log("logout 1");
        var aesUtil = new AesUtil(128, 1000);

        this.data =  this.utils.infoDevice();
        this.encripData = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, JSON.stringify(this.data) );
        var iddevEnc: string = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.utils.deviceId);

        //Datos del dispositivo
        this.jsonDataDevice =
        {
          "userName": aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.userName),
          "company": aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, "1"),
          "appAuthType": aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, "AUTH"),
          "appProcess": aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, "I"),
          "device": {
            "data": this.encripData,
            "iddev": iddevEnc
          },
          "authType": "AUTH",
          "reasonCalled": "auth_logout",
          "scoreRiskCustomer": "0",
          "geoRefLatitude": this.latitud,
          "geoRefLongitude": this.longitud,
          "deviceTrustId": aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.utils.deviceId),
          "deviceTrustData": this.encripData,
          "idkey": this.http.idkey
        }

        var urlLogin = "security/loginOut/";
        console.log("mensaje=>Envio security/loginOut/: " + JSON.stringify(this.jsonDataDevice));
        this.http.callServer(this.jsonDataDevice, urlLogin).then(res => {
          
          console.log("res.message.code " + res.message.code);
          console.log("res.message.description " + res.message.description);
          
          this.message = JSON.stringify(res);
          console.log("mensaje=>Resultado security/loginOut/: " + this.message);
          if (res.message.code == "0000" || res.message.description == "STATUS OK") {
            //this.utils.clearVariableSesion();
            console.log("mensaje entro aqui OK");
            
            this.storage.clear();
            this.navCtrl.push("LoginPage");

          } else {
            this.utils.errorControl(res.message.code);
          }

        },
          error => {
            this.utils.presentAlert("mensajeConexion");

          });

    

  }

  //Metodo de confirmación para logout de la app
  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: this.utils.getMessageLanguage("logout.message"),
      message: this.utils.getMessageLanguage("logout.titulo"),
      buttons: [
        {
          text: this.utils.getMessageLanguage("confirm.btnCancelar"),
          handler: data => {
            if (this.utils.getMessageLanguage("confirm.btnCancelar")) {

              //console.log("Salida Cancelada");
            }
          }
        },
        {
          text: this.utils.getMessageLanguage("confirm.btnAceptar"),
          handler: data => {
            if (this.utils.getMessageLanguage("confirm.btnAceptar")) {
              this.utils.presentLoading();
              this.logoutApp();
            }
          }
        }
      ]
    });
    alert.present();
  }

  // ***************** CONFIGURACION DE NOTIFICACIONES PUSH ***********************
  public notificacionPush() {

    var titulo;
    var authVal;
    var authCod;
    var mensaje;

    this.push.hasPermission()
      .then(res => {
        if (res.isEnabled) {
          //alert('We have permission to send push notifications'); 
        } else {
          //alert('We do not have permission to send push notifications');
        }
      });

    // inicializamos la configuración para android y ios
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
        sound: 'true'
      },
      windows: {}
    };

    const pushObject: PushObject = this.push.init(options);

    pushObject.on('notification').subscribe((notification: any) => {

      titulo = notification.title;
      var notificacion = notification.message;

      var temp1;
      var temp2;

      authVal = notificacion.slice(0, 2);
      temp1 = notificacion.split(" ");
      temp2 = temp1[0].split();
      authCod = temp1[0].slice(2);
      var zz = notificacion.split(":");
      mensaje = zz[1];

      this.navCtrl.push("PushPage", { title: titulo, codOtp: authCod, msg: mensaje });

    });

    pushObject.on('registration').subscribe((registration: any) => {
      const registrationId = registration.registrationId;

      var tk = registrationId;

    });
    pushObject.on('error').subscribe(error => {
      console.error('Error with Push plugin', error)
    });

  }

  // eventos de la bandeja
  public bandeja(evento) {

    if (evento == "tc") {
      this.navCtrl.push('GcPage');
    }
    else if (evento == "qr") {
      this.navCtrl.push('QrPage');
    }
    else if (evento == "ul") {
      this.navCtrl.push('UserSecurityPage');
    }
    else if (evento == "tkqr") {
      this.navCtrl.push('TkQrPage');
    }
    else if (evento == "tk") {
      this.navCtrl.push('TkPage');
    }
    else if (evento == "desa") {
      this.navCtrl.push('DesafiliarPage');
    }
    else if (evento == "exit") {
      this.presentConfirm();
    }

  }

  

  // metodo para ir al inbox
  public inbox() {
    this.navCtrl.push("InboxPage");
  }

  public reiniciarSesion() {
    this.utils.reload();
  }

}