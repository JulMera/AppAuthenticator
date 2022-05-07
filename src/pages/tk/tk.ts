import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Alert, AlertController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UtilsProvider } from '../../providers/utils/utils';
import { HttpProvider } from '../../providers/http/http';
import { MenuController } from 'ionic-angular';
import { Push, PushObject, PushOptions } from '@ionic-native/push/';

declare var AesUtil: any;

/**
 * Generated class for the TkPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tk',
  templateUrl: 'tk.html',
})
export class TkPage {

  public jsonDataDevice: any;
  public userName: string;
  public authType: string;
  public message: any;
  public CA_OTP: string;
  public isBtnEnabled: boolean = false;
  public messageId: string;
  public msgjsessionId: string;

  public data: any;
  public jsonDataDevice2: any;
  public encripData: string;

  public latitud: any;
  public longitud: any;
  public emisorApp: any;
  public appProcess: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, public utils: UtilsProvider, public push: Push,
    public http: HttpProvider, public menuCtrl: MenuController, private alertCtrl: AlertController, public platform: Platform) {


    this.emisorApp = this.utils.variablesGlobales("emisorApp");
    this.appProcess = this.utils.variablesGlobales("appProcess");

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

    //Obtención del userName - Ya viene encriptado
    this.storage.get('userName').then((val) => {
      if (val != null) {
        // this.userName = val;

        var aesUtil = new AesUtil(128, 1000);
        // Se encripta el usuario con el nuevo encript que paso hernan 2019
        this.userName = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, val);
      }
    });

    this.storage.get('AUTHTYPE').then((val) => {
      if (val != null) {
        this.authType = val;
      }
    });

    //Obtención del messageId - PROVIENE DEL LOGIN
    this.storage.get('MESSAGEID').then((val) => {

      if (val != null) {
        this.messageId = val;

        this.storage.get('msgjsessionId').then((val) => {
          if (val != null) {
            this.msgjsessionId = val;
          }
          this.authTk();
        });
        
      }
    });

    platform.registerBackButtonAction(() => {
      this.navCtrl.push("BandejaMenuPage");
    });

  }

  ionViewDidLoad() { }

  public authTk() {

    var aesUtil = new AesUtil(128, 1000);
    this.isBtnEnabled = true;
    //alert("mesage id token1: "+this.messageId);
    this.storage.get('MESSAGEID').then((val) => {
      //alert("message id token "+val);
      if (val != null) {

        this.messageId = val;

        this.storage.get('msgjsessionId').then((val) => {
          if (val != null) {
            this.msgjsessionId = val;

            //alert("mesage id token2: "+this.messageId);
            var urlOtp = "auth/callReqAuth/";

            /*var newModel: string = this.utils.changePuntoComa(this.device.model);
            this.data = '{"iddev":"' + this.device.uuid + '",' +
              '"model":"' + newModel + '",' +
              '"cordova":"' + this.device.cordova + '",' +
              '"plataform":"' + this.device.platform + '",' +
              '"version":"' + this.device.version + '",' +
              '"manufacturer":"' + this.device.manufacturer + '",' +
              '"serial":"' + this.device.serial + '",' +
              '"isVirtual":"' + this.device.isVirtual + '"}';*/

            this.data = this.utils.infoDevice();
            this.encripData = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, JSON.stringify(this.data));

            //Datos del dispositivo
            this.jsonDataDevice =
            {
              "userName": this.userName,
              "authType": "TK",
              "messageId": this.messageId,
              "msgjsessionId": this.msgjsessionId,
              "device": {
                "iddev": aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.utils.deviceId )
              },
              "reasonCalled": "auth_tk",
              "scoreRiskCustomer": "0",
              "geoRefLatitude": this.latitud,
              "geoRefLongitude": this.longitud,
              "deviceTrustId": aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.utils.deviceId ),
              "deviceTrustData": this.encripData,
              "internalUserName": this.emisorApp,
              "idkey": this.http.idkey
              //"appProcess":  this.utils.variablesGlobales("appProcess") 
            }

            console.log("mensaje=>Envio auth/callReqAuth/: " + JSON.stringify(this.jsonDataDevice));

            this.http.callServer(this.jsonDataDevice, urlOtp).then(res => {
              //alert("LLAMADO TOKEN");
              this.message = JSON.stringify(res);
              console.log("mensaje=>Resultado auth/callReqAuth/: " + this.message);
              this.storage.set('MESSAGEID', res.messageId);
              this.storage.set('msgjsessionId', res.msgjsessionId);

              try {

                this.utils.errorControl(res.message.code);

                if (res.message.code == "0000") {

                  this.CA_OTP = res.authData;
                  this.isBtnEnabled = false;
                }
                else if (res.message.code == "9003") {
                  this.isBtnEnabled = true;
                }
                else {
                  this.utils.presentAlert(res.message.description);
                  this.isBtnEnabled = true;
                }

              }
              catch (error) {
                this.utils.presentAlert("mensajeErrorControlado" + error);
              }
            },
              error => {
                this.isBtnEnabled = false;
                if (error) {
                  this.utils.presentAlert("mensajePeticion" + error);
                  this.storage.clear();
                  this.utils.clearVariableSesion();
                  this.navCtrl.setRoot("LoginPage");
                }
              })
          }
        });
      }
    });

  }// fin metodo authTk

  public menu() {
    this.menuCtrl.toggle();
  }

  logout() {
    this.utils.presentConfirm("LoginPage");
  }

  // Metodo para salir de la app
  public logoutApp() {

    //Obtención del messageId - PROVIENE DEL LOGIN
    this.storage.get('nameUser').then((val) => {
      if (val != null) {
        //alert("logout 2");
        var aesUtil = new AesUtil(128, 1000);

        /*var newModel: string = this.utils.changePuntoComa(this.device.model);

        this.data = '{"iddev":"' + this.device.uuid + '",' +
          '"model":"' + newModel + '",' +
          '"cordova":"' + this.device.cordova + '",' +
          '"plataform":"' + this.device.platform + '",' +
          '"version":"' + this.device.version + '",' +
          '"manufacturer":"' + this.device.manufacturer + '",' +
          '"serial":"' + this.device.serial + '",' +
          '"isVirtual":"' + this.device.isVirtual + '"}';*/

        this.data = this.utils.infoDevice();
        this.encripData = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, JSON.stringify(this.data));

        // var iddevEnc: string = this.utils.encodePass(this.device.uuid); ASI ESTABA ANTERIORMENTE  21 MARZO 2019
        var iddevEnc: string = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.utils.deviceId );

        //Datos del dispositivo
        this.jsonDataDevice =
        {
          "userName": val,
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
          "deviceTrustId": aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.utils.deviceId ),
          "deviceTrustData": this.encripData,
          "idkey": this.http.idkey
        }


        /*this.jsonDataDevice2 =
        {
          "userName": val,
          "device": {
            "iddev": this.device.uuid,
            "model": newModel,
            "cordova": this.device.cordova,
            "plataform": this.device.platform,
            "version": this.device.version,
            "manufacturer": this.device.manufacturer,
            "serial": this.device.serial,
            "isVirtual": this.device.isVirtual
          }
        }*/

        var urlLogin = "security/loginOut/";

        this.http.callServer(this.jsonDataDevice, urlLogin).then(res => {
          //alert(res);
          this.message = JSON.stringify(res);

          //alert("Respuesta Logout: "+this.message);

          if (res.message.code == '0000' || res.message.description == 'STATUS OK') {

            this.utils.clearVariableSesion();
            this.utils.logout();
          }

        },
          error => {
            this.utils.presentAlert("mensajeConexion");

          });

      }
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

              console.log("Salida Cancelada");
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

    // comprobamos los permisos
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
        sound: 'false'
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

  public devolverse() {
    this.navCtrl.push("BandejaMenuPage");
  }
  public reiniciarSesion() {
    this.utils.reload();
  }
}
