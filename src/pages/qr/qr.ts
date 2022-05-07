import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { Storage } from '@ionic/storage';
import { UtilsProvider } from '../../providers/utils/utils';
import { HttpProvider } from '../../providers/http/http';
import { MenuController } from 'ionic-angular';
import { Push, PushObject, PushOptions } from '@ionic-native/push/';

declare var AesUtil: any;


/**
 * Generated class for the QrPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-qr',
  templateUrl: 'qr.html',
})
export class QrPage {

  qrData = null;
  createdCode = null;
  scannedCode = null;
  public mostrarCreatedCode: boolean = false;
  res = null;
  resp = null;
  public imgResStatus : boolean = false;

  public userName: string;
  public requestId: string;
  public jsonDataDevice: any;
  public message: any;
  public icono: string;
  public errorAdicional: boolean = false;
  public deliveryCh: boolean;
  public responseCh: boolean;
  public authData: string;
  public btnScanerQR: boolean = true;
  public messageId: string;
  public msgjsessionId: string;
  public authType: string;
  options :BarcodeScannerOptions;

  public data: any;
  public jsonDataDevice2: any;
  public encripData: string;

  public latitud: any;
  public longitud: any;

  public idDispositivo: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private barcodeScanner: BarcodeScanner, private storage: Storage, public utils: UtilsProvider,
    public http: HttpProvider, public menuCtrl: MenuController,  private alertCtrl: AlertController, public push: Push, public platform: Platform) {

    
    // Metodo que escucha el llamado de las notificaciones push
    platform.ready().then(() => {
      this.notificacionPush();
      
      //Metodo para cuando se le de back al celular cierre la app y lo envie al login
      this.utils.outApp("LoginPage");
      
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

    //alert("constructor");
    //Metodo para cuando se le de back al celular cierre la app y lo envie al login
    this.utils.outApp("QrPage");

    //Obtención del userName - Ya viene encriptado
    this.storage.get('userName').then((val) => {
      if (val != null) {
        //this.userName = val;

        var aesUtil = new AesUtil(128,1000);
        // Se encripta el usuario con el nuevo encript que paso hernan 2019
        this.userName = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, val);
      }
    });

    //Obtención del requestId del login
    this.storage.get('REQUESTID').then((val) => {
      if (val != null) {
        this.requestId = val;
        //alert("request id "+this.requestId);
      }
    });

    //Obtención del messageId - PROVIENE DEL LOGIN
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

  this.storage.get('AUTHTYPE').then((val) => {
    if(val != null){
        this.authType = val;
        //alert("auth Type "+this.authType);
      }
  });

  platform.registerBackButtonAction(() => {
    this.navCtrl.push("BandejaMenuPage");
  });
    
  }

  ionViewDidLoad(){

    // Inicia y valida el tiempo de sesion "esta configurado para 1 minuto"
    //this.utils.initTimeOut("si");

    this.storage.get('AUTHTYPE').then((val) => {
      if(val != null){
          this.authType = val;
        }
    });

    //Obtención del AuthData del login
    this.storage.get('AUTHDATA').then((val) => {
      if (val != null) {
        //alert("auth data "+val);
        if(this.authType == "QR"){
          this.authData = val;
        }
        else{
          this.authData = "";
        }
      }
    });

    //Obtención del DeliveryCh del login
    this.storage.get('DELIVERYCH').then((val) => {
      //alert("delivery channel: "+val);
      if(val != null){
        //alert((val == 'true'));
        if(val == 'true'){
          this.mostrarCreatedCode = true;
          this.btnScanerQR = true;
          this.deliveryCh = val;
          //alert("auth QR: "+this.authData);
          this.createCode(this.authData);
        }
        
      }
    });

    //Obtención del ResponseCh del login
    this.storage.get('RESPONSECH').then((val) => {
      //alert("response chanell: "+val);
      if(val != null){
        if(val == 'true' || val == true){
          this.responseCh = val;
          this.btnScanerQR = false;
          //this.scanCode();
        }
        
      }
    });

    
  }

  
  createCode(createQR) {
    
    // Inicia y valida el tiempo de sesion "esta configurado para 1 minuto"
    //this.utils.initTimeOut();

    this.createdCode = createQR;
  }

  scanCode() {
    //alert("scanCode1");
    // Inicia y valida el tiempo de sesion "esta configurado para 1 minuto"
    //this.utils.initTimeOut();

    try {

      var mensaje = this.utils.getMessageLanguage("mensajeQr" );   
      
      this.options = {
        prompt : mensaje
      }
     
      this.barcodeScanner.scan(this.options).then(barcodeData => {
        console.log("mensaje=>scaner lector:"+barcodeData.text);
        
        this.scannedCode = barcodeData.text;
        this.res = this.scannedCode;
        //alert("dato scaneado: "+this.scannedCode);
        this.authQR();
        //this.storage.set("valorQR", this.res);
      }, (err) => {
        console.log('Error 1: ' + err);
      });
    } catch (error) {
      console.log("error scancode "+error);
    }
    
  }

  scanCode2(){
    //alert("scanCode2");
    this.barcodeScanner.scan().then(barcodeData => {
      this.scannedCode = barcodeData.text;
      this.res = this.scannedCode;
      //alert("dato scaneado: "+this.scannedCode);
      this.authQR();
      //this.storage.set("valorQR", this.res);
    }, (err) => {
      console.log('Error: ' + err);
    });
  }

  encode() {
    //alert("encode");
    this.barcodeScanner.encode(this.barcodeScanner.Encode.TEXT_TYPE, this.qrData).then((data) => {
      this.createdCode = data;
      
    }, (err) => {
      console.log('Error encode: ', err);
    });
  }


  //metodo para validar QR - 
  public authQR() {  //PONER EL BOTON BLOQUEADO CUANDO HAGA LA CONSULTA 

    var aesUtil = new AesUtil(128,1000);
    var urlOtp = "auth/callAuth/";

    /*var newModel: string = this.utils.changePuntoComa(this.device.model);

    this.data = '{"iddev":"' + this.device.uuid + '",' +
                '"model":"' + newModel + '",' +
                '"cordova":"' + this.device.cordova + '",' +
                '"plataform":"' + this.device.platform + '",' +
                '"version":"' + this.device.version + '",' +
                '"manufacturer":"' + this.device.manufacturer + '",' +
                '"serial":"' + this.device.serial + '",' +
                '"isVirtual":"' + this.device.isVirtual + '"}';
                
    this.encripData = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.data);*/

    this.data  = this.utils.infoDevice();
    this.encripData = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, JSON.stringify(this.data ));


    console.log("mensaje=>scaner envio:"+this.res);
    //Datos del dispositivo
    this.jsonDataDevice =
      {
        "userName": this.userName,
        "authType": "QR",
        "data": this.res,
        "requestId": this.requestId,
        "messageId": this.messageId,
        "msgjsessionId": this.msgjsessionId,
        "keyMessage": "key1234",
        "device": {
          "iddev": aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.utils.deviceId )  
        },
        "reasonCalled"      : "auth_QR",
        "scoreRiskCustomer" : "0",
        "geoRefLatitude"    : this.latitud,
        "geoRefLongitude"   : this.longitud,
        "deviceTrustId"     : aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.utils.deviceId ),
        "deviceTrustData"   : this.encripData,
        "idkey"             : this.http.idkey
      }
    console.log("Datos enviar auth QR: "+JSON.stringify(this.jsonDataDevice));
    this.http.callServer(this.jsonDataDevice, urlOtp).then(res => {

      this.message = JSON.stringify(res);
      console.log("mensaje=>Resultado auth/callAuth/: " + this.message);
      this.storage.set('MESSAGEID', res.messageId);
      this.storage.set('msgjsessionId', res.msgjsessionId); 
      if( res.messageId != null ||  res.messageId!=""){
        this.messageId = res.messageId;
      }

      try {

        this.utils.errorControl(res.message.code);

        if (res.message.description == "STATUS OK") {
          //this.navCtrl.push('MenuPage');
          this.imgResStatus = true;
          this.errorAdicional = false;
          this.icono = "../../assets/img/verde.jpg";
          this.utils.presentAlert("mensaje.auth");
          this.resp = this.utils.getMessageLanguage("mensaje.auth");
          this.btnScanerQR = true;
        }
        else {
          //this.utils.presentAlert('Error-> '+res.message.code+": "+res.message.description);
          this.errorAdicional = true;
          this.imgResStatus = false;
          this.icono = "../../assets/img/rojo.jpg";
          this.utils.errorControl(res.message.code);
         }

      } 
      catch (error) {
        this.utils.presentAlert("mensajeErrorControlado"+error);
      }

    },
      error => {
        this.errorAdicional = true;
        this.icono = "../../assets/img/rojo.jpg";
        if (error) {
          this.utils.presentAlert("mensaje.error");
          this.storage.clear();
          this.utils.clearVariableSesion();
          this.navCtrl.setRoot("LoginPage");
        }
      })

  }


  logout() {
    this.utils.presentConfirm("LoginPage");
  }

  public menu(){
    this.menuCtrl.toggle();
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

                      this.data  = this.utils.infoDevice();

        this.encripData = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, JSON.stringify(this.data ));

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
            "reasonCalled"      : "auth_valUser",
            "scoreRiskCustomer" : "0",
            "geoRefLatitude"    : this.latitud,
            "geoRefLongitude"   : this.longitud,
            "deviceTrustId"     : aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase,this.utils.deviceId ),
            "deviceTrustData"   : this.encripData,
            "idkey"             : this.http.idkey
          }


      /*  this.jsonDataDevice2 =
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

  public devolverse(){
    this.navCtrl.push("BandejaMenuPage");
  }


  public reiniciarSesion() {
    this.utils.reload();  
  }
}
