import { Component } from '@angular/core';
import { LoadingController, IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UtilsProvider } from '../../providers/utils/utils';
import { DbaProvider } from '../../providers/dba/dba';
import { HttpProvider } from '../../providers/http/http';
import { MenuController } from 'ionic-angular';
import { Push, PushObject, PushOptions } from '@ionic-native/push/';

declare var AesUtil: any;
/**
 * Generated class for the GcPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-gc',
  templateUrl: 'gc.html',
})
export class GcPage {

  jsonData2: any;
  jsonFiltro: any;
  // testGrilla :Array<Array<String>> = new Array<Array<String>>();
  public jsonDataDevice: any;
  public message: any;
  public userName: string;
  private urlInbox: string = "auth/getDataGC/";
  public grilla: Array<Array<String>> = new Array<Array<String>>();
  public queryGrillaBD: any;
  public messageId: string;
  public msgjsessionId: string;
  public isBtnEnabled: boolean = false;
  public loadingPage: any;
  public data: any;
  public jsonDataDevice2: any;
  public encripData: string;

  constructor(/*private device: Device,*/public loading: LoadingController, public navCtrl: NavController, public navParams: NavParams, private storage: Storage, public utils: UtilsProvider, public http: HttpProvider,
    public dba: DbaProvider, public menuCtrl: MenuController, private alertCtrl: AlertController, public push: Push,
    public platform: Platform) {

    //metodo solo de prueba
    //var grid = "694ACGHJKLOV123456A611A353K341T391U191Y626X745G167S769L141H829N314L541M857N186Y451P713W571Q881W166Q796N576T721P236Q396Y284U971Y918Y671H812S214H591I925Y197E311R556I287Y111P993V113P949C323S193V368N598V289A115A988R791T191D581Q911Q831E135";
    //this.grilla = this.getGrilla(grid);

    // Metodo que escucha el llamado de las notificaciones push
    platform.ready().then(() => {
      this.notificacionPush()
    });

    //Metodo para cuando se le de back al celular cierre la app y lo envie al login
    this.utils.outApp("LoginPage");

    //Obtención del userName - Ya viene encriptado
    this.storage.get('userName').then((val) => {
      if (val != null) {
        this.userName = val;
      }
    });

    //Obtención del messageId - PROVIENE DEL LOGIN
    /*this.storage.get('MESSAGEID').then((val) => {
     if(val != null){
       this.messageId = val;
     }
   });
 
   this.storage.get('msgjsessionId').then((val) => {
     if (val != null) {
       this.msgjsessionId = val;
     }
   });*/

    /*this.dba.getStatusDataBase().subscribe(rdy =>{
      this.dba.searchGrilla();
    })*/

    platform.registerBackButtonAction(() => {
      this.navCtrl.push("BandejaMenuPage");
    });

  }

  ionViewDidLoad() {

    //Obtención del userName - Ya viene encriptado
    this.storage.get('userName').then((val) => {
      //alert("userName: "+val);
      if(val != null){
        
        var aesUtil = new AesUtil(128,1000);
        // Se encripta el usuario con el nuevo encript que paso hernan 2019
        this.userName = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, val);
        this.dba.searchGrilla().then(idFinger => {
        this.queryGrillaBD = idFinger;
      
          console.log("mensaje=>" + this.queryGrillaBD)
       
        if(this.queryGrillaBD == null || this.queryGrillaBD == undefined || this.queryGrillaBD == ""){
          //alert("entro 1");
          //this.getDataGC();//Call to services auth, organizar string a un arreglo y asignacion a this.grilla
           
            this.storage.get('MESSAGEID').then((val) => {

              if (val != null) {
                this.messageId = val;
         
                this.storage.get('msgjsessionId').then((val) => {
                  if (val != null) {
                    this.msgjsessionId = val;
                  }  
                         
                  this.getDataGC();
                });
        
              }
            });



        }else{
         
          //Organizar cadena para pintar
          this.grilla = this.getGrilla(this.queryGrillaBD);  
          //alert("grilla: "+this.queryGrillaBD);
        }
      })


       
      }
    });
    
  }

  //metodo para Tarjeta de Coordenadas obtener grilla
  public getDataGC(): Array<Array<String>> {
    this.loadingPage = this.loading.create({});
    this.loadingPage.present();
    // this.dba.createDataBaseFile();

    this.storage.get('userName').then((val) => {
      if (val != null) {
        //this.userName = val;
        var aesUtil = new AesUtil(128, 1000);
        // Se encripta el usuario con el nuevo encript que paso hernan 2019
        this.userName = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, val);


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

        /* var newModel: string = this.utils.changePuntoComa(this.device.model);
 
         var data = '{"iddev":"' + this.device.uuid + '",' +
                     '"model":"' + newModel + '",' +
                     '"cordova":"' + this.device.cordova + '",' +
                     '"plataform":"' + this.device.platform + '",' +
                     '"version":"' + this.device.version + '",' +
                     '"manufacturer":"' + this.device.manufacturer + '",' +
                     '"serial":"' + this.device.serial + '",' +
                     '"isVirtual":"' + this.device.isVirtual + '"}';
         
         var deviceDATA = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, data);*/

        var data = this.utils.infoDevice();
        var deviceDATA = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, JSON.stringify(data));


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
          "reasonCalled": "auth_getGC",
          "scoreRiskCustomer": "0",
          "geoRefLatitude": latitud,
          "geoRefLongitude": longitud,
          "deviceTrustId": aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase,this.utils.deviceId ),
          "deviceTrustData": deviceDATA,
          "idkey": this.http.idkey
        }

        console.log("mensaje=>Envio auth/getDataGC/: " + JSON.stringify(this.jsonDataDevice));
        this.http.callServer(this.jsonDataDevice, this.urlInbox).then(res => {
          this.loadingPage.dismiss();
          this.message = JSON.stringify(res);
          console.log("mensaje=>Resultado auth/getDataGC/: " + this.message);

          if (res.messageId != null || res.messageId != "") {
            this.storage.set('MESSAGEID', res.messageId);
            this.storage.set('msgjsessionId', res.msgjsessionId);
          }

          //alert("datos GC: "+this.message);
          this.storage.set('gc_Grilla', res.authData);
          this.grilla = this.getGrilla(res.authData);
          this.storage.set('saveGC', this.grilla);
          this.storage.set('MESSAGEID', res.messageId);
          this.storage.set('msgjsessionId', res.msgjsessionId);
          this.dba.guardarDatosActualizados(res.authData);

          try {
            this.utils.errorControl(res.message.code);
          }
          catch (error) {
            this.utils.presentAlert("mensajeErrorControlado" + error);
          }

        },
          error => {
            this.loadingPage.dismiss();
            if (error) {
              this.utils.presentAlert("mensajePeticion" + error);
              this.storage.clear();
              this.utils.clearVariableSesion();
              this.navCtrl.setRoot("LoginPage");
            }
          })
      }
    });
    return this.grilla;

  }


  private getGrilla(gridCardData) {

    var strHeigth: string = gridCardData.charAt(0);
    var strWidth: string = gridCardData.charAt(1);
    var strCharQua: string = gridCardData.charAt(2);
    var gridCardData = gridCardData.substring(3);
    var strTitleCols = gridCardData.substring(0, strWidth);
    //alert(strTitleCols)
    var gridCardData = gridCardData.substring(strWidth);

    var strTitleRows = gridCardData.substring(0, strHeigth);
    //alert(strTitleRows);
    var gridCardData = gridCardData.substring(strHeigth);

    var grid_card_rows: number = parseInt(strHeigth);
    var grid_card_cols: number = parseInt(strWidth);
    var charQuant: number = parseInt(strCharQua);


    var listaRows: Array<Array<String>> = new Array<Array<String>>();



    try {
      var paramTitleCol: Array<string> = new Array<string>();
      paramTitleCol.push(" ");
      //Agregando  los parametros para el manejo de encabezados del dataGrid
      for (var i = 0; i < grid_card_cols; i++) {

        paramTitleCol.push(strTitleCols.charAt(i));
      }
      listaRows.push(paramTitleCol);

      //Recorrer sacar y otener los valores de la grilla agregarlos a un list dentro del objeto GridCard
      //Crar una lista de gridCard
      for (var j = 0; j < grid_card_rows; j++) {

        var rowName: string = strTitleRows.charAt(j);
        var rowData: Array<String> = new Array<String>();
        rowData.push(rowName);//Posicion 0 nombre o titulo de la fila
        for (var k = 0; k < grid_card_cols; k++) {
          var coord: string = gridCardData.substring(0, charQuant);
          gridCardData = gridCardData.substring(charQuant);
          rowData.push(coord);
        }

        listaRows.push(rowData);

      }
    } catch (err) {
      console.log(err);
    }

    return listaRows;
  }

  logout() {
    this.utils.presentConfirm("LoginPage");
  }

  public menu() {
    this.menuCtrl.toggle();
  }

  //Metodo para generar una nueva tarjeta de coordenadas
  public generateNewGc() {

    this.isBtnEnabled = true; // Se bloquea el boton para no generar de nuevo una GC
    //this.getDataGC();

    this.storage.get('MESSAGEID').then((val) => {

      if (val != null) {
        this.messageId = val;

        this.storage.get('msgjsessionId').then((val) => {
          if (val != null) {
            this.msgjsessionId = val;
          }
          this.getDataGC();
        });

      }
    });

    //var data = "663CDEHPX123456U61G89T46B21Y16P53W32S82H84X58N53L88G33A68K71I54X78D84U36M28G72D47X22N53S25B61P86P58I51Y33K97Q91Q65A45L81Y71";
    //this.grilla = this.getGrilla(data);
  }


  // Metodo para salir de la app
  public logoutApp() {

    //Obtención del messageId - PROVIENE DEL LOGIN
    this.storage.get('nameUser').then((val) => {
      if (val != null) {
        //alert("logout 2");
        var aesUtil = new AesUtil(128, 1000);

        /*  this.data = '{"iddev":"' + this.device.uuid + '",' +
            '"model":"' + this.device.model + '",' +
            '"cordova":"' + this.device.cordova + '",' +
            '"plataform":"' + this.device.platform + '",' +
            '"version":"' + this.device.version + '",' +
            '"manufacturer":"' + this.device.manufacturer + '",' +
            '"serial":"' + this.device.serial + '",' +
            '"isVirtual":"' + this.device.isVirtual + '"}';
              this.encripData = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.data);
               var iddevEnc: string = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.device.uuid);
            
            */
        this.data = this.utils.infoDevice();
        this.encripData = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, JSON.stringify(this.data));
        var iddevEnc: string = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase,this.utils.deviceId );

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
          }
        }
    

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
