import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { UtilsProvider } from '../../providers/utils/utils';
import { HttpProvider } from '../../providers/http/http';
import { Storage } from '@ionic/storage';
import { Push, PushObject, PushOptions } from '@ionic-native/push/';

declare var AesUtil: any;


@IonicPage()
@Component({
  selector: 'page-condiciones',
  templateUrl: 'condiciones.html',
})
export class CondicionesPage {

  public jsonDataDevice: any;
  public message: any;
  public titulo: string;
  public html: any;
  public messageId: string;
  public msgjsessionId: string;

  constructor(/*private device: Device,*/public navCtrl: NavController, public navParams: NavParams, public utils: UtilsProvider,
    private storage: Storage, public http: HttpProvider, public platform: Platform, public push: Push) {

    // Metodo que escucha el llamado de las notificaciones push
    platform.ready().then(() => {
      this.notificacionPush()
    });

    //Obtención del messageId - PROVIENE DEL LOGIN
    this.storage.get('MESSAGEID').then((val) => {

      if (val != null) {
        this.messageId = val;

        this.storage.get('msgjsessionId').then((val) => {
          if (val != null) {
            this.msgjsessionId = val;
          }
          //this.afiliacion();
        });

      }
    });

    platform.registerBackButtonAction(() => {
      this.navCtrl.push("RegistroAfiliacionPage");
    });

  }

  ionViewDidLoad() {
    this.afiliacion();
  }

  logout() {
    this.utils.presentConfirm("LoginPage");
  }

  public afiliacion() {
    var aesUtil = new AesUtil(128, 1000);
    var lang;
    //alert("1");

    var latitud;
    var longitud;

    // Obtencion de la longitud y la latitud de la persona
    this.storage.get('latitud').then((lat) => {
      this.storage.get('longitud').then((lon) => {
        if (lat != null && lon != null) {
          latitud = lat;
          longitud = lon;
        }
      });
    });

    var urlAfiliacion = "device/getTerm/";
    var consultaLenguaje = this.navParams.get("lenguajeSeleccionadoAfiliacion");

    if (consultaLenguaje != null && consultaLenguaje != undefined) {
      lang = consultaLenguaje;
    }
    else {
      lang = this.utils.getLanguage();
    }
    var data = this.utils.infoDevice();
    var deviceDATA = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, JSON.stringify(data));

    this.jsonDataDevice =
    {
      "lang": lang,
      "messageId": this.messageId,
      "msgjsessionId": this.msgjsessionId,
      "device": {
        "iddev": aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.utils.deviceId)
      },
      "authType": "AUTH",
      "reasonCalled": "auth_afili",
      "scoreRiskCustomer": "0",
      "geoRefLatitude": latitud,
      "geoRefLongitude": longitud,
      "deviceTrustId": aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.utils.deviceId),
      "deviceTrustData": deviceDATA,
      "idkey": this.http.idkey

    }

    console.log("mensaje=>Envio device/getTerm/: " + JSON.stringify(this.jsonDataDevice));

    this.http.callServer(this.jsonDataDevice, urlAfiliacion).then(res => {
      this.message = JSON.stringify(res);
      console.log("mensaje=>Resultado device/getTerm/: " + this.message);
      this.titulo = res.title;
      this.html = res.text;

      this.storage.set('MESSAGEID', res.messageId);
      this.storage.set('msgjsessionId', res.msgjsessionId);

      if (res.messageId != null || res.messageId != "") {
        this.storage.set('MESSAGEID', res.messageId);
        this.storage.set('msgjsessionId', res.msgjsessionId);
        this.messageId = res.messageId;
      }

      try {
        this.utils.errorControl(res.message.code);
      }
      catch (error) {
        //this.utils.presentAlert("mensajeErrorControlado" + error);
      }

    },
      error => {
        this.utils.presentAlert("mensajePeticion" + error);
        this.storage.clear();
        this.utils.clearVariableSesion();
        this.navCtrl.setRoot("LoginPage");
      })

  }//fin del metodo afiliacion


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

  public cancelar() {
    this.navCtrl.push("RegistroAfiliacionPage");
  }

  public aceptar() {
    this.navCtrl.push("RegistroAfiliacionPage");
  }

  public reiniciarSesion() {
    this.utils.reload();
  }
}
