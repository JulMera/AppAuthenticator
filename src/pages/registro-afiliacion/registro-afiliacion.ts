import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { UtilsProvider } from '../../providers/utils/utils';
import { TranslateService } from '@ngx-translate/core'
import { AlertController } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';
import { Storage } from '@ionic/storage';
import { DbaProvider } from '../../providers/dba/dba';
import { Push, PushObject, PushOptions } from '@ionic-native/push/';
declare var AesUtil: any;

/**
 * Generated class for the RegistroAfiliacionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-registro-afiliacion',
  templateUrl: 'registro-afiliacion.html',
})
export class RegistroAfiliacionPage {

  public value: boolean = true;
  private isBtnEnabledAfi: boolean = false;
  public usuario: string;
  public pass: string;
  public jsonDataDevice: any;
  public message: any;
  public data: any;
  public encripData: string;
  public messageId: string;
  public msgjsessionId: string;
  //public passphrase: string = "323W0RKS";
  public pushID: any;
  public idDispositivoPush: any;

  public latitud: any;
  public longitud: any;

  public idioma: boolean = false;
  public emisorApp: any;
  public appProcess: any;


  constructor(public navCtrl: NavController, public navParams: NavParams, public utils: UtilsProvider, private translateService: TranslateService,
    private alertCtrl: AlertController, public http: HttpProvider, private storage: Storage, public dba: DbaProvider,
    public push: Push, platform: Platform) {

    console.log("mensaje=>constructor RegistroAfiliacionPage");

    this.emisorApp = this.utils.variablesGlobales("emisorApp");
    this.appProcess = this.utils.variablesGlobales("appProcess");

    // Obtencion de la longitud y la latitud de la persona
    this.storage.get('latitud').then((lat) => {
      this.storage.get('longitud').then((lon) => {
        if (lat != null && lon != null) {
          this.latitud = lat;
          this.longitud = lon;
        }
      });
    });

    //Obtención del pushId - PROVIENE DEL app.componet
    /*this.storage.get('pushID').then((val) => {

      if (val != null) {
        this.pushID = val;
        //alert("pushId enviar 1: "+this.pushID);
      }
    });*/

    /*this.storage.get('pushID').then((val) => {

      if (val != null) {
        this.pushID = val;
        //alert("pushId enviar 2: "+this.pushID);
      }
    });*/

    platform.ready().then(() => {

      //alert("Entro Registro afiliacion");
      this.push.hasPermission()
        .then(res => {
          //alert("res"+res)
          if (res.isEnabled) {
            // alert('We have permission to send push notifications'); 
          } else {
            // alert('We do not have permission to send push notifications');
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

      /* const pushObject: PushObject = this.push.init(options);
 
       pushObject.on('notification').subscribe((notification: any) => {
 
       });
 
       pushObject.on('registration').subscribe((registration: any) => {
         const registrarId = registration.registrationId;
         this.idDispositivoPush = registrarId;
         //this.afiliacion(registrarId);
 
       });
 
       pushObject.on('error').subscribe(error => {
         console.error('Error with Push plugin', error)
       });*/

    });


    //Metodo para cuando se le de back al celular cierre la app y lo envie al login
    this.utils.outApp("RegistroAfiliacionPage");

    //Obtención del messageId - PROVIENE DEL LOGIN
    this.storage.get('MESSAGEID').then((val) => {

      if (val != null) {
        this.messageId = val;
        //alert("messageId enviar: "+this.messageId);
      }
    });

    this.storage.get('msgjsessionId').then((val) => {
      if (val != null) {
        this.msgjsessionId = val;
      }
    });

    //se crea la base de datos y la tabla
    this.dba.createDataBaseFile();


    // Metodo para llamar al validtaeE2E para comprobar que el dispositivo este disponible
    this.validateE2E();
    //console.log("mensaje=>constructor RegistroAfiliacionPage2");

    platform.registerBackButtonAction(() => {
      this.navCtrl.push("LoginPage");
    });
  }

  ionViewDidLoad() { }

  public condiciones() {
    if (this.usuario == null && this.pass == null) {
      this.presentAlert();
    } else {
      this.utils.userLogin = this.usuario.trim().toUpperCase();
      this.navCtrl.push("CondicionesPage", { lenguajeSeleccionadoAfiliacion: this.navParams.get("lenguajeSeleccionadoLogin") });
    }
  }

  registrar() {
    if (!this.value) {
      this.utils.presentAlert("registroAfiliacion.msj");
    }
    else {
      this.navCtrl.push("LoginPage");
    }
  }




  public afiliacion(pushID) {

    this.storage.get('pushID').then((val) => {

      if (val != null) {
        this.pushID = val;
        console.log("mensaje=>pushID: " + this.pushID);
      }

      this.envioAfiliacion();
    });
  }


  public envioAfiliacion() {




    try {

      // Se elimina la tabla para crear los registros limpios desde cero
      this.dba.dropTable();

      var aesUtil = new AesUtil(128, 1000);

      this.dba.createDataBaseFile();

      if (this.usuario == null && this.pass == null) {
        this.presentAlert();
      }
      else {
        //alert("1");
        if (this.value == false) {
          this.utils.presentAlert("registroAfiliacion.msj");
        }
        else {
          //se guarda en sesion el valor obtenido de los terminos y condiciones
          this.storage.set("terminoCondi", this.value);

          this.isBtnEnabledAfi = true;
          var urlAfiliacion = "device/afiliation/";
          var use: string = this.usuario.trim().toUpperCase();
          var userLogin: string = use;

          var user = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, userLogin);
          var passw = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.pass);


          /* try {     
             this.device.model = this.device.model.replace(",",".");
             this.device.version= this.device.version.replace(",",".");
           } catch (error) {
             this.utils.presentAlert("Error Change punto - coma");
           }
   
           var newModel: string = this.utils.changePuntoComa(this.device.model);
   
           this.data = '{"iddev":"' + this.device.uuid + '",' +
                       '"model":"' + newModel + '",' +
                       '"cordova":"' + this.device.cordova + '",' +
                       '"plataform":"' + this.device.platform + '",' +
                       '"version":"' + this.device.version + '",' +
                       '"manufacturer":"' + this.device.manufacturer + '",' +
                       '"serial":"' + this.device.serial + '",' +
                       '"isVirtual":"' + this.device.isVirtual + '"}';*/
          this.utils.userLogin = userLogin;
          this.data = this.utils.infoDevice();
          this.encripData = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, JSON.stringify(this.data));


          var deviceUUID = "";
          if (this.data.iddev) {
            aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.data.iddev);
            //  var deviceUUID = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.device.uuid);
          }


          //Datos del dispositivo
          this.jsonDataDevice =
          {
            "userName": user, // encriptarlo
            "userPasw": passw, // encriptarlo
            // "messageId": this.messageId,
            // "msgjsessionId": this.msgjsessionId,
            "appAuthType": aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, "AUTH"),
            "device": {
              //"iddev": deviceUUID, //esta va hacer la llave para encriptar
              "data": this.encripData
            },
            "pushIdSus": this.pushID,
            "authType": "AUTH",
            "reasonCalled": "auth_afili",
            "scoreRiskCustomer": "0",
            "geoRefLatitude": this.latitud,
            "geoRefLongitude": this.longitud,
            //"deviceTrustId"     : aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.device.uuid),
            "deviceTrustData": this.encripData,
            "internalUserName": this.emisorApp,
            "appProcess": this.appProcess,
            "idkey": this.http.idkey
          }

          console.log("mensaje=>Envio device/afiliation/: " + JSON.stringify(this.jsonDataDevice));
          this.http.callServer(this.jsonDataDevice, urlAfiliacion).then(res => {
            //alert("3");
            this.message = JSON.stringify(res);
            console.log("mensaje=>Resultado device/afiliation/: " + this.message);
            this.storage.set('MESSAGEID', res.messageId);
            this.storage.set('msgjsessionId', res.msgjsessionId);

            // -----> llego para guardar optional01
            this.storage.set('OPTIONAL01', res.optional01);

            //alert("el optional que se va a guardar "+res.optional01); ///borrar despues
            //Se guarda en base de datos el opcional01 para el login por huella


            if (res.message.code == 101) {
              this.utils.presentAlert('mensajeSesion');
              this.storage.clear();
              this.utils.clearVariableSesion();
              this.navCtrl.push("LoginPage");
            }

            if (res != '' && typeof res !== "undefined") {

              //this.utils.alertServidor(this.message.code);
              if (res.message.code == "0000" || res.message.description == "STATUS OK") {

                //se decodifican las llaves de encripcion
                let respuesta = this.utils.decodeText(res.key);
                this.http.salt = respuesta.split(",")[0];
                this.http.iv = respuesta.split(",")[1];
                this.http.passphrase = respuesta.split(",")[2];
                this.http.idkey = respuesta.split(",")[3];

                this.dba.deleteDeviceConfig();
                this.dba.saveDeviceConfig(this.http.idkey, this.http.salt, this.http.iv, this.http.passphrase);


                this.dba.guardarBD(res.optional01);
                console.log("mensaje=>id dispositivo: " + res.optional01);
                this.utils.presentAlert("message.code0000");
                this.navCtrl.push("LoginPage");
              }
              else {
                this.utils.errorControl(res.message.code);
                this.isBtnEnabledAfi = false;
              }
            }
          },
            error => {
              this.utils.presentAlert("mensajePeticion" + error);
              this.storage.clear();
              this.utils.clearVariableSesion();
              //this.navCtrl.setRoot("LoginPage"); 
              this.isBtnEnabledAfi = false;
            })
        }
      }
    } catch (error) {
      alert("ERROR: " + error);
    }

  }

  // Metodo para llamar al validtaeE2E para comprobar que el dispositivo este disponible
  public validateE2E() {

    var urlAfiliacion = "device/validateE2E/";

    this.data = this.utils.infoDevice();
    console.log("mensaje=> entro validateE2E");

    var aesUtil = new AesUtil(128, 1000);

    this.encripData = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, JSON.stringify(this.data));
    var deviceUUID = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.data.iddev);

    //Datos del dispositivo
    this.jsonDataDevice =
    {
      "messageId": this.messageId,
      "msgjsessionId": this.msgjsessionId,
      "appAuthType": aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, "AUTH"),
      "device": {
        "iddev": deviceUUID,
        "data": this.encripData
      },
      "authType": "AUTH",
      "reasonCalled": "auth_afili",
      "scoreRiskCustomer": "0",
      "geoRefLatitude": this.latitud,
      "geoRefLongitude": this.longitud,
      "deviceTrustId": aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.data.iddev),
      "deviceTrustData": this.encripData,
      "idkey": this.http.idkey
    }


    this.http.callServer(this.jsonDataDevice, urlAfiliacion).then(res => {
      console.log("mensaje=>validateE2E respuesta: " + JSON.stringify(res));
      this.message = JSON.stringify(res);

      this.storage.set('MESSAGEID', this.messageId);
      this.storage.set('msgjsessionId', res.msgjsessionId);
      if (res != '' && typeof res !== "undefined") {

        if (res.message.code == "0000" || res.message.description == "STATUS OK") {
          //this.utils.presentAlert("mensaje401");
        }
        else {
          this.utils.errorControl(res.message.code);
          this.isBtnEnabledAfi = true;
        }
      }
    },
      error => {
        console.log("mensaje=> error validateE2E: " + error);
      })
      .catch(error => {
        if (error) {
          this.utils.presentAlert("R.Afi: " + error);
        }
      });
  }

  presentAlert() {
    var alertTitle;
    this.translateService.get('Login.alertValidate').subscribe(
      value => {
        alertTitle = value;
      }
    )
    let alert = this.alertCtrl.create({
      title: this.utils.getMessageLanguage("logout.message"),
      message: alertTitle,
      buttons: ['OK']
    });
    alert.present();
  }
  public reiniciarSesion() {
    this.utils.reload();
  }
}
