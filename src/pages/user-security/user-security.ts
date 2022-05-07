import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UtilsProvider } from '../../providers/utils/utils';
import { HttpProvider } from '../../providers/http/http';
import { MenuController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { DbaProvider } from '../../providers/dba/dba';
import { Push, PushObject, PushOptions } from '@ionic-native/push/';
import { infoTesting } from '../../config/params.app';
declare var AesUtil: any;


/**
 * Generated class for the UserSecurityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-security',
  templateUrl: 'user-security.html',
})
export class UserSecurityPage {

  public jsonDataDevice: any;
  public userName: string;
  public message: any;
  public CA_OTP: string;
  public isBtnEnabled: boolean = false;
  public messageId: string;
  public msgjsessionId: string;
  public mostrarCreatedCode: boolean = false;
  createdCode = null;

  public consultaDeviceId: any;
  public data: any;
  public encripData: string;
  public passphrase: string = "323W0RKS";

  public jsonDataDevice2: any;
  public latitud: any;
  public longitud: any;
  public emisorApp: any;
  public appProcess: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, public utils: UtilsProvider, private alertCtrl: AlertController,
    public http: HttpProvider, public menuCtrl: MenuController, public platform: Platform, public dba: DbaProvider, public push: Push) {
    this.emisorApp = this.utils.variablesGlobales("emisorApp");
    this.appProcess = this.utils.variablesGlobales("appProcess");
    //Metodo para cuando se le de back al celular cierre la app y lo envie al login
    this.utils.outApp("LoginPage");

    this.platform.ready().then(() => {

      // Metodo que escucha el llamado de las notificaciones push
      this.notificacionPush();

      //Obtención del userName - Ya viene encriptado
      this.storage.get('userName').then((val) => {
        if (val != null) {
          this.userName = val;
        }
      });


      //Obtención del messageId - PROVIENE DEL LOGIN
      this.storage.get('MESSAGEID').then((val) => {
        if (val != null) {
          this.messageId = val;
          // alert("MessageID constructor: "+val);
        }
      });

      this.storage.get('msgjsessionId').then((val) => {
        if (val != null) {
          this.msgjsessionId = val;
        }
      });

      this.consultaDeviceId = this.searchIdDevice();

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

    platform.registerBackButtonAction(() => {
      this.navCtrl.push("BandejaMenuPage");
    });

  }

  ionViewDidLoad() { }


  public authUserSecure() {

    this.dba.searchIdFinger().then(idFinger => {

      if (this.utils.userLogin.toLowerCase() == infoTesting.userTesting.toLowerCase()) {    
        this.consultaDeviceId =  infoTesting.deviceIdTesting;
      }else{
        this.consultaDeviceId = idFinger;
      }


      //alert("authUserSecure");
      this.storage.get('MESSAGEID').then((val) => {
        if (val != null) {
          this.messageId = val;

          this.storage.get('msgjsessionId').then((val) => {
            if (val != null) {
              this.msgjsessionId = val;

              //alert("MessageID metodo: "+val);
              var aesUtil = new AesUtil(128, 1000);
              this.isBtnEnabled = true;

              var urlOtp = "auth/callLoginSecure/";

              var temp: string;
              //  temp = this.device.model;
              //  var newModel: string;
              // = this.utils.changePuntoComa(temp);


              var envioDeviceID = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.consultaDeviceId);


              var user_Name = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.userName);


              /* this.data = '{"iddev":"' + this.device.uuid + '",' +
                             '"model":"' + newModel + '",' +
                             '"cordova":"' + this.device.cordova + '",' +
                             '"plataform":"' + this.device.platform + '",' +
                             '"version":"' + this.device.version + '",' +
                             '"manufacturer":"' + this.device.manufacturer + '",' +
                             '"serial":"' + this.device.serial + '",' +
                             '"isVirtual":"' + this.device.isVirtual + '"}';*/

              this.data = this.utils.infoDevice();
              this.encripData = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, JSON.stringify(this.data));
              var uuidEncode = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.utils.deviceId );


              //Datos del dispositivo
              this.jsonDataDevice =
              {
                "userName": user_Name,
                "messageId": this.messageId,
                "msgjsessionId": this.msgjsessionId,
                "device": {
                  "data": this.encripData,
                  "iddev": uuidEncode
                },
                "optional01": envioDeviceID,
                "authType": "AUTH",
                "reasonCalled": "auth_userSecu",
                "scoreRiskCustomer": "0",
                "geoRefLatitude": this.latitud,
                "geoRefLongitude": this.longitud,
                "deviceTrustId": aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.utils.deviceId ),
                "deviceTrustData": this.encripData,
                "internalUserName": this.emisorApp,
                "idkey": this.http.idkey
                //"appProcess":  this.utils.variablesGlobales("appProcess") 
              }

              console.log("mensaje=>Envio auth/callLoginSecure/: " + JSON.stringify(this.jsonDataDevice));

              this.http.callServer(this.jsonDataDevice, urlOtp).then(res => {
                //alert("LLAMADO USER SECURITY");
                this.message = JSON.stringify(res);
                console.log("mensaje=>Resultado auth/callLoginSecure/: " + this.message);
                this.storage.set('MESSAGEID', res.messageId);
                this.storage.set('msgjsessionId', res.msgjsessionId);


                if (res.messageId != null || res.messageId != "") {
                  this.storage.set('MESSAGEID', res.messageId);
                  this.storage.set('msgjsessionId', res.msgjsessionId);
                  this.messageId = res.messageId;
                }

                try {
                  console.log(`mensaje=>  authUserSecure:   ${res.message.code}  ${res.message.description} `);
                  //this.utils.errorControl(res.message.code);

                  if (res.message.code == "0000" || res.message.code == "000") {
                    this.mostrarCreatedCode = true;
                    this.createCode(res.authData);
                    this.storage.set('MESSAGEID', res.messageId);
                    this.storage.set('msgjsessionId', res.msgjsessionId);
                    this.isBtnEnabled = false;
                  }
                  else if (res.message.code == "9003") {
                    this.isBtnEnabled = true;
                    this.utils.presentAlert("tk.error9003");
                  }
                  else if (res.message.code == "046") {
                    this.isBtnEnabled = false;
                  }
                  else {

                    this.utils.errorControl(res.message.code);
                    this.isBtnEnabled = false;
                  }


                }
                catch (error) {
                  this.utils.presentAlert("mensajeErrorControlado" + error);
                }

              },
                error => {

                  if (error) {
                    this.isBtnEnabled = false;
                    this.utils.presentAlert("mensajePeticion" + error);
                    /*this.storage.clear();
                    this.utils.clearVariableSesion();
                    this.navCtrl.setRoot("LoginPage");*/
                  }
                })
                .catch(error => {
                  if (error) {
                    this.isBtnEnabled = false;
                    this.utils.presentAlert(error);
                  }
                });


            }
          });
        }
      });




    })

  } //

  public searchIdDevice(): string {

    var sql: string = 'select optional01 from USUARIO where time_01 = (select MAX(time_01) from USUARIO) ';
    var response = this.dba.executeQuery(sql);

    response.then((data) => {

      if (data.rows) {
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            this.consultaDeviceId = (data.rows.item(i).optional01);
            //alert("Consulta bd: "+this.consultaDeviceId );            
          }

        }
      }
    })
      .catch(e => console.log("Error al consultar " + JSON.stringify(e)));

    return this.consultaDeviceId;
  }

  createCode(createQR) {
    //alert("createCode");
    this.createdCode = createQR;
  }

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

        var aesUtil = new AesUtil(128, 1000);

        /* var newModel: string = this.utils.changePuntoComa(this.device.model);
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


        /* this.jsonDataDevice2 =
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
