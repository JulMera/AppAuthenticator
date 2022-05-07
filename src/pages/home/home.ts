import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UtilsProvider } from '../../providers/utils/utils';
import { HttpProvider } from '../../providers/http/http';
import { MenuController } from 'ionic-angular';
import { Push, PushObject, PushOptions } from '@ionic-native/push/';

declare var AesUtil: any;

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  public responseCh: string;
  public deliveryCh: string;
  public authData: any = "";
  public requestId: string;
  public authType: string;
  public resp: string = null;
  public imgResStatus: boolean = false;
  public errorAdicional: boolean = false;

  public tituloDinamico: string;
  private isDisabled: boolean;
  private isBtnEnabled: boolean = true;
  public message: any;
  public userName: string;
  public jsonDataDevice: any;
  public CA_OTP: string;
  public mostarBtn: boolean;
  public msjOTP: string;
  public icono: string;
  public messageId: string;
  public msgjsessionId: string;

  public data: any;
  public jsonDataDevice2: any;
  public encripData: string;
  public latitud: any;
  public longitud: any;

  public mostrarClave: boolean = false;

  constructor( /*private device: Device,*/public navCtrl: NavController, public navParams: NavParams, private storage: Storage, public utils: UtilsProvider, public push: Push,
    public http: HttpProvider, public menuCtrl: MenuController, private alertCtrl: AlertController, public platform: Platform) {


    // SOLO POR PRUEBA
    //this.authData = "Ingrese la clave dinamica";

    //Metodo para cuando se le de back al celular cierre la app y lo envie al login
    this.utils.outApp("InboxPage");

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

    // Inicia y valida el tiempo de sesion "esta configurado para 1 minuto"
    //this.utils.initTimeOut();

    //Metodo para cuando se le de back al celular cierre la app y lo envie al login
    this.utils.outApp("HomePage");

    //Obtención de responseCh, se envia desdes el login
    //MUESTRO PANTALLA PARA QUE INGRESE EL OTP
    this.storage.get('RESPONSECH').then((val) => {
      //alert("valor1: "+val);
      if (val != null && val == 'true') {
        //alert("entro 1");
        this.responseCh = val;
        //this.mostarTitulo = false;
        this.isDisabled = false;
        this.mostarBtn = true;
        this.isBtnEnabled = true;
        this.tituloDinamico = this.utils.valorProperty("Afiliacion.titulo1");
        this.msjOTP = this.utils.valorProperty("home.msj");

        this.mostrarClave = true;
      }
    });

    //MUESTRO PANTALLA CON EL OTP
    this.storage.get('DELIVERYCH').then((val) => {
      //alert("valor2: "+val);
      if (val != null && val == 'true') {

        this.deliveryCh = val;
        //this.mostarTitulo = false;
        this.isDisabled = true;
        this.isBtnEnabled = false;
        this.tituloDinamico = this.utils.valorProperty("Afiliacion.titulo2");
        this.mostrarClave = false;
      }
    });

    //Obtención del requestId del login
    this.storage.get('REQUESTID').then((val) => {
      if (val != null) {
        this.requestId = val;
      }
    });

    this.storage.get('AUTHTYPE').then((val) => {
      if (val != null) {
        this.authType = val;
      }
    });

    this.storage.get('AUTHDATA').then((val) => {
      if (val != null) {
        if (this.authType == "OT") {
          this.authData = val;
        }
        else {
          //this.authData = this.utils.valorProperty("home.msj");
          this.authData = "";
        }
      }
    });

    //Obtención del userName - Ya viene encriptado
    this.storage.get('userName').then((val) => {
      if (val != null) {
        //this.userName = val;
        var aesUtil = new AesUtil(128, 1000);
        // Se encripta el usuario con el nuevo encript que paso hernan 2019
        this.userName = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, val);
      }
    });

    //Obtención del messageId - PROVIENE DEL LOGIN
    this.storage.get('MESSAGEID').then((val) => {
      if (val != null) {
        this.messageId = val;
      }
    });

    this.storage.get('msgjsessionId').then((val) => {
      if (val != null) {
        this.msgjsessionId = val;
      }
    });

    platform.registerBackButtonAction(() => {
      this.navCtrl.push("BandejaMenuPage");
    });

  }

  ionViewDidLoad() { }

  logout() {
    this.utils.presentConfirm("LoginPage");
  }

  //metodo para validar OTP - url para envio de authenticator services 
  public authOtp() {

    // Inicia y valida el tiempo de sesion "esta configurado para 1 minuto"
    //this.utils.initTimeOut();

    this.isBtnEnabled = false;
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
               var deviceDATA = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, data);
              */

            var data = this.utils.infoDevice();
            var deviceDATA = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, JSON.stringify(data));

            //Datos del dispositivo
            this.jsonDataDevice =
            {
              "userName": this.userName,
              "authType": this.authType,
              "data": this.CA_OTP,
              "requestId": this.requestId,
              "messageId": this.messageId,
              "msgjsessionId": this.msgjsessionId,
              "keyMessage": "key1234",
              "device": {
                "iddev": aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.utils.deviceId )
              },
              "reasonCalled": "auth_valOTP",
              "scoreRiskCustomer": "0",
              "geoRefLatitude": this.latitud,
              "geoRefLongitude": this.longitud,
              "deviceTrustId": aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.utils.deviceId ),
              "deviceTrustData": deviceDATA,
              "idkey": this.http.idkey
            }

            console.log("mensaje=>Envio auth/callAuth/: " + JSON.stringify(this.jsonDataDevice));
            this.http.callServer(this.jsonDataDevice, urlOtp).then(res => {

              this.message = JSON.stringify(res);
              console.log("mensaje=>Resultado auth/callAuth/: " + this.message);
              this.storage.set('MESSAGEID', res.messageId);
              this.storage.set('msgjsessionId', res.msgjsessionId);

              if (res.messageId != null || res.messageId != "") {
                this.storage.set('MESSAGEID', res.messageId);
                this.storage.set('msgjsessionId', res.msgjsessionId);
                this.messageId = res.messageId;
              }

              try {
                this.utils.errorControl(res.message.code);

                if (res.message.code == "0000") {
                  this.icono = "../../assets/img/new/MENSAJE_VALIDO.svg";
                  this.CA_OTP = "";
                  this.utils.presentAlert("mensaje.auth");
                  this.resp = this.utils.getMessageLanguage("mensaje.auth");
                  this.isBtnEnabled = true;
                  this.imgResStatus = true;
                  this.errorAdicional = false;
                }
                else if (res.message.code == "013") {
                  this.icono = "../../assets/img/new/MENSAJE_INVALIDO.svg";
                  this.isBtnEnabled = true;
                  this.storage.set('MESSAGEID', res.messageId);
                  this.storage.set('msgjsessionId', res.msgjsessionId);
                  this.resp = this.utils.getMessageLanguage("home.cod013");
                  this.utils.presentAlert("home.cod013");
                  this.imgResStatus = false;
                  this.errorAdicional = true;
                }
                else if (res.message.code == "017") {
                  this.icono = "../../assets/img/new/MENSAJE_INVALIDO.svg";
                  this.storage.set('MESSAGEID', res.messageId);
                  this.storage.set('msgjsessionId', res.msgjsessionId);
                  this.resp = this.utils.getMessageLanguage("home.cod017");
                  this.utils.presentAlert("home.cod017");
                  this.imgResStatus = false;
                  this.errorAdicional = true;
                }
                else {
                  this.utils.errorControl(res.message.code);
                }
              }
              catch (error) {
                this.utils.presentAlert("mensajeErrorControlado" + error);
              }

            },
              error => {
                this.errorAdicional = true;
                this.icono = "../../assets/img/new/MENSAJE_INVALIDO.svg";
                this.isBtnEnabled = true;
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

  public menu() {
    this.menuCtrl.toggle();
  }

  // Metodo para salir de la app
  public logoutApp() {

    //Obtención del messageId - PROVIENE DEL LOGIN
    this.storage.get('nameUser').then((val) => {
      if (val != null) {
        //alert("logout 2");
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

        this.data = '{"iddev":"' + this.device.uuid + '",' +
          '"model":"' + this.device.model + '",' +
          '"cordova":"' + this.device.cordova + '",' +
          '"plataform":"' + this.device.platform + '",' +
          '"version":"' + this.device.version + '",' +
          '"manufacturer":"' + this.device.manufacturer + '",' +
          '"serial":"' + this.device.serial + '",' +
          '"isVirtual":"' + this.device.isVirtual + '"}';

        //this.encripData = this.utils.encodePass(this.data);
        this.encripData = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.data);*/


        
       

        this.data  = this.utils.infoDevice();
        var deviceDATA = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, JSON.stringify(this.data ));
        var iddevEnc: string = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.utils.deviceId );



        //Datos del dispositivo
        this.jsonDataDevice =
        {
          "userName": val,
          "company": aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, "1"),
          "appAuthType": aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, "AUTH"),
          "appProcess": aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, "I"),
          "device": {
            "data": deviceDATA,
            "iddev": iddevEnc
          },
          "authType": "AUTH",
          "reasonCalled": "auth_logout",
          "scoreRiskCustomer": "0",
          "geoRefLatitude": this.latitud,
          "geoRefLongitude": this.longitud,
          "deviceTrustId": aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.utils.deviceId ),
          "deviceTrustData": deviceDATA,
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

  public teclado(numero) {

    switch (numero) {
      case '1':
        this.authData = this.authData + "1";
        this.CA_OTP = this.authData;
        break;
      case '2':
        this.authData = this.authData + "2";
        this.CA_OTP = this.authData;
        break;
      case '3':
        this.authData = this.authData + "3";
        this.CA_OTP = this.authData;
        break;
      case '4':
        this.authData = this.authData + "4";
        this.CA_OTP = this.authData;
        break;
      case '5':
        this.authData = this.authData + "5";
        this.CA_OTP = this.authData;
        break;
      case '6':
        this.authData = this.authData + "6";
        this.CA_OTP = this.authData;
        break;
      case '7':
        this.authData = this.authData + "7";
        this.CA_OTP = this.authData;
        break;
      case '8':
        this.authData = this.authData + "8";
        this.CA_OTP = this.authData;
        break;
      case '9':
        this.authData = this.authData + "9";
        this.CA_OTP = this.authData;
        break;
      case '0':
        this.authData = this.authData + "0";
        this.CA_OTP = this.authData;
        break;

    }
  }

  public delete() {
    this.CA_OTP = "";
    this.authData = "";
  }

  public reiniciarSesion() {
    this.utils.reload();  
  }
}
