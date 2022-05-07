import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UtilsProvider } from '../../providers/utils/utils';
import { HttpProvider } from '../../providers/http/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { LoadingController } from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Network } from '@ionic-native/network';
import { Push, PushObject, PushOptions } from '@ionic-native/push/';
import { FingerprintAIO, FingerprintOptions } from '@ionic-native/fingerprint-aio';
import { TouchID } from '@ionic-native/touch-id';
import { ToastController } from 'ionic-angular';


declare var AesUtil: any;
/**
 * Generated class for the InboxPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-inbox',
  templateUrl: 'inbox.html',
})
export class InboxPage {

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

  public otp: boolean = false;
  public bv: boolean = false;
  public psh: boolean = false;
  public tk: boolean = false;
  public qr: boolean = false;
  public vb: boolean = false;
  private red: boolean = true;
  private huella: boolean = false;
  private face_ID: boolean = false;
  fingerprintOptions: FingerprintOptions;
  constructor(public toast: ToastController, public faceID: TouchID, private faio: FingerprintAIO, private network: Network, public navCtrl: NavController, public navParams: NavParams, private storage: Storage, public utils: UtilsProvider, public http: HttpProvider, private sqlite: SQLite, public push: Push,
    public loadingCtrl: LoadingController, public menuCtrl: MenuController, public platform: Platform, public translate: TranslateService, private alertCtrl: AlertController) {

    // Metodo que escucha el llamado de las notificaciones push
    platform.ready().then(() => {

      //SE CONSULTA QUE EL DISPOSITIVO TENGA FINGERPRINT ó FACEID
      if (this.platform.is('android')) {

        this.faio.isAvailable().then(result => {
          if (result === "finger") {
            this.huella = true;
          }
          else if (result === "face") {
            this.face_ID = true;
          }
        });

      } else {
        this.faceID.isAvailable().then(
          res => this.huella = true,
          err => console.log('Error al cargar la huella', err)

        );
      }

      // Metodo para verificar el estado de la Red
      // NOO! ESTA CONECTADO A RED
      this.network.onDisconnect().subscribe(() => {
        // alert("Red no disponible");
        this.red = false;
        this.toast.create({
          message: "Network Disconnected",
          duration: 3000
        }).present();
      });

      // Metodo para verificar el estado de la Red
      // ESTA CONECTADO A RED
      this.network.onConnect().subscribe(() => {
        //alert("Se conecto a la Red");
        this.red = true;
        this.toast.create({
          message: "Network connected",
          duration: 3000,
        }).present();
      });






      this.notificacionPush()
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

    this.storage.get('FROM_LOGIN').then((val) => {
      if (val) {
        this.storage.set('FROM_LOGIN', false);
      } else {
        //this.loadInbox();
      }
    });
    //Metodo para cuando se le de back al celular cierre la app y lo envie al login
    this.utils.outApp("LoginPage");


    this.storage.get('AUTHTYPE').then((val) => {
      console.log("mensaje=>AUTHTYPE: " + val);

      this.page = val;
      if (val != null) {
        this.mostarTabla = true;
        if (val == "OT") {
          //this.page = 1;
          this.page = "OT";
          this.authType = this.utils.valorProperty("Afiliacion.otp");

          //nueva logica
          this.otp = true;
          this.bv = false;
          this.psh = false;
          this.tk = false;
          this.qr = false;
        }
        else if (val == "QR") {
          //this.page = 3;
          this.page = "QR";
          this.authType = "QR";

          //nueva logica
          this.otp = false;
          this.bv = false;
          this.psh = false;
          this.tk = false;
          this.qr = true;
        }
        else if (val == "TK") {
          //this.page = 4;
          this.page = "TK";
          this.authType = "TK";

          //nueva logica
          this.otp = false;
          this.bv = false;
          this.psh = false;
          this.tk = true;
          this.qr = false;
        }
        else if (val == "PN") {
          this.page = "PN";
          this.authType = "PUSH";

          //nueva logica
          this.otp = false;
          this.bv = false;
          this.psh = true;
          this.tk = false;
          this.qr = false;
        }
        else if (val == "BV") {
          this.page = "BV";
          this.authType = this.utils.valorProperty("validacionVerificacion");

          //nueva logica
          this.otp = false;
          this.bv = true;
          this.psh = false;
          this.tk = false;
          this.qr = false;
        }

        else if (val == "VB") {
          this.page = "VB";
          this.authType = "VB";
          this.otp = false;
          this.vb = true;
          this.bv = false;
          this.psh = false;
          this.tk = false;
          this.qr = false;
        }
        else {
          this.authType = "";
         // this.utils.presentAlert("mensajeinbox");
        }
      }

    });

    //Obtención del userName - Ya viene encriptado
    this.storage.get('userName').then((val) => {
      if (val != null) {
        //this.userName = val;
        //alert("username antes: "+val);
        var aesUtil = new AesUtil(128, 1000);
        // Se encripta el usuario con el nuevo encript que paso hernan 2019
        this.userName = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, val);
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

    //Obtención del messageId - PROVIENE DEL LOGIN
    this.storage.get('MESSAGEID').then((val) => {
      if (val != null) {
        this.messageId = val;
        //alert("MESSAGEID inbox1: "+this.messageId);
      }
    });

    this.storage.get('msgjsessionId').then((val) => {
      if (val != null) {
        this.msgjsessionId = val;
      }
    });

    /*Prueba para traer el ususrio logueado por finger
    this.storage.get('user').then((val) => {
     if(val != null){
       alert("usuario finger: "+val);
     }
   });*/

    this.refreshInbox();

    platform.registerBackButtonAction(() => {
      this.navCtrl.push("BandejaMenuPage");
    });

  }

  ionViewDidLoad() {

    // Inicia y valida el tiempo de sesion "esta configurado para 1 minuto"
    // this.utils.initTimeOut();

  }


  ionViewCanEnter() {

    this.storage.get('AUTHTYPE').then((val) => {

      this.page = val;
      if (val != null) {
        this.mostarTabla = true;
        if (val == "OT") {
          //this.page = 1;
          this.page = "OT";
          this.authType = this.utils.valorProperty("Afiliacion.otp");

          this.otp = true;
          this.bv = false;
          this.psh = false;
          this.tk = false;
          this.qr = false;
        }
        else if (val == "QR") {
          //this.page = 3;
          this.page = "QR";
          this.authType = "QR";

          this.otp = false;
          this.bv = false;
          this.psh = false;
          this.tk = false;
          this.qr = true;
        }
        else if (val == "TK") {
          //this.page = 4;
          this.page = "TK";
          this.authType = "TK";

          this.otp = false;
          this.bv = false;
          this.psh = false;
          this.tk = true;
          this.qr = false;
        }
        else if (val == "PN") {
          this.page = "PN";
          this.authType = "PUSH";

          this.otp = false;
          this.bv = false;
          this.psh = true;
          this.tk = false;
          this.qr = false;
        }
        else if (val == "BV") {
          this.page = "BV";
          this.authType = this.utils.valorProperty("validacionVerificacion");
          this.otp = false;
          this.bv = true;
          this.psh = false;
          this.tk = false;
          this.qr = false;
        }
        else if (val == "VB") {
          this.page = "VB";
          this.authType = "VB";
          this.otp = false;
          this.vb = true;
          this.bv = false;
          this.psh = false;
          this.tk = false;
          this.qr = false;
        }
        else {
          this.authType = "";
        }
      }

    });

  }


  public home() {

    if (this.page == "OT") {
      //alert("HomePage");
      //this.navCtrl.push('TabsPage', { view:  1 });
      this.otp = true;
      this.bv = false;
      this.psh = false;
      this.tk = false;
      this.qr = false;
      this.navCtrl.push('HomePage');
    }
    else if (this.page == "QR") {
      //alert("QrPage");
      //this.navCtrl.push('TabsPage', { view:  3 });
      this.otp = false;
      this.bv = false;
      this.psh = false;
      this.tk = false;
      this.qr = true;
      this.navCtrl.push('QrPage');
    }
    else if (this.page == "TK") {
      //alert("TkPage");
      //this.navCtrl.push('TabsPage', { view:  4 });
      this.otp = false;
      this.bv = false;
      this.psh = false;
      this.tk = true;
      this.qr = false;
      this.navCtrl.push('TkPage');
    }
    else if (this.page == "PN") {
      //alert("TkPage");
      //this.navCtrl.push('TabsPage', { view:  4 });
      this.otp = false;
      this.bv = false;
      this.psh = true;
      this.tk = false;
      this.qr = false;
      this.navCtrl.push('PushPage', { accesoAuthType: 1 });
    }
    else if (this.page == "BV") {
      //alert("TkPage");
      //this.navCtrl.push('TabsPage', { view:  4 });
      this.otp = false;
      this.bv = true;
      this.psh = false;
      this.tk = false;
      this.qr = false;
      this.navCtrl.push('ValidacionPositivaPage');
    }
    else if (this.page == "VB") {
      this.otp = false;
      this.vb = true;
      this.bv = false;
      this.psh = false;
      this.tk = false;
      this.qr = false;
      this.fingerPrint();
    }
    else {
      this.utils.presentAlert("mensajeinbox");
    }

  }


  //metodo para recargar LOAD INBOX
  public loadInbox() {
    this.otp = false;
    this.vb = false;
    this.bv = false;
    this.psh = false;
    this.tk = false;
    this.qr = false;
    //alert("LOAD inbox: "+this.messageId);

    var aesUtil = new AesUtil(128, 1000);
    this.storage.get('MESSAGEID').then((val) => {
      if (val != null) {
        this.messageId = val;

        this.storage.get('msgjsessionId').then((val) => {
          if (val != null) {
            this.msgjsessionId = val;


          /*  var newModel: string = this.utils.changePuntoComa(this.device.model);

            var data = '{"iddev":"' + this.device.uuid + '",' +
              '"model":"' + newModel + '",' +
              '"cordova":"' + this.device.cordova + '",' +
              '"plataform":"' + this.device.platform + '",' +
              '"version":"' + this.device.version + '",' +
              '"manufacturer":"' + this.device.manufacturer + '",' +
              '"serial":"' + this.device.serial + '",' +
              '"isVirtual":"' + this.device.isVirtual + '"}';*/

              var data = this.utils.infoDevice();

            var deviceDATA = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase,  JSON.stringify(data));

            //Datos del dispositivo
            this.jsonDataDevice =
            {
              "userName": this.userName,
              "messageId": this.messageId,
              "msgjsessionId": this.msgjsessionId,
              "keyMessage": "key1234",
              "device": {
                "iddev": aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.utils.deviceId )
              },
              "authType": "AUTH",
              "reasonCalled": "auth_inbox",
              "scoreRiskCustomer": "0",
              "geoRefLatitude": this.latitud,
              "geoRefLongitude": this.longitud,
              "deviceTrustId": aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.utils.deviceId ),
              "deviceTrustData": deviceDATA,
              "idkey": this.http.idkey
            }

            console.log("mensaje=>Envio auth/loadInbox/: " + JSON.stringify(this.jsonDataDevice));

            this.http.callServer(this.jsonDataDevice, this.urlInbox).then(res => {

              this.message = JSON.stringify(res);
              console.log("mensaje=>Resultado auth/loadInbox/: " + this.message);

              this.storage.set('MESSAGEID', res.messageId);
              this.storage.set('msgjsessionId', res.msgjsessionId);

              if (res.messageId != null || res.messageId != "") {
                this.storage.set('MESSAGEID', res.messageId);
                this.storage.set('msgjsessionId', res.msgjsessionId);
                this.messageId = res.messageId;
              }
              //alert("load inbox: "+this.message);
              //alert("nuevo message id load inbox-->" + res.messageId);
              this.storage.set('MESSAGEID', res.messageId);
              this.storage.set('msgjsessionId', res.msgjsessionId);
              //alert("nuevo INBOX "+this.message);
              // alert("auth inbox "+this.message);
              this.storage.set('AUTHDATA', res.authData);
              this.storage.set('DELIVERYCH', res.deliveryCh);
              this.storage.set('RESPONSECH', res.responseCh);
              this.storage.set('REQUESTID', res.requestId);
              this.storage.set('AUTHTYPE', res.authType); // <-- nuevo

              this.authType = res.authType;
              console.log("mensaje=> inbox  this.authType: " + this.authType);

              try {

                this.utils.errorControl(res.message.code);

                this.mostarTabla = true;
                if (res.authType == "OT") {
                  //this.page = 1;
                  this.page = "OT";
                  this.authType = this.utils.valorProperty("Afiliacion.otp");
                  this.otp = true;
                  this.bv = false;
                  this.psh = false;
                  this.tk = false;
                  this.qr = false;
                }
                else if (res.authType == "QR") {
                  //this.page = 3;
                  this.page = "QR";
                  this.authType = "QR";

                  this.otp = false;
                  this.bv = false;
                  this.psh = false;
                  this.tk = false;
                  this.qr = true;
                }
                else if (res.authType == "TK") {
                  //this.page = 4;
                  this.page = "TK";
                  this.authType = "TK";

                  this.otp = false;
                  this.bv = false;
                  this.psh = false;
                  this.tk = true;
                  this.qr = false;
                }
                else if (res.authType == "PN") {
                  this.page = "PN";
                  this.authType = "PN";

                  this.otp = false;
                  this.bv = false;
                  this.psh = true;
                  this.tk = false;
                  this.qr = false;
                }
                else if (res.authType == "BV") {
                  this.page = "BV";
                  this.authType = this.utils.valorProperty("validacionVerificacion");

                  this.otp = false;
                  this.bv = true;
                  this.psh = false;
                  this.tk = false;
                  this.qr = false;
                }
                else if (res.authType == "VB") {
                  this.page = "VB";
                  this.authType = "VB";
                  this.otp = false;
                  this.vb = true;
                  this.bv = false;
                  this.psh = false;
                  this.tk = false;
                  this.qr = false;
                }

                else {
                  this.authType = "";
                  this.utils.presentAlert("mensajeinbox");
                }

              }
              catch (error) {
                //this.utils.presentAlert("mensajeErrorControlado" + error);
              }

            },
              error => {
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
  }


  //Metodo para refrescar el inbox
  public refreshInbox() {

    this.presentLoading();
    this.loadInbox();

  }

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

  public menu() {
    //alert("MenuToggle");
    this.menuCtrl.toggle();
  }


  public validacionPos() {
    this.navCtrl.push("ValidacionPositivaPage");
  }

  public logoutApp() {

    //Obtención del messageId - PROVIENE DEL LOGIN
    this.storage.get('nameUser').then((val) => {
      if (val != null) {
        //alert("logout 2");
        var aesUtil = new AesUtil(128, 1000);

       /* var newModel: string = this.utils.changePuntoComa(this.device.model);
        this.data = '{"iddev":"' + this.device.uuid + '",' +
          '"model":"' + newModel + '",' +
          '"cordova":"' + this.device.cordova + '",' +
          '"plataform":"' + this.device.platform + '",' +
          '"version":"' + this.device.version + '",' +
          '"manufacturer":"' + this.device.manufacturer + '",' +
          '"serial":"' + this.device.serial + '",' +
          '"isVirtual":"' + this.device.isVirtual + '"}';
      
        this.encripData = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.data);
        var iddevEnc: string = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.device.uuid);*/

        this.data = this.utils.infoDevice();
        this.encripData = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, JSON.stringify(this.data));
        var iddevEnc: string = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase,this.utils.deviceId );




       /* var data = '{"iddev":"' + this.device.uuid + '",' +
          '"model":"' + newModel + '",' +
          '"cordova":"' + this.device.cordova + '",' +
          '"plataform":"' + this.device.platform + '",' +
          '"version":"' + this.device.version + '",' +
          '"manufacturer":"' + this.device.manufacturer + '",' +
          '"serial":"' + this.device.serial + '",' +
          '"isVirtual":"' + this.device.isVirtual + '"}';

        var deviceDATA = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, data);*/


        /*var data = this.utils.infoDevice();
        var deviceDATA = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, JSON.stringify(data));*/



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
          "deviceTrustData":  this.encripData,
          "idkey": this.http.idkey
        }


        /*this.jsonDataDevice2 =
        {
          "userName": val,
          "device": {
            "iddev": this.device.uuid,
            "model": this.device.model,
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

          } else {

            this.utils.errorControl(res.message.code);

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

  public pantallaPush() {
    this.navCtrl.push("PushPage");
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

  // metodo para ir al inbox
  public inbox() {
    this.navCtrl.push("InboxPage");
  }

  public devolverse() {
    this.navCtrl.push("BandejaMenuPage");
  }

  public reiniciarSesion() {
    this.utils.reload();
  }




  //Logueo con huella
  public fingerPrint() {

    if (this.red == true) {

      this.fingerprintOptions = {
        clientId: 'touchLogin',
        clientSecret: 'password', //Only necessary for Android
        //disableBackup:true  //Only for Android(optional)
      }
      if (this.platform.is('android')) {


        this.faio.isAvailable().then(result => {

          if (result === "finger" || result === "face") {

            this.faio.show({
              clientId: 'touchLogin',
              clientSecret: 'password', //Only necessary for Android
              // disableBackup: true, //Only for Android(optional)
              localizedFallbackTitle: 'Use Pin', //Only for iOS
              localizedReason: 'Please Authenticate' //Only for iOS
            })
              .then((result: any) => {

                //Verificamos que hay match
                if (result == "Success") {

                  this.datosBiometricos()
                }
                if (result.withFingerprint || result.Success) {
                  this.datosBiometricos()
                }

                this.faceID.verifyFingerprint('Scan your Fingerprint please')
                  .then(
                    res =>
                      this.datosBiometricos()
                    , err => console.log('Error ', err)

                  );

              })
          } else {
            this.utils.presentAlert("Login.red");
          }
        });
      } else {
        this.faceID.verifyFingerprint('Scan your Fingerprint please').then(
          res => this.datosBiometricos(),
          err => console.log('Error al llamar el servivio', err)

        )
      }
    }
  }

  public datosBiometricos() {
    this.storage.get('REQUESTID').then((data) => {
      this.requestId = data;
      this.storage.get('AUTHDATA').then((authdata) => {
        this.valBiometrica(authdata);
      });
    });
  }
  public valBiometrica(authdata) {

    var aesUtil = new AesUtil(128, 1000);
    this.storage.get('MESSAGEID').then((val) => {
      if (val != null) {
        this.messageId = val;

        this.storage.get('msgjsessionId').then((val) => {
          if (val != null) {
            this.msgjsessionId = val;


            var urlOtp = "auth/callAuth/";

          /*  var newModel: string = this.utils.changePuntoComa(this.device.model);

            var data = '{"iddev":"' + this.device.uuid + '",' +
              '"model":"' + newModel + '",' +
              '"cordova":"' + this.device.cordova + '",' +
              '"plataform":"' + this.device.platform + '",' +
              '"version":"' + this.device.version + '",' +
              '"manufacturer":"' + this.device.manufacturer + '",' +
              '"serial":"' + this.device.serial + '",' +
              '"isVirtual":"' + this.device.isVirtual + '"}';

            var deviceDATA = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, data);*/


            var data  = this.utils.infoDevice();
            var deviceDATA = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, JSON.stringify(data ));
            console.log("mensaje=>deviceId huella "+this.utils.deviceId);

            //Datos del dispositivo
            this.jsonDataDevice =
            {
              "userName": this.userName,
              "authType": "VB",
              "data": authdata,
              "requestId": this.requestId,
              "messageId": this.messageId,
              "msgjsessionId": this.msgjsessionId,
              "keyMessage": "key1234",
              "device": {
                "iddev": aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase,this.utils.deviceId )
              },
              "reasonCalled": "auth_valOTP",
              "scoreRiskCustomer": "0",
              "geoRefLatitude": this.latitud,
              "geoRefLongitude": this.longitud,
              "deviceTrustId": aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase,this.utils.deviceId ),
              "deviceTrustData": deviceDATA,
              "idkey": this.http.idkey
            }

            console.log("mensaje=>Envio auth/callAuth/: " + JSON.stringify(this.jsonDataDevice));

            //alert("datos enviar OTP: "+JSON.stringify(this.jsonDataDevice));
            this.http.callServer(this.jsonDataDevice, urlOtp).then(res => {

              this.message = JSON.stringify(res);
              console.log("mensaje=>Resultado auth/callAuth/: " + this.message);
              this.storage.set('MESSAGEID', res.messageId);
              this.storage.set('msgjsessionId', res.msgjsessionId);

              try {
                this.utils.errorControl(res.message.code);

                if (res.message.code == "0000") {
                  this.utils.presentAlert("mensaje.auth");
                  this.vb = false;
                  this.refreshInbox();
                }
                else {
                  this.utils.presentAlert(res.message.code + " - " + res.message.description);
                }
              }
              catch (error) {
                this.utils.presentAlert("mensajeErrorControlado" + error);
              }

            },
              error => {

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

  }


}
