import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, MenuController, LoadingController } from 'ionic-angular';

import { Platform } from 'ionic-angular';
import { Push, PushObject, PushOptions } from '@ionic-native/push/';
import { FingerprintAIO, FingerprintOptions } from '@ionic-native/fingerprint-aio';
import { Storage } from '@ionic/storage';
import { UtilsProvider } from '../../providers/utils/utils';
import { Device } from '@ionic-native/device';
import { HttpProvider } from '../../providers/http/http';
import { TouchID } from "@ionic-native/touch-id";

declare var AesUtil: any;

/**
 * Generated class for the PushPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-push',
  templateUrl: 'push.html',
})
export class PushPage {

  public tk: any = "token id"; 
  public titulo: any;
  public mensaje: any;
  public image: any;
  fingerprintOptions : FingerprintOptions; 
  public huella: boolean = false;
  public face_ID: boolean = false;
  public fecha: any;
  public hora: any;
  public hoy: any;
  public data: any;
  public encripData: string;
  public jsonDataDevice: any;
  public jsonDataDevice2: any;
  public message: any;
  public messageId: string;
  public msgjsessionId: string;
  public userName: string;

  public authVal: any;
  public authCod: any;
  public authMen: any;
  public contentMsj: boolean = false;
  public fingerFace: boolean = false;
  public aprobo: boolean = false;
  public rechazo: boolean = false;
  public banderafingerFace: number = 0;
  public banderaAlert: number = 0;
  public latitud: any;
  public longitud: any;
  public mostrarDevolver: boolean = true;
    
  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public push: Push, private faio: FingerprintAIO, public http: HttpProvider,
    private alertCtrl: AlertController, public faceID:TouchID, private storage: Storage, public menuCtrl: MenuController, public utils: UtilsProvider, private device: Device, public loadingCtrl: LoadingController) {

    this.mostrarDevolver = true;
    this.titulo = this.navParams.get("title");
    this.authCod = this.navParams.get("codOtp");
    this.mensaje = this.navParams.get("msg");

    this.titulo = "Push message revered";
    this.mensaje = "Transaccion para ser aprobada, solicitada por el ebanking";

    // Obtencion de la longitud y la latitud de la persona
    this.storage.get('latitud').then((lat) => {
      this.storage.get('longitud').then((lon) => {
        if (lat != null && lon != null) {
          this.latitud = lat;
          this.longitud = lon;
        }
      });
    });

    if(this.navParams.get("accesoAuthType") == 1){

      // Obtención del Mensaje PUSH que se envia desde el inbox
    this.storage.get('AUTHDATA').then((val) => {
      if(val != null){
        
      //alert("PUSH: "+val); 
      var titulo = this.utils.valorProperty("pushMensaje");
      var notificacion = val;

      var temp1;
      var temp2;

      var authVal = notificacion.slice(0, 2);
      //alert("authVal: "+authVal);
      temp1 = notificacion.split(" ");
      temp2 = temp1[0].split();
      var authCod = temp1[0].slice(2);
      //alert("temp1: "+temp1);
      var zz = notificacion.split(":");
      var mensaje = zz[1];
      //alert("mensaje: "+mensaje);

      this.titulo =  this.utils.valorProperty("pushMensaje"); 
      this.mensaje = mensaje;

      this.loginFingerPrint(authCod);
      

      }
    });

    }

      this.storage.get('MESSAGEID').then((val) => {
        if(val != null){
          this.messageId = val;
        }
      });

      this.storage.get('msgjsessionId').then((val) => {
        if (val != null) {
          this.msgjsessionId = val;
        }
      });

      this.storage.get('userName').then((val) => {
        if(val != null){
          // this.userName = val;
  
          var aesUtil = new AesUtil(128,1000);
          // Se encripta el usuario con el nuevo encript que paso hernan 2019
          this.userName = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, val);
        }
      });
  

    platform.ready().then(() => {

      var authCod = this.navParams.get("codOtp");

      this.hoy = new Date();
      this.fecha = this.hoy.getDate() + "/" + (this.hoy.getMonth() + 1) + "/" + this.hoy.getFullYear();
      this.hora = this.hoy.getHours() + " Hr: " + this.hoy.getMinutes() + " Min: " + this.hoy.getSeconds() + " Seg";

      if (this.platform.is('android')) {
        
      
      this.faio.isAvailable().then(result => {
        if (result === "finger") {
          this.banderafingerFace = 1;
          this.banderaAlert = 0;
         // alert("huella");
        }
        else if (result === "face") {
          this.banderafingerFace = 1;
          this.banderaAlert = 0;
          //alert("rostro");
        }
      }).catch(() => {
        //alert("alert");
        this.banderaAlert = 1;
        this.banderafingerFace = 0;

      });

      } else {
        this.faceID.isAvailable().then( result => {
          
            if (result === "finger") {
              this.banderafingerFace = 1;
              this.banderaAlert = 0;
             // alert("huella");
            }
            else if (result === "face") {
              this.banderafingerFace = 1;
              this.banderaAlert = 0;
              //alert("rostro");
            }
        }),err => console.log('Error al cargar la huella', err)

      }

      //alert("valor authOTP: " + authCod);
      if (authCod != null && authCod != undefined) {
        this.obtencionNotificacion();
      }
      else {
        this.notificacionPush();
      }

    });

    platform.registerBackButtonAction(() => {
      this.navCtrl.push("InboxPage");
    });

  }

  public loginFingerPrint(otp){

    //this.fingerFace = true;
    //alert("entro metodo loginFinger");
    // Variable tipo estatus de la notificacion push si se cancela o no
    var tipoStatus: any;

    //alert("entro");
    this.fingerprintOptions = {
      clientId: 'touchLogin',
      clientSecret: 'password', //Only necessary for Android
      //disableBackup:true  //Only for Android(optional)
    }

    if (this.platform.is('android')) {
      
    

    //this.platform.
    this.faio.isAvailable().then(result => {
     //alert("resultado: "+result);
      if (result === "finger" || result === "face") {

        this.faio.show({
          clientId: 'touchLogin',          
          clientSecret: 'password', //Only necessary for Android
          // disableBackup: true, //Only for Android(optional)
          localizedFallbackTitle: 'Use Pin', //Only for iOS
          localizedReason: 'Please Authenticate' //Only for iOS
        })
          .then((result: any) => {
 
            //alert("Result: "+ JSON.stringify(result));
            //Verificamos que hay match  
            if(result == "Success"){ 
 
              //document.getElementById("fingerFace").style.display = "none";
              //document.getElementById("aprobo").style.display = "block";
              //document.getElementById("rechazo").style.display = "none";
              //document.getElementById("contentMsj").style.display = "block";
              
              /*this.contentMsj = true;
              this.fingerFace = false;
              this.aprobo = true;
              this.rechazo = false;*/

              tipoStatus = "A";
              this.envioPush(otp, tipoStatus); 
            }
            if (result.withFingerprint || result.Success) 
            {
              //document.getElementById("aprobo").style.display = "block";
              //document.getElementById("rechazo").style.display = "none";
              //document.getElementById("fingerFace").style.display = "none";
              //document.getElementById("contentMsj").style.display = "block";
              /*this.contentMsj = true;
              this.fingerFace = false;
              this.aprobo = true;
              this.rechazo = false;*/

              tipoStatus = "A";
              this.envioPush(otp, tipoStatus);  
            }

            else {
             //Fingerprint/Face was not successfully verified
             console.log("final de error: "+JSON.stringify(result));
            }
          }).catch (()=>{
            //document.getElementById("aprobo").style.display = "none";
            //document.getElementById("rechazo").style.display = "block";
            //document.getElementById("fingerFace").style.display = "none";
            //document.getElementById("contentMsj").style.display = "block";
            
            tipoStatus = "C"
            this.envioPush(otp, tipoStatus);  
          })
      }

    }).catch(error =>{ 
      alert("Se presento un error: "+error);
    });

  } else {

    this.faceID.verifyFingerprint('Scan your Fingerprint please').then(
      res => {
        
        tipoStatus = "A"
        this.envioPush(otp, tipoStatus);

      }),err => {

        tipoStatus = "C"
        this.envioPush(otp, tipoStatus);
        console.log('Error al llamar el servivio', err)

      };
  }

  }

  presentNotification(otp) {
    // Variable tipo estatus de la notificacion push si se cancela o no
    var tipoStatus: any;

    let alert = this.alertCtrl.create({
      title: "Mensaje",
      message: "Alerta Notificación",
      buttons: [
        {
          text: "cancelar",
          handler: data => {
            if ("cancelar") 
            {
              tipoStatus = "C";
              this.envioPush(otp, tipoStatus);  
              console.log("cancelo");
              
            }
          }
        },
        {
          text: "Aceptar",
          handler: data => {
            if ("Aceptar") 
            {
              tipoStatus = "A";
              this.envioPush(otp, tipoStatus);  
              console.log("acepto");       
            }
          }
        }
      ]
    });
    alert.present();
  }

  public menu(){
    this.menuCtrl.toggle();
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

  // Metodo para salir de la app
  public logoutApp() {

  //Obtención del messageId - PROVIENE DEL LOGIN
  this.storage.get('nameUser').then((val) => {
    if (val != null) {
      //alert("logout 2");
      var aesUtil = new AesUtil(128, 1000);

      /*var newModel: string = this.utils.changePuntoComa(this.device.model);

      this.data = '{"iddev":"' + this.device.uuid + '",' +
        '"model":"' + newModel+ '",' +
        '"cordova":"' + this.device.cordova + '",' +
        '"plataform":"' + this.device.platform + '",' +
        '"version":"' + this.device.version + '",' +
        '"manufacturer":"' + this.device.manufacturer + '",' +
        '"serial":"' + this.device.serial + '",' +
        '"isVirtual":"' + this.device.isVirtual + '"}';*/

 
     this.data  = this.utils.infoDevice();
     this.encripData = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, JSON.stringify(this.data ));
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
          "reasonCalled"      : "auth_logout",
          "scoreRiskCustomer" : "0",
          "geoRefLatitude"    : this.latitud,
          "geoRefLongitude"   : this.longitud,
          "deviceTrustId"     : aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.utils.deviceId ),
          "deviceTrustData"   : this.encripData,
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

  // Envio de validacion de la notificacion Push
  public envioPush(otpPush, typeStatus){

    //alert("OTP: "+otpPush+" Tipo: "+typeStatus);
    //document.getElementById("fingerFace").style.display = "none";
    this.contentMsj = true;
    this.fingerFace = false;
    this.huella = false;
    
    var aesUtil = new AesUtil(128,1000);
    
    //alert("mesage id token1: "+this.messageId);
    this.storage.get('MESSAGEID').then((val) => {
      //alert("message id token "+val);
      if(val != null){
        
        this.messageId = val;

        this.storage.get('msgjsessionId').then((val) => {
          if (val != null) {
            this.msgjsessionId = val;
          
        //alert("mesage id token2: "+this.messageId);
        var urlOtp = "auth/callAuth/";
        //Datos del dispositivo
        this.jsonDataDevice =
          {
            "userName": this.userName,
            "authType": "PN",
            "messageId": this.messageId,
            "msgjsessionId": this.msgjsessionId,
            "data": otpPush,
            "statusConfirm": typeStatus,
            "device": {
              "iddev": aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.utils.deviceId )
            },
            "reasonCalled"      : "auth_push",
            "scoreRiskCustomer" : "0",
            "geoRefLatitude"    : this.latitud,
            "geoRefLongitude"   : this.longitud,
            "deviceTrustId"     : aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.utils.deviceId ),
            "deviceTrustData"   : this.encripData,
            "idkey": this.http.idkey
          }
        
          console.log("mensaje=>Envio auth/callAuth/: " + JSON.stringify(this.jsonDataDevice));

        this.presentLoading();

        //alert("datos enviar OTP: "+JSON.stringify(this.jsonDataDevice));
        this.http.callServer(this.jsonDataDevice, urlOtp).then(res => {
          //alert("LLAMADO TOKEN");
          this.message = JSON.stringify(res);
          console.log("mensaje=>Resultado auth/callAuth/: " + this.message);
          this.storage.set('MESSAGEID', res.messageId);
          this.storage.set('msgjsessionId', res.msgjsessionId);
        

          if(res.statusConfirm == "A"){
            
            this.contentMsj = true;
            this.fingerFace = false;
            this.aprobo = true;
            this.rechazo = false;
          }
          else if(res.statusConfirm == "C"){
            
            this.contentMsj = true;
            this.fingerFace = false;
            this.aprobo = false;
            this.rechazo = true;
          }

          try {

            this.utils.errorControl(res.message.code);

            if (res.message.code == "0000") {
                this.storage.set('MESSAGEID', res.messageId);
                this.storage.set('msgjsessionId', res.msgjsessionId);
                
            }
            else if(res.message.code == "9003"){
                
            }
            else {
                this.utils.presentAlert(res.message.description);
                
            }

          } 
          catch (error) {
            this.utils.presentAlert("mensajeErrorControlado"+error);
          }
        },
          error => {
            if (error) {
              this.utils.presentAlert("mensajePeticion" + error);
              //this.storage.clear();
              //this.utils.clearVariableSesion();
              //this.navCtrl.setRoot("LoginPage");
            }
          })
        }
      });
      }
    });

  }

  // Este metodo obtiene los mensajes que han sido recibidos desde otras pantallas
  public obtencionNotificacion(){

    //alert("llego desde otra pagina");
    this.titulo = this.navParams.get("title");
    this.authCod = this.navParams.get("codOtp");
    this.mensaje = this.navParams.get("msg");

    //alert("BanderaFinger: "+this.banderafingerFace+"\nBanderaAlert: "+this.banderaAlert);
    if(this.banderafingerFace = 1){
      //alert("Bandera finger");
       this.loginFingerPrint(this.authCod);
    }
    else if(this.banderaAlert = 1){
      //alert("bandera alert");
     this.presentNotification(this.authCod);
    }
  }

  // Este metodo obtiene los mensajes que son recibidos desde esta pagina
  public notificacionPush(){
    //alert("llego desde esta pagina");

     // alert("1");
         // comprobamos los permisos
         this.push.hasPermission()
           .then(res => {
             //alert("Verificacion de permiso"+res)
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
           //alert(notification.wasTapped);
           if(notification.wasTapped){
             //alert("Primer plano");
           }
           else{
             //alert("Segundo plano");
           }
           this.titulo = notification.title;
           //alert(JSON.stringify(notification.message));
           var notificacion = notification.message;
           //this.mensaje = notification.message;
           //this.navCtrl.push("LoginPage");
            var temp1;
            var temp2;

            this.authVal = notificacion.slice(0, 2);
            temp1 = notificacion.split(" ");
            temp2 = temp1[0].split();
            this.authCod = temp1[0].slice(2);
            var zz = notificacion.split(":");
            this.mensaje = zz[1];

          /* document.getElementById("fingerFace").style.display = "block";*/
           
           //this.huella = true;
           if(this.banderafingerFace = 1){
             //alert("Bandera finger");
              this.loginFingerPrint(this.authCod);
           }
           else if(this.banderaAlert = 1){
             //alert("bandera alert");
            this.presentNotification(this.authCod);
           }
           
           //this.getPicture(notification.message);
           //alert("notificacion: "+ JSON.stringify(notification));
           //aquí recibimos las notificaciones de firebase
           //localStorage.setItem('msj',notification.message);
           //this.mensaje = notification.message;
         });
         pushObject.on('registration').subscribe((registration: any) => {
           const registrationId = registration.registrationId;
           //localStorage.setItem('token',registration.registrationId);
           //alert("token: "+ registrationId);
           this.tk = registrationId;
           //alert("token que va: "+ registration.registrationId)
           //this.obtener(registration.registrationId)
           //registrationId lo debes guardar en mysql o similar para reutilizar
         });
         pushObject.on('error').subscribe(error => {
           console.error('Error with Push plugin', error)
         });

  }

  public presentLoading() {

    var msj = this.utils.getMessageLanguage("inbox.loanding");
      let loading = this.loadingCtrl.create({
        content: msj
      });
    
      loading.present();
    
      setTimeout(() => {
        loading.dismiss();
      }, 4000);
    }

    public devolverse(){
      this.navCtrl.push("BandejaMenuPage");
    }

    public reiniciarSesion() {
      this.utils.reload();  
    }
}
