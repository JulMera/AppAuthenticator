import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController, AlertController, Platform } from 'ionic-angular';
import { HttpProvider } from '../../providers/http/http';
import { DbaProvider } from '../../providers/dba/dba';
import { UtilsProvider } from '../../providers/utils/utils';
import { Storage } from '@ionic/storage';
declare var AesUtil: any;

/**
 * Generated class for the DesafiliarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-desafiliar',
  templateUrl: 'desafiliar.html',
})
export class DesafiliarPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,  public menuCtrl: MenuController,
    public loading: LoadingController,
    private storage: Storage,
    public http: HttpProvider,
    public dba: DbaProvider, 
    private alertCtrl: AlertController,
    public utils: UtilsProvider,
    public platform: Platform) {

    //Metodo para cuando se le de back al celular cierre la app y lo envie al login
    this.utils.outApp("LoginPage");
    platform.registerBackButtonAction(() => {
      this.navCtrl.push("BandejaMenuPage");
    });
      
  }

  ionViewWillEnter(){
    
    //this.presentConfirm();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DesafiliarPage');
    
  }

  public menu(){
    this.menuCtrl.toggle();
  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: this.utils.getMessageLanguage("logout.message"),
      message: this.utils.getMessageLanguage("DesafiliarMensaje"),
      buttons: [
        {
          text: this.utils.getMessageLanguage("confirm.btnAceptar"),
          handler: data => {
            if (this.utils.getMessageLanguage("confirm.btnAceptar")) 
            {
              //this.utils.presentLoading();
              this.desafiliarUsuario();
                    
            }
          }
        },
        {
          text: this.utils.getMessageLanguage("confirm.btnCancelar"),
          handler: data => {
            if (this.utils.getMessageLanguage("confirm.btnCancelar")) 
            {
              
              console.log("Salida Cancelada");
              this.navCtrl.push("BandejaMenuPage");
            }
          }
        }
      ]
    });
    alert.present();
  }

  
  presentLoadingDefault() {
    let loading = this.loading.create({
      content: ''
    });

    loading.present();

    setTimeout(() => {
      loading.dismiss();
    }, 3000);
  }

  //Desafiliación de usuario
  public desafiliarUsuario(){
    this.dba.searchIdFinger().then(idFinger => {

   //var userIdentificator  = this.dba.searchIdDevice("optional");
   var userIdentificator  =idFinger;


    //alert("entro");
    var latitud; 
    var longitud;

    // Obtencion de la longitud y la latitud de la persona
    this.storage.get('latitud').then((lat) => {
      this.storage.get('longitud').then((lon) => {
        if(lat != null && lon != null){
          latitud = lat;
          longitud = lon;
        }
      });
    });
    
    this.presentLoadingDefault();
    var aesUtil = new AesUtil(128,1000);
    
    
    this.storage.get('MESSAGEID').then((val) => {

      this.storage.get('msgjsessionId').then((val) => {
        if (val != null) {
          var msgjsessionId = val;


          if (val != null) {

            var messageId = val;
            var urlOtp = "product/disenrollUser/";

           /* var newModel: string = this.utils.changePuntoComa(this.device.model);

            var data = '{"iddev":"' + this.device.uuid + '",' +
              '"model":"' + newModel + '",' +
              '"cordova":"' + this.device.cordova + '",' +
              '"plataform":"' + this.device.platform + '",' +
              '"version":"' + this.device.version + '",' +
              '"manufacturer":"' + this.device.manufacturer + '",' +
              '"serial":"' + this.device.serial + '",' +
              '"isVirtual":"' + this.device.isVirtual + '"}';*/

              var data =  this.utils.infoDevice();

            var deviceDATA = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, JSON.stringify(data));
            //Datos del dispositivo
            var jsonDataDevice =
            {
              "company": aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, "1"),
              "channel": "INT",
              "internalUserName": "",
              "externalUserName": "",
              "messageId": messageId,
              "msgjsessionId": msgjsessionId,
              "identificator": userIdentificator,
              "device": {
                "data": deviceDATA
              },
              "authType": "AUTH",
              "reasonCalled": "auth_desaUsu",
              "scoreRiskCustomer": "0",
              "geoRefLatitude": latitud,
              "geoRefLongitude": longitud,
              "deviceTrustId": aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.utils.deviceId),
              "deviceTrustData": deviceDATA,
              "idkey": this.http.idkey
            }

            this.http.callServer(jsonDataDevice, urlOtp).then(res => {

              //var message = JSON.stringify(res);
              //alert("Desafiliar: "+message); 

              try {

                if (res.message.code == "0000" && res.message.description) {
                  this.utils.presentAlert("mensajeDesafiliar");
                  this.dba.dropTable(); // Eliminar Registro
                  this.navCtrl.push("LoginPage", { povDesafiliar: "1" });

                }
                else {
                  this.utils.errorControl(res.message.code);
                }

              }
              catch (error) {
               // this.utils.presentAlert("Se presento el siguiente error: " + error);
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
        }
      });
    });




  })



  }// fin metodo

  public devolverse() {
    this.navCtrl.push("BandejaMenuPage");
  }

  public aceptar() {
    this.presentConfirm();
  }

  public cancelar() {
    this.navCtrl.push("BandejaMenuPage");
  }
  public reiniciarSesion() {
    this.utils.reload();  
  }
  
}
