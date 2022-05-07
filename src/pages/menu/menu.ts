import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, LoadingController } from 'ionic-angular';
import { UtilsProvider } from '../../providers/utils/utils';
import { Storage } from '@ionic/storage';
import { HttpProvider } from '../../providers/http/http';
import { DbaProvider } from '../../providers/dba/dba';
import { Device } from '@ionic-native/device';
declare var AesUtil: any;

export interface PageInterface{
  title:         string;
  pageName:      string;
  tabComponent?: any;
  index?:        number;
  icon:          string;
}



@IonicPage()
@Component({
  selector:    'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  rootPage = 'TabsPage';
  
  @ViewChild(Nav) nav: Nav;

  /*pages: PageInterface[] = [
    {title: 'Web Services',        pageName: 'TabsPage',    tabComponent:'Tab1Page', index:0, icon:'ios-cloud-download-outline'},
    {title: 'Hardware - Software', pageName: 'TabsPage',    tabComponent:'Tab2Page', index:1, icon:'ios-phone-portrait-outline'},
    {title: 'Servlet',             pageName: 'SpecialPage', icon:'ios-lock-outline'},
    {title: 'Consultas',           pageName: 'ProductOverViewPage', icon:'arrow-dropright'},
  ]*/
  public inbox: any = this.utils.valorProperty("Tabs.inbox"); // "{{ 'Tabs.inbox' | translate }}"; 
  public otp: any = this.utils.valorProperty("Tabs.otp");
  public tarjeta: any = this.utils.valorProperty("Tabs.tarjeta"); 
  public qr: any = this.utils.valorProperty("Tabs.qr");
  public tk: any = this.utils.valorProperty("Tabs.tk");
  public tkQR: any = "TK-QR"
  public user: any = this.utils.valorProperty("userSecurityTitulo");
  public validateUser: any = this.utils.valorProperty("validacionPos.titulo");
  public push: any = "Push";
  
  public pregunta : boolean = false;

  pages: PageInterface[] = [
    {title: this.inbox,        pageName: 'InboxPage',        tabComponent:'Tab1Page', index:0, icon:'ios-archive-outline'},
    {title: this.otp,          pageName: 'HomePage',         tabComponent:'Tab2Page', index:1, icon:'ios-key-outline'},
    {title: this.tarjeta,      pageName: 'GcPage',           icon:'ios-keypad-outline'},
    {title: this.qr,           pageName: 'QrPage',           icon:'ios-qr-scanner-outline'},
    {title: this.tk,           pageName: 'TkPage',                 icon:'ios-repeat'},
    {title: this.tkQR,         pageName: 'TkQrPage',               icon:'ios-repeat'},
    {title: this.user,         pageName: 'UserSecurityPage',       icon:'ios-lock'},
    {title: this.validateUser, pageName: 'ValidacionPositivaPage', icon:'ios-checkbox-outline'},
    {title: "Desafiliar",      pageName: 'DesafiliarPage', icon:'ios-key-outline'}
  ]

  constructor(public navCtrl: NavController, public navParams: NavParams, public utils: UtilsProvider, 
    private storage: Storage,
    public http: HttpProvider,
    public loading: LoadingController,
    public dba: DbaProvider, 
    private device: Device) {

      this.storage.set('desafiliar', false);

  }

  ionViewDidLoad() { 
   
    // Inicia y valida el tiempo de sesion "esta configurado para 1 minuto"
    //this.utils.initTimeOut();       

  }  

  openPage(page: PageInterface){
    
    let params = {};

    if(page.index){
      params = { tabIndex: page.index };
    }

    if(this.nav.getActiveChildNav() && page.index != undefined){
       this.nav.getActiveChildNav().select(page.index); //page.index
    }
    else {
       this.nav.setRoot(page.pageName, params);
       //this.nav.setRoot(this.view, params);
    }
  }

  isActive(page: PageInterface){
      let childNan = this.nav.getActiveChildNav();

    if(childNan){
      if(childNan.getSelected() && childNan.getSelected().root === page.tabComponent){
         return 'primary';
      }
         return;
    }
    if(this.nav.getActive() && this.nav.getActive().name === page.pageName){
        return 'primary';
    }
  }


}
