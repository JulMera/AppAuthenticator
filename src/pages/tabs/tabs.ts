import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the TabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  //tab1Root = 'ProductOverViewPage';
  tab1Root = ''; //InboxPage //HomePage
  tab2Root = 'HomePage'; // TransferPage
  tab3Root = 'GcPage'; // RutaPagosPage 
  tab4Root = 'QrPage';
  tab5Root = 'TkPage';
  tab6Root = 'TkQrPage';
  tab7Root = 'UserSecurityPage';
  tab8Root = 'ValidacionPositivaPage';
  tab9Root = 'DesafiliarPage';

  
  index: number;
  n : string = "";
  prueba: string;
  idioms: any[] = [];
  x : any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private translateService: TranslateService) {
    //this.index = navParams.data.tabIndex || 0;
    //alert("Vista "+this.navParams.get("view"))
    this.index = this.navParams.get("view");
    this.n = this.navParams.get("nuevo");

    this.getData();
    this.idioms = [
      {
        value: 'es_co',
        label: 'Español',
      },
      {
        value: 'en_us',
        label: 'Ingles'
      }
    ];
  }

  getData(){
    var tmp: string;
    this.storage.get('name').then((val) => {
      console.log('esta en otra pantalla ', val);     
     this.prueba = val;
    }); 
  }

  lenguague(){
    this.x = this.storage.get('lenguaje').then((val) => {
       console.log('Esta en root', val);
     });
     this.translateService.use(this.x);
   }

   /**
    * this method was created for remove all elements in sessionStore,
    * can clean and no show garbage.
    */
   public changeTab()   {
    /*
        this.storage.remove('accountSelectedTopay');  
          
      //Variable de sesion cuentas propias de las tarjetas de creditos
        this.storage.remove('cuentasPropias');
        
      //Variable de sesion valor minimo y/o total y/o digitado de la tarjeta seleccionada
        this.storage.remove('valorSeleccionado'); 

      //variable de sesion cuenta selecciondad de pay bills
        this.storage.remove('cuentaPayBill'); 

      //variable de sesion bandera
        this.storage.remove('bandera'); 

      //cuenta seleccionada en transferAccount
        this.storage.remove('cuentaTransferSelected');

        this.storage.remove('selectedAccount'); */
    }

    public changePaysTab()
    {
    
      /*  this.storage.remove('accountSelectedTopay'); 

      //Variable de sesion cuentas propias de las tarjetas de creditos
        this.storage.remove('cuentasPropias');
        
      //Variable de sesion valor minimo y/o total y/o digitado de la tarjeta seleccionada
        this.storage.remove('valorSeleccionado'); 

      //variable de sesion cuenta selecciondad de pay bills
        this.storage.remove('cuentaPayBill'); 

      //variable de sesion bandera
        this.storage.remove('bandera'); 

      //información de la cuentas seleccionadas en bills to pay y product to debit
        this.storage.remove('infoCuenta');
        this.storage.remove('infoCuenta2');

      //cuenta seleccionada en transferAccount
        this.storage.remove('cuentaTransferSelected');

        this.storage.remove('selectedAccount'); 
        
        this.navCtrl.push('RutaPagosPage');*/
  }

  public changeTabTransfer(){
    //this.navCtrl.push('TransferPage');
  }

  changeTabinbox(){
    this.navCtrl.push("InboxPage");
  }

 

}
