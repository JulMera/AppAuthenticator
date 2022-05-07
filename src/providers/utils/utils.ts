import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { AlertController, LoadingController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { HttpProvider } from '../../providers/http/http';
//import { NavController } from "ionic-angular/index";
import { NavController } from "ionic-angular";
import { App, Platform } from "ionic-angular";
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import * as CryptoJS from 'crypto-js';
import { DbaProvider } from '../../providers/dba/dba';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Device } from '@ionic-native/device';
import { infoTesting } from '../../config/params.app';
declare var AesUtil: any;

/*
  Generated class for the UtilsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()

export class UtilsProvider {


  public userLogin: string = "";//se usa para el usuario demo
  public deviceId: any = ""; //se usapara consultar el id del dispositivo
  private navCtrl: NavController;
  private fk: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
  private iter: string;
  private arrayDir: string;
  private factor: string;
  private posDir: string;
  public message: string;
  public separator: string = "%20%BA";
  public company: string = "1";
  public channel: string = "APP";
  private lang: string = "en_us";
  private langStart: string = "en_us";
  private sessionId: string;
  public patterEmail: string = '^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$';
  public patterText: string = "[:|;|,|\\|Ã Ã¨Ã¬Ã²Ã¹|Ã¡Ã©Ã­Ã³Ãº|Ã¼|Ã�Ã‰Ã�Ã“Ãš|Ã€ÃˆÃŒÃ’Ã™|Ãœ|Ã±|Ã‘|.|_|?|/|*|0-9a-zA-Z| ]";
  public opt_validator: string = "*";
  //variable para los comandos desviados
  public commandLst: Array<string[]>;
  public cmd: string[];
  public procesoOTP: number = 0; //desde aqui obtenemos el valor de la variable de sesion

  public cont: number = 1;
  private temp: number = 0;

  /*
    nuevas variables 2019
  */
  public iv: string = "F27D5C9927726BCEFE7510B1BDD3D137";
  public salt: string = "3FF2EC019C627B945225DEBAD71A01B6985FE84C95A70EB132882F88C0A59A55";


  // Variables para el sessionTimeout
  idleState = 'Not started.';
  timedOut = false;
  min: any;
  sec; any;

  public data: string;
  public jsonDataDevice: any;
  public jsonDataDevice2: any;
  public encripData: string;



  constructor(public http: Http, private storage: Storage, public translate: TranslateService, private alertCtrl: AlertController, public httpProvi: HttpProvider, private app: App,
    public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public dba: DbaProvider, private idle: Idle, private device: Device, public loadingCtrl: LoadingController) {

    this.navCtrl = app.getActiveNav();

    this.storage.get('iter').then((val) => {
      this.iter = val;
    });

    this.storage.get('arrayDir').then((val) => {
      this.arrayDir = val;
    });

    this.storage.get('factor').then((val) => {
      this.factor = val;
    });

    this.storage.get('posDir').then((val) => {
      this.posDir = val;
    });

    this.storage.get('procesoOTP').then((val) => {
      this.procesoOTP = val;
    });

    // this.searchIdDevice();

  }

  public getProcesoOTP(): number {

    this.storage.get('procesoOTP').then((val) => {
      if (val != null) {
        this.procesoOTP = val;
      }
      else {
        this.procesoOTP = 0;
      }

    });

    return this.procesoOTP;

  }


  public getLanguage(): string {
    this.storage.get('lenguaje').then((val) => {
      this.lang = val;
    });
    if (this.lang == 'undefined' || this.lang == null || this.lang == "") {
      this.lang = this.langStart;
    }
    return this.lang;
  }

  public getSessionId(): string {
    this.storage.get('sessionId').then((val) => {
      this.sessionId = val;
    });
    return this.sessionId;
  }

  public setSessionId(sid: string) {
    this.sessionId = sid;
  }


  public getCommands(pos: number): string[] {
    /**this.storage.get('commands').then((val) => {  
     this.commandLst = val;
     this.cmd = this.commandLst[pos];    
    });  */
    return this.commandLst[pos];
  }

  public setCommands(param: Array<string[]>) {
    this.commandLst = param;
  }


  //Metodo para obtencion de los property en los alertController
  alertCampos(param) {
    var alertFecha = this.getMessageLanguage(param);
    let alert = this.alertCtrl.create({
      title: this.getMessageLanguage("logout.message"),
      message: alertFecha,
      buttons: ['OK']
    });
    alert.present();
  }

  /**
   * @date 18/05/2018
   * @author jfonseca
   * @description Muestra el msj que envia el servidor en el alert de ionic (sin traducir en msj)
   * @param
   */
  public alertServidor(param) {
    var alertFecha = this.getMessageLanguage(param);
    let alert = this.alertCtrl.create({
      title: this.getMessageLanguage("logout.message"),
      message: param,
      buttons: ['OK']
    });
    alert.present();
  }

  /**
   * Metodo que se encarga de devolver el valor traducido
   * ingresado en el json
   * @param param 
   */
  public getMessageLanguage(param) {
    var textTraslate;
    this.translate.get(param).subscribe(
      value => {
        textTraslate = value;
      }
    )
    return textTraslate;
  }

  //Metodo de confirmaciÃ³n
  presentConfirm(url) {
    let alert = this.alertCtrl.create({
      title: this.getMessageLanguage("logout.message"),
      message: this.getMessageLanguage("logout.titulo"),
      buttons: [
        {
          text: this.getMessageLanguage("confirm.btnCancelar"),
          handler: data => {
            if (this.getMessageLanguage("confirm.btnCancelar")) {


            }
          }
        },
        {
          text: this.getMessageLanguage("confirm.btnAceptar"),
          handler: data => {
            if (this.getMessageLanguage("confirm.btnAceptar")) {
              this.logout();
              //this.navCtrl.push("LoginPage");  
              //this.translate.use("en_us");
              //this.navCtrl.popToRoot(); 
              this.navCtrl.push("LoginPage");
            }
          }
        }
      ]
    });
    alert.present();
  }

  //Limpia todas las variables de sesion
  public cleanAll() {
    this.storage.clear();
  }


  //se limpian las Variables de sesiÃ³n this.storage.remove(''); y el sessionId
  public clearVariableSesion() {
    this.storage.clear();
    //this.sessionId = null;
  }

  //Metodo para salir del aplicativo
  public logout() {

    this.clearVariableSesion();
    this.storage.remove('procesoOTP');
    this.storage.clear();
    this.navCtrl.push("LoginPage");

  }

  //Metodo para validar el E-mail
  validar_email(email) {
    var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email) ? true : false;
  }

  public encodePass(pass): string {

    var wordArray = CryptoJS.enc.Utf8.parse(pass);
    var passw = CryptoJS.enc.Base64.stringify(wordArray);

    return passw;
  }

  public decodeText(text): string {

    var words = CryptoJS.enc.Base64.parse(text);
    var textString = CryptoJS.enc.Utf8.stringify(words);
    return textString;
  }

  public encodeUser(user): string {

    var wordArray = CryptoJS.enc.Utf8.parse(user);
    var usuario = CryptoJS.enc.Base64.stringify(wordArray);

    return usuario;
  }

  //Metodo del alertController para obtener info de los property
  presentAlert(mensaje) {

    var alertTitle;
    this.translate.get(mensaje).subscribe(
      value => {
        alertTitle = value;
      }
    )
    let alert = this.alertCtrl.create({
      //title: alertTitle,
      title: this.getMessageLanguage("logout.message"),
      message: this.getMessageLanguage(mensaje),
      buttons: ['OK']
    });
    alert.present();
  }

  presentAlert2(mensaje) {

    let alert = this.alertCtrl.create({
      //title: alertTitle,
      title: this.getMessageLanguage("logout.message"),
      message: mensaje,
      buttons: ['OK']
    });
    alert.present();
  }

  //obtenciÃ³n de los property sin los alert
  public valorProperty(palabra): string {

    var mensaje;
    this.translate.get(palabra).subscribe(
      value => {
        mensaje = value;
      }
    )
    return mensaje;
  }


  //Metodo para salir de la App 
  public outApp(page) {


    var mensaje1 = this.valorProperty("logout.message");
    var mensaje2 = this.valorProperty("outApp2");
    var cancelar = this.valorProperty("confirm.btnCancelar");
    var aceptar = this.valorProperty("confirm.btnAceptar");

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
      //activeView.name === 'InboxPage'
      if (activeView.name === page) {
        if (nav.canGoBack()) {
          nav.pop();
        } else {
          const alert = this.alertCtrl.create({
            title: mensaje1,
            message: mensaje2,
            buttons: [{
              text: cancelar,
              role: 'cancel',
              handler: () => {
                //this.nav.setRoot('HomePage');
                console.log('Salida Cancelada!');
              }
            }, {
              text: aceptar,
              handler: () => {
                //this.platform.exitApp();
                this.storage.clear();
                this.navCtrl.push("LoginPage");
              }
            }]
          });
          alert.present();
        }
      }
    });
  }

  //Metodo para salir de la App e ir al login
  public exitApp(page) {

    var mensaje1 = this.valorProperty("logout.message");
    var mensaje2 = this.valorProperty("outApp1");
    var cancelar = this.valorProperty("confirm.btnCancelar");
    var aceptar = this.valorProperty("confirm.btnAceptar");

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
      //activeView.name === 'InboxPage'
      if (activeView.name === page) {
        if (nav.canGoBack()) {
          nav.pop();
        } else {
          const alert = this.alertCtrl.create({
            title: mensaje1,
            message: mensaje2,
            buttons: [{
              text: cancelar,
              role: 'cancel',
              handler: () => {
                //this.nav.setRoot('HomePage');
                console.log('Salida Cancelada!');
              }
            }, {
              text: aceptar,
              handler: () => {
                this.storage.clear();
                this.platform.exitApp();
                //this.navCtrl.push("LoginPage");
              }
            }]
          });
          alert.present();
        }
      }
    });
  }

  public changePuntoComa(text): string {

    var temp: string;
    var newModel: string;

    temp = text;
    newModel = temp.replace(",", ".");

    return newModel;

  }

  public methodAesUtils() {
    var iterationCount = 1000;
    var keySize = 128;
    var passphrase = "323w0rk5";
    var plaintext = "mensaje";
    //var iv = CryptoJS.lib.WordArray.random(128/8).toString(CryptoJS.enc.Hex);
    //var salt = CryptoJS.lib.WordArray.random(128/8).toString(CryptoJS.enc.Hex);
    //var iv="F27D5C9927726BCEFE7510B1BDD3D137";
    //var salt ="3FF2EC019C627B945225DEBAD71A01B6985FE84C95A70EB132882F88C0A59A55";

    var aesUtil = new AesUtil(128, 1000);
    var ciphertext = aesUtil.encrypt(this.salt, this.iv, passphrase, plaintext);
    //alert("iv->"+iv);
    //alert("textciphred->"+ciphertext);
  }

  //public encryptMasterKey: string;
  public passphrase: string;

  public encrypMasterKey() {

    //this.dba.createDataBaseFile();
    this.passphrase = "323w0rk5";
    //var iv = CryptoJS.lib.WordArray.random(128/8).toString(CryptoJS.enc.Hex);
    //var salt = CryptoJS.lib.WordArray.random(128/8).toString(CryptoJS.enc.Hex);
    //var iv="F27D5C9927726BCEFE7510B1BDD3D137";
    //var salt ="3FF2EC019C627B945225DEBAD71A01B6985FE84C95A70EB132882F88C0A59A55";

    var aesUtil = new AesUtil(128, 1000);
    var ciphertext = aesUtil.encrypt(this.salt, this.iv, this.passphrase, this.passphrase);
    //this.encryptMasterKey = ciphertext;
    this.dba.actualizarD1(ciphertext);
    //alert("this.encryptMasterKey: "+ciphertext);
    //alert("iv->"+iv);
    //alert("textciphred->"+ciphertext);
  }

  public decryptMasterKey() {
    //alert("decryptMasterKey");
    //this.dba.createDataBaseFile();
    //var passphrase   = "323w0rk5";
    //var iv = CryptoJS.lib.WordArray.random(128/8).toString(CryptoJS.enc.Hex);
    //var salt = CryptoJS.lib.WordArray.random(128/8).toString(CryptoJS.enc.Hex);
    //var iv="F27D5C9927726BCEFE7510B1BDD3D137";
    //var salt ="3FF2EC019C627B945225DEBAD71A01B6985FE84C95A70EB132882F88C0A59A55";

    var aesUtil = new AesUtil(128, 1000);
    var consultaD1Encrypt = this.dba.obtenerD1();
    //alert("consultaD1Encrypt: "+consultaD1Encrypt);
    var ciphertext = aesUtil.decrypt(this.salt, this.iv, this.passphrase, consultaD1Encrypt);
    //alert("decryptMasterKey: "+ciphertext);
    //alert("iv->"+iv);
    //alert("textciphred->"+ciphertext);
  }


  // Metodo para iniciar con el session timeout
  initTimeOut(): boolean {
    //alert("Pantalla: "+pantalla);

    var minutos = 5;
    this.idle.setIdle(minutos);  //after 5 sec idle 
    this.idle.setTimeout(minutos * 60);  //5min countdown
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onIdleEnd.subscribe(() => this.idleState = 'No longer idle.');

    this.cont = 1;
    this.temp = 0;
    // alert("Cont fuera: "+this.cont+"\n temp: "+this.temp);

    if (this.cont == 1) {
      this.idle.onTimeout.subscribe(() => {
        this.idleState = 'Timed out!';
        this.timedOut = true;

        //alert("cont dentro: "+this.cont+"\n temp: "+this.temp);
        //this.cont = this.cont + 1;
        if (this.temp === 0) {
          //this.alertTimeout("timeOut.Msj");  
          //this.navCtrl.pop();  //go to logout page after 5 min idle.
          this.salirApp();
          this.temp = 1;
        }

        this.cont = 0;
        // alert("cont sale: "+this.cont+"\n temp: "+this.temp);  
        return true;
      });
    }


    this.idle.onIdleStart.subscribe(() => this.idleState = 'You\'ve gone idle!');
    this.idle.onTimeoutWarning.subscribe((countdown) => {


      var data = countdown / 60;
      this.min = data.toString().split('.')[0];
      this.sec = parseFloat(0 + '.' + data.toString().split('.')[1]) * 60;
      this.sec = (Math.round(this.sec * 100) / 100);
      //console.log("mensaje=countdown>"+countdown);

      this.idleState = 'You\'ll logout in ' + this.min + ' min ' + this.sec + '  seconds!';
    });
    this.reload();
    return false;
  }

  reload() {

    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  private salirApp() {
    this.alertTimeout("timeOut.Msj");
    this.navCtrl.pop();  //go to logout page after 5 min idle.
  }

  alertTimeout(mensaje) {
    var alertTitle;
    this.translate.get(mensaje).subscribe(
      value => {
        alertTitle = value;
      }
    )
    let alert = this.alertCtrl.create({
      title: this.getMessageLanguage("timeOut.Title"),
      message: alertTitle,
      buttons: [{
        text: 'OK',
        handler: () => {
          this.storage.clear();
          this.app.getActiveNav().setRoot("LoginPage"); 

        }
      }]
    });
    alert.present();
  }

  //Validaciones para el manejo de errores enviados por peticiones de la App
  public errorControl(error) {

    switch (error) {
      case '0000':

        break;
      case '000':

        break;
      case '0001':
        this.presentAlert("mensaje0001");
        break;
      case '008':
        this.presentAlert("validacion008");
        this.navCtrl.push("InboxPage");
        break;
      case '011':
        this.presentAlert("mensaje011");
        this.navCtrl.push("LoginPage");
        break;
      case '046':
        //user secure has expired
        this.presentAlert("userSecurity.msj046");
        break;
      case '101':
        this.presentAlert('mensajeSesion');
        this.storage.clear();
        this.clearVariableSesion();
        this.navCtrl.push("LoginPage");
        break;
      case '301':
        this.presentAlert("mensaje301");
        break;
      case '401':
        this.presentAlert("mensaje401");
        break;
      case '402':
        //this.presentAlert("mensaje402");
        this.navCtrl.push('MenuPage');
        break;
      case '403':
        this.presentAlert("mensaje403");
        this.navCtrl.push("InboxPage");
        break;
      case '404':
        this.presentAlert("mensaje404");
        break;
      case '406':
        this.presentAlert("mensaje406");
        break;
      case '501':
        this.presentAlert("mensaje501");
        break;
      case '502':
        this.presentAlert("mensaje502");
        break;
      case '503':
        this.presentAlert("mensaje503");
        break;
      case '908':
        this.presentAlert("message.code908");
        break;
      case '9000':
        this.presentAlert("mensaje9000");
        break;
      case '9001':
        this.presentAlert("mensaje9001");
        break;
      case '9002':
        this.presentAlert("mensaje9002");
        break;
      case '9003':
        this.presentAlert("tk.error9003");
        break;
      case '0004':
        //this.presentAlert("Login.consultaDeviceId");
        this.presentAlert("mensaje0004");
        break;
      default:
        this.presentAlert("mensaje.error");
        break;
    }
  }
  
  public presentLoading() {

    var msj = this.getMessageLanguage("inbox.loanding");
    let loading = this.loadingCtrl.create({
      content: msj
    });

    loading.present();

    setTimeout(() => {
      loading.dismiss();
    }, 3000);
  }



  public variablesGlobales(variable) {
    var respuesta;

    switch (variable) {
      case "emisorApp":
        
    respuesta = "BACOLOMBIA";
    //respuesta = "PYT";
        break;

      case "appProcess":
    respuesta = "E";
    //respuesta = "I";
        break;
    }
    console.log("mensaje=>variablesGlobales: " + respuesta);
    return respuesta;

  }

  infoDevice() {
    let data: any;

    if (this.userLogin.toLowerCase() == infoTesting.userTesting.toLowerCase()) {
      data = infoTesting.deviceTesting;
    } else {
      var temp: string;
      temp = this.device.model;
      var newModel: string;
      newModel = this.changePuntoComa(temp);
      data = {
        "uid": this.device.uuid,
       // "iddev": this.deviceId,
        "model": newModel,
        "cordova": this.device.cordova,
        "plataform": this.device.platform,
        "version": this.device.version,
        "manufacturer": this.device.manufacturer,
        "serial": this.device.serial,
        "isVirtual": this.device.isVirtual
      };

    /*  if (this.deviceId == "" || this.deviceId == null || this.deviceId == undefined) {
        delete data.iddev;
      }*/

    }

    //console.log("mensaje=>dispositivo:" + JSON.stringify(data));

    return data;
  }


  public searchIdDevice() {

    return new Promise((resolve, reject) => {

      if (this.userLogin.toLowerCase() == infoTesting.userTesting.toLowerCase()) {
        this.deviceId = infoTesting.deviceIdTesting;
        resolve(this.deviceId);
      } else {

        this.dba.deviceExists().then(idFinger => {
          this.deviceId = idFinger;
          console.log("mensaje=> searchIdDevice  " + idFinger);
          resolve(this.deviceId);
        }, (error) => {
          console.log("mensaje=>error searchIdDevice  " + error);
          reject(error);
        })

      }


    });
  }

}