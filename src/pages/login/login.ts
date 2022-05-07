import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { HttpProvider } from '../../providers/http/http';
import { UtilsProvider } from '../../providers/utils/utils';
import { AlertController } from 'ionic-angular';
import { TasksServiceProvider } from '../../providers/tasks-service/tasks-service';
import { DbaProvider } from '../../providers/dba/dba';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { FingerprintAIO, FingerprintOptions } from '@ionic-native/fingerprint-aio';
import { Network } from '@ionic-native/network';
import { ToastController } from 'ionic-angular';
import { TouchID } from '@ionic-native/touch-id';
import { Platform } from 'ionic-angular';


// Nuevo 2019
declare var AesUtil: any;


/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public envioDeviceID: string;

  public usuario: string;
  public pass: string;
  public message: any;
  public errorUsu;
  public errorPas;
  private lang: string = "en_us";
  private lenguajeAPP: string = "";
  private datos: Array<string[]>;
  public data: any;
  public encripData: string;
  idioms: any[] = [];
  nome = '';
  public contadorIntentos: number = 0;
  public isBtnEnabled: boolean = true;
  public isBtnEnabledAfi: boolean = false;

  public id: string;
  public model?: string;
  public cordova?: string;
  public platform?: string;
  public version?: string;
  public manufacturer?: string;
  public serial?: string;
  public isVirtual?: boolean;
  public lat?: number;
  public long?: number;
  public jsonDataDevice: any;
  public jsonDataDevice2: any;
  public jsonFiltro: any;
  public jsonCell: any;
  public huella: boolean = false;
  public face_ID: boolean = false;
  public consultaDeviceId: any;
  fingerprintOptions: FingerprintOptions;
  private red: boolean = true;
  public configDeviceDb: any;


  //para encriptar password
  //private CryptoJS: any =  require('crypto-js');
  private SECERET_KEY: string = 'e2eworks';
  //public passphrase: string = "323W0RKS";

  public latitud: any;
  public longitud: any;

  public contenedorBtn: boolean = true;
  public emisorApp: any;
  public appProcess: any;
  tasks: any[] = [];
  public authType: any;
  public notaContador: boolean = false;

  constructor(/*private device: Device,*/public navCtrl: NavController, public navParams: NavParams, private translateService: TranslateService, public loadingCtrl: LoadingController,
    private storage: Storage, public http: HttpProvider, public utils: UtilsProvider, private alertCtrl: AlertController, public tasksService: TasksServiceProvider,
    public dba: DbaProvider, private barcodeScanner: BarcodeScanner, private faio: FingerprintAIO, private network: Network, public toast: ToastController,
    public faceID: TouchID, private platform_R: Platform) {

    //this.contenedorBtn = true;

    this.emisorApp = this.utils.variablesGlobales("emisorApp");
    this.appProcess = this.utils.variablesGlobales("appProcess");


    this.platform_R.ready().then(() => {

      //SE CONSULTA QUE EL DISPOSITIVO TENGA FINGERPRINT ó FACEID
      if (this.platform_R.is('android')) {

        this.faio.isAvailable().then(result => {
          if (result === "finger") {
            this.huella = true;
          }
          else if (result === "face") {
            this.face_ID = true;
          }
        });

      } else {
        this.faceID.isAvailable().then(res => {
          
          if (res === "finger") {
            this.huella = true;
          }
          else if (res === "face") {
            this.face_ID = true;
          }
          
          err => console.log('Error al cargar la huella', err)

          });
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


      this.dba.getStatusDataBase().subscribe(rdy => {
        //this.searchIdDevice();
        this.dba.obtenerD1();
        /// this.utils.searchIdDevice();
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

    });

    //Metodo para cuando se le de back al celular cierre la app
    //this.utils.exitApp("LoginPage");
    //alert("constructor");
    //this.idioms = [];

    /*this.idioms = [
      {
        value: 'es_co',
        label: 'Español',
      },
      {
        value: 'en_us',
        label: 'English'
      }
    ];
    this.storage.set('lenguaje', this.translateService.getDefaultLang());
    
    this.lang = this.utils.getLanguage();
    */

    //this.utils.clearVariableSesion();
    //this.storage.remove('procesoOTP');
    //this.storage.clear();

  }

  choose(lang) {
    //alert(lang);
    this.translateService.use(lang);
    this.storage.set('lenguaje', lang);
    this.lang = lang;
  }

  ionViewDidLoad() {
    //alert("ionViewDidLoad");
    //this.idioms = [];
    this.idioms = [
      {
        value: 'es_co',
        label: 'Español',
      },
      {
        value: 'en_us',
        label: 'English'
      }
    ];



    this.storage.get('lenguaje').then((val) => {
      //alert("lenguaje"+val);
      if (val == null) {
        //alert("1");
        this.translateService.setDefaultLang('en_us');
        this.translateService.use('en_us');
        this.storage.set('lenguaje', val);
      }
      else {
        //alert("2");
        this.translateService.setDefaultLang(val);
        this.translateService.use(val);
        this.storage.set('lenguaje', val);
      }

    });

    //this.translateService.setDefaultLang('en_us');
    //this.translateService.use('en_us');

    //SE CONSULTA QUE EL DISPOSITIVO TENGA FINGERPRINT ó FACEID
/*     this.faio.isAvailable().then(result => {
      if (result === "finger") {
        this.huella = true;
      }
      else if (result === "face") {
        this.face_ID = true;
      }
    }); */

    this.storage.get('lenguaje').then((val) => {
      //alert("lenguaje"+val);
      if (val != null) {
        this.lang = val;
      }
    });
    //this.dba.searchIdDevice(this.consultaDeviceId);
    //this.searchIdDevice();
  }

  public searchIdDevice(): string {

    var sql: string = 'select optional01 from USUARIO where time_01 = (select MAX(time_01) from USUARIO) ';
    var response = this.dba.executeQuery(sql);

    response.then((data) => {
      console.log("DATA " + JSON.stringify(data));
      if (data.rows) {
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            this.consultaDeviceId = (data.rows.item(i).optional01);
          }

        }
      }
    })
      .catch(e => console.log("Error al consultar " + JSON.stringify(e)));

    return this.consultaDeviceId;

  }

  login() {

    this.isBtnEnabled = false;
    this.isBtnEnabledAfi = true;

    //if(this.red == true){
    if (this.usuario == null && this.pass == null) {
      //alert("{{ 'Login.alertUser' | translate }}");
      //alert("Debe ingresar la contraseña");
      this.presentAlert();
      this.isBtnEnabled = true;
      this.isBtnEnabledAfi = false;
    }
    else {
      this.lenguague();
      this.validateUser();
    }
    /*}
    else{
      this.isBtnEnabled = true;
      this.utils.presentAlert("Login.red");
    }*/  // OJO  descomentar esta validacion despues que llegue el internet 17 de septiembre de 2019

  }


  lenguague() { this.storage.get('lenguaje').then((val) => { this.lang = val; }); }


  public validateUser() {

    var aesUtil = new AesUtil(128, 1000);
    String.prototype.trim = function () { return this.replace(/^\s+|\s+$/g, ""); };

    var use: string = this.usuario.trim().toUpperCase();
    //var command = 'APPLOGIN';

    var userLogin: string = use;
    //var passw = this.utils.encodePass(this.pass);
    //var user = this.utils.encodeUser(userLogin);
    var user = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, userLogin);
    //alert("usuario: "+use+"\n"+"encrip: "+user);
    var passw = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.pass);

    this.storage.set("userName", userLogin);
    this.storage.set("nameUser", user);
    this.storage.set("password", passw);

    console.log("http.salt " + this.http.salt);
    console.log("http.iv " + this.http.iv);
    console.log("http.passphrase " + this.http.passphrase);

    /*try {
      this.device.model = this.device.model.replace(",", ".");
      this.device.version = this.device.version.replace(",", ".");
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
    //this.utils.searchIdDevice();

    this.utils.searchIdDevice().then(idFinger => {


      this.utils.deviceId = idFinger;


      this.data = this.utils.infoDevice();

      this.encripData = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, JSON.stringify(this.data));
      var iddevEnc: string = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, idFinger);

      /*this.encripData = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.data);
      var iddevEnc: string = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.device.uuid);*/

      //Datos del dispositivo
      this.jsonDataDevice =
      {
        "userName": user,
        "userPasw": passw,
        "company": aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, "1"),
        "appAuthType": aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, "AUTH"),
        "appProcess": aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.appProcess),
        "device": {
          "data": this.encripData,
          "iddev": iddevEnc
        },
        "authType": "AUTH",
        "reasonCalled": "auth_valUser",
        "scoreRiskCustomer": "0",
        "geoRefLatitude": this.latitud,
        "geoRefLongitude": this.longitud,
        "deviceTrustId": aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, idFinger),
        "deviceTrustData": this.encripData,
        "internalUserName": this.emisorApp,
        "idkey": this.http.idkey,
        "typekey": "A"

      }

      /*
          this.jsonDataDevice2 =
          {
            "userName": user,
            "userPasw": passw,
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
          }
           this.storage.set("infoDevice", this.jsonDataDevice2);
          */

      this.storage.set("infoDevice", this.data);


      var urlLogin = "security/login/";
      console.log("mensaje=>Envio security/login/: " + JSON.stringify(this.jsonDataDevice));
      this.http.callServer(this.jsonDataDevice, urlLogin).then(res => {
        //alert(res);
        this.message = JSON.stringify(res);

        console.log("mensaje=>Resultado security/login/: " + this.message);
        //messageId

        //alert("Datos del login, AUTHTYPE: "+res.authType);

        //Se guarda en sesion los datos que llegan por JSON
        this.storage.set('OPTIONAL01', res.optional01);
        this.storage.set('DELIVERYCH', res.deliveryCh);
        this.storage.set('RESPONSECH', res.responseCh);
        this.storage.set('AUTHTYPE', res.authType);
        this.storage.set('REQUESTID', res.requestId);
        this.storage.set('AUTHDATA', res.authData);
        this.storage.set('FROM_LOGIN', true);

        this.storage.set('MESSAGEID', res.messageId);
        this.storage.set('msgjsessionId', res.msgjsessionId);

        this.usuario = "";
        this.pass = "";

        if (res != '' && typeof res !== "undefined") {
          this.isBtnEnabled = true;
          this.isBtnEnabledAfi = false;

          try {

            if (res.message.code == "000") {
              this.dba.createDataBaseFile();
              this.storage.set('MESSAGEID', res.messageId);
              this.storage.set('msgjsessionId', res.msgjsessionId);


              let respuesta = this.utils.decodeText(res.key);

              this.http.salt = respuesta.split(",")[0];
              this.http.iv = respuesta.split(",")[1];
              this.http.passphrase = respuesta.split(",")[2];
              this.http.idkey = respuesta.split(",")[3];

              this.dba.deleteDeviceConfig();
              this.dba.saveDeviceConfig(this.http.idkey, this.http.salt, this.http.iv, this.http.passphrase);

              //this.navCtrl.push('MenuPage'); 
              this.navCtrl.push('BandejaMenuPage');
              //this.loadInbox(res.messageId , res.msgjsessionId, user);

            }
            else {
              this.utils.errorControl(res.message.code);
            }
          }
          catch (error) {
            //this.utils.presentAlert("mensajeErrorControlado"+error); 
            this.utils.presentAlert("mensajeConexion");
          }

        }
        else {

          //alert("Nunca entra 1");
          this.storage.set('user', user);
          this.storage.set('sessionId', res.sessionId);
          this.utils.setSessionId(res.sessionId);
          //alert("paso1 "+res.lista1);     
          this.storage.set('commands', res.lista1);
          this.utils.setCommands(res.lista1);
          this.storage.set('usuario', res.optional1);
          this.storage.set('fecha', res.optional2);
          //this.navCtrl.push('MenuPage'); //Se cambio aqui 
          //this.navCtrl.push('InboxPage');
          this.navCtrl.push('BandejaMenuPage');
        }

      },
        error => {
          this.isBtnEnabled = true;
          this.isBtnEnabledAfi = false;
          this.utils.presentAlert("mensajeConexion");
          /*   console.log(error);
             if (error) {
               this.utils.presentAlert("mensajePeticion"+error);
             }
           })
           .catch(error => {
             if (error) {
               this.utils.presentAlert("mensajePeticion"+error);
             }*/
        });


    })



  }

  //Logueo con huella
  public loginFingerPrint() {
    this.utils.userLogin = "FINGER";

    if (this.red == true) {

      this.fingerprintOptions = {
        clientId: 'touchLogin',
        clientSecret: 'password', //Only necessary for Android
        //disableBackup:true  //Only for Android(optional)
      }
      if (this.platform_R.is('android')) {


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

                  this.callLoginFingerServices();
                }
                if (result.withFingerprint || result.Success) {
                  this.callLoginFingerServices();
                }

                this.faceID.verifyFingerprint('Scan your Fingerprint please')
                  .then(
                    res =>
                      this.callLoginFingerServices()
                    , err => console.log('Error ', err)

                  );

              })
          } else {
            this.utils.presentAlert("Login.red");
          }
        });
      } else {
        this.faceID.verifyFingerprint('Scan your Fingerprint please').then(
          res => this.callLoginFingerServices(),
          err => console.log('Error al llamar el servivio', err)

        )
      }
    }


  }

  private callLoginFingerServices() {
    this.dba.searchIdFinger().then(idFinger => {
      console.log("mensaje paso 0");
      // this.consultaDeviceId = this.dba.searchIdDevice("optional");
      this.consultaDeviceId = idFinger;
      this.utils.deviceId = idFinger;
      var aesUtil = new AesUtil(128, 1000);
      /*  var temp: string;
       // temp = this.device.model;
        var newModel: string;
        newModel = this.utils.changePuntoComa(temp);*/

      //var envioDeviceID = this.utils.encodeUser(this.consultaDeviceId);
      //this.envioDeviceID = this.utils.encodeUser(this.consultaDeviceId);

      //alert("login this.consultaDeviceId: "+this.consultaDeviceId);
      console.log("mensaje=>userName:" + this.consultaDeviceId);
      console.log("mensaje=>deviceId huella login " + idFinger)
      console.log("mensaje paso 1");
      this.utils.userLogin = "FINGER";
      this.data = this.utils.infoDevice();
      console.log("mensaje paso 2");
      this.encripData = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, JSON.stringify(this.data));
      console.log("mensaje paso 3");
      var iddevEnc: string = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, idFinger);
      console.log("mensaje paso 4");
      this.envioDeviceID = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, idFinger);
      console.log("mensaje paso 5");
      //Datos del dispositivo
      this.jsonDataDevice =
      {
        "userName": this.envioDeviceID,
        "userPasw": this.envioDeviceID,
        "company": aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, "1"),
        "appAuthType": aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, "AUTH"),
        "appProcess": aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.appProcess),
        "device": {
          "data": this.encripData,
          "iddev": iddevEnc
        },
        "authType": "AUTH",
        "reasonCalled": "auth_finger",
        "scoreRiskCustomer": "0",
        "geoRefLatitude": this.latitud,
        "geoRefLongitude": this.longitud,
        "deviceTrustId": aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, idFinger),
        "deviceTrustData": this.encripData,
        "internalUserName": this.emisorApp,
        "idkey": this.http.idkey
      }

      this.storage.set("nameUser", this.envioDeviceID);

      var urlLogin = "security/loginFinger/";
      console.log("mensaje=>Envio security/loginFinger/: " + JSON.stringify(this.jsonDataDevice));

      this.http.callServer(this.jsonDataDevice, urlLogin).then(res => {

        this.message = JSON.stringify(res);
        console.log("mensaje=>Resultado security/loginFinger/: " + this.message);
        this.storage.set('MESSAGEID', res.messageId);
        this.storage.set('msgjsessionId', res.msgjsessionId);
        //alert("FINGER inbox: "+this.message); 
        //alert("usuario finger: "+this.utils.decodeText(res.optional02));
        var user = "";
        try {
          //alert("finger: "+res.optional02);
          user = this.utils.decodeText(res.optional02);
          //alert("usuario finger: "+user);
          var encripUser = user;//this.utils.encodeUser(user);
        } catch (error) {
          console.log("Error!.." + error);
        }

        //messageId

        //Se guarda en sesion los datos que llegan por JSON
        this.storage.set('user', user);
        this.storage.set('OPTIONAL01', res.optional01);
        this.storage.set('DELIVERYCH', res.deliveryCh);
        this.storage.set('RESPONSECH', res.responseCh);
        this.storage.set('AUTHTYPE', res.authType);
        this.storage.set('REQUESTID', res.requestId);
        this.storage.set('AUTHDATA', res.authData);
        this.storage.set('FROM_LOGIN', true);
        //alert("Lo que le llega al inbox: "+ res.authType);
        // alert("MESSAGE ID finger: "+ res.messageId+ "\nauthTYPE: "+res.authType);
        this.storage.set('MESSAGEID', res.messageId);
        this.storage.set('msgjsessionId', res.msgjsessionId);
        //alert("MessageID Login: "+res.messageId);
        this.storage.set('userName', encripUser);
        this.storage.set('sessionId', res.sessionId);
        this.utils.setSessionId(res.sessionId);
        //alert("paso1 "+res.lista1);     
        this.storage.set('commands', res.lista1);
        this.utils.setCommands(res.lista1);
        this.storage.set('usuario', res.optional1);
        this.storage.set('fecha', res.optional2);

        this.usuario = "";
        this.pass = "";

        if (res != '' && typeof res !== "undefined") {
          this.isBtnEnabled = true;
          this.isBtnEnabledAfi = false;
          //this.utils.alertServidor(this.message.code);

          try {


            if (res.message.code == "000") {

              let respuesta = this.utils.decodeText(res.key);

              this.http.salt = respuesta.split(",")[0];
              this.http.iv = respuesta.split(",")[1];
              this.http.passphrase = respuesta.split(",")[2];
              this.http.idkey = respuesta.split(",")[3];

              this.dba.deleteDeviceConfig();
              this.dba.saveDeviceConfig(this.http.idkey, this.http.salt, this.http.iv, this.http.passphrase);

              this.navCtrl.push('BandejaMenuPage');
              //this.dba.createDataBaseFile();
              //this.loadInbox(res.messageId , res.msgjsessionId, encripUser);
            }
            else {
              this.utils.errorControl(res.message.code);
            }

          }
          catch (error) {
            //this.utils.presentAlert("mensajeErrorControlado"+error);
            this.utils.presentAlert("mensajeConexion");
          }

        }
        else {

          //alert("Nunca entra 2");
          this.storage.set('user', user);
          this.storage.set('sessionId', res.sessionId);
          this.utils.setSessionId(res.sessionId);
          //alert("paso1 "+res.lista1);     
          this.storage.set('commands', res.lista1);
          this.utils.setCommands(res.lista1);
          this.storage.set('usuario', res.optional1);
          this.storage.set('fecha', res.optional2);
          //this.navCtrl.push('MenuPage'); //Se cambio aqui
          this.navCtrl.push('BandejaMenuPage');
        }

      },
        error => {
          this.isBtnEnabled = true;
          this.isBtnEnabledAfi = false;
          this.utils.presentAlert("mensaje.error");
          /* console.log(error);
           if (error) {
             this.utils.presentAlert("mensaje.error");
           }
           else {
             this.utils.presentAlert("Error");
           }*/
        });



    })

  }

  //Metodo del alertController para obtener info de los property
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

  public afiliacion() {
    console.log("mensaje=> entro afiliacion " + this.red);

    if (this.red == true) {
      console.log("mensaje=> entro afiliacion1");
      this.navCtrl.push("RegistroAfiliacionPage", { lenguajeSeleccionadoLogin: this.lang });
    }
    else {
      console.log("mensaje=> entro afiliacion3");
      this.utils.presentAlert("Login.red");
    }
    console.log("mensaje=> entro afiliacion4");
  }

  public ionViewWillUnload() {
    this.isBtnEnabledAfi = false;
  }

  public home() {
    this.utils.methodAesUtils();
  }

  public home1() {
    this.utils.encrypMasterKey();
  }

  public home2() {
    this.utils.decryptMasterKey();
  }

  public drop() {

    const confirm = this.alertCtrl.create({
      title: this.utils.getMessageLanguage("Informacion"),
      message: this.utils.getMessageLanguage("Desea continuar?"),
      buttons: [
        {
          text: this.utils.getMessageLanguage("Cancelar"),
          handler: () => {

          }
        },
        {
          text: this.utils.getMessageLanguage("Aceptar"),
          handler: () => {
            this.dba.dropTable();
          }
        }
      ]
    });
    confirm.present();

  }

  public presentLoading() {

    let loading = this.loadingCtrl.create({
      content: ''
    });

    loading.present();

    setTimeout(() => {
      loading.dismiss();
    }, 6500);
  }

  public reiniciarSesion() {
    this.utils.reload();
  }

  //metodo para renovar llaves
  public callKeysDevice(typeLogin) {
    //se consultan las llaves del dispositivo para renovar
    this.dba.searchDeviceConfig().then(configDevice => {

      if (configDevice != "") {
        console.log("mensaje=> parametrizacion:" + JSON.stringify(configDevice));

        this.configDeviceDb = configDevice;
        this.http.salt = this.configDeviceDb.DATO1;
        this.http.iv = this.configDeviceDb.DATO2;
        this.http.passphrase = this.configDeviceDb.DATO3;
        this.http.idkey = this.configDeviceDb.ID;

        if (typeLogin == "huella") {

          this.loginFingerPrint();
        } else {
          this.login();
        }
      } else {
        this.utils.presentAlert("keys.recuperar");
      }
    })
  }

  public loadInbox(messageid, msgjsessionId, username) {

    var aesUtil = new AesUtil(128, 1000);
    var urlInbox = "auth/loadInbox/"
    this.data = this.utils.infoDevice();

    var deviceDATA = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, JSON.stringify(this.data));

    //Datos del dispositivo
    this.jsonDataDevice =
    {
      "userName": aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, username),
      "messageId": messageid,
      "msgjsessionId": msgjsessionId,
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
    this.http.callServer(this.jsonDataDevice, urlInbox).then(res => {

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
      try {

        // if(this.authType != "OT" && this.authType != "QR" && this.authType != "TK" && this.authType != "PN" && this.authType != "BV"){
        if (this.authType != "VB" && this.authType != "OT" && this.authType != "QR" && this.authType != "PN" && this.authType != "BV") {
          this.notaContador = false;
        }
        else {
          this.notaContador = true;
        }
        if (res.message.code == "000" && res.message.description == "Service OK") {
          if (this.authType == "OT") {
            this.navCtrl.push('HomePage');

          } else{
            this.navCtrl.push('BandejaMenuPage', { bandera :this.notaContador } );
          }
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
        if (error) {
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

}
