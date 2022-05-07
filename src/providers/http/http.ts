import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, RequestMethod, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import * as CryptoJS from 'crypto-js';

//import { UtilsProvider } from '../../providers/utils/utils';

/*
  Generated class for the HttpProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HttpProvider {
  public prueba: any;
  datos: any;
  //path : string = 'https://randomuser.me/api/?results=25';  
  //ip : string ='http://192.168.10.236:8080/';     //hernan SMART
  //ip : string ='https://192.168.10.236:8181/';     //hernan SMART   ********************    
  //ip : string ='https://190.144.107.213:8181/';    // URL Expuesta
  //ip : string ='https://192.168.10.31:8181/';    // URL paso mary luz

  //ip : string ='https://181.49.197.20:8181/';     //Hector CERTIFICACION PUBLICA 

  //ip : string ='https://3.18.228.75/';     // URL EXPUESTA   ********************    

  //ip : string ='https://192.168.1.51:8181/';     //Hector CERTIFICACION PUBLICA      

  //ip : string ='http://hosthernandavid.bounceme.net:8090/';                  

  //ip : string =    'https://192.168.10.149:8181/'; // may Smart
  //ip: string = 'http://10.10.1.31:8080/' ///****** ESTA ES LA QUE ESTA */
  //urlDevice: string = 'http://10.10.1.136:8090/app_auth/';
  //ip : string =  'https://app.entitid.com/';  // nuevo ambiente posgrest


  //ip : string ='https://192.168.10.12:8181/';     //Hector CERTIFICACION 


  //---------------------------------------------------------------------------
  //ip : string =  'https://app.entitid.com/';  // nuevo ambiente posgrest
  //ip : string ='https://181.49.197.20:8181/';    // CertificaciÃƒÂ³n  
  //ip: string = 'https://192.168.10.254:8181/'; // Giovanni Smart
  //ip: string = 'https://867c-181-49-197-18.ngrok.io/'; // Giovanni Smart
  //ip : string = 'http://3.18.228.75:8080/'; //BdV
  ip : string = 'http://3.139.2.115:8000/'; //Pruebas Diego

  //----------------------------------------------------------------------------

  //ip : string = 'https://demohb.inttegrio-aws.com/'; //AMBIENTE AWS ALLIANCE

  /*
      AMBIENTE CERTIFICACION
      https://192.168.10.98:8181/HOMEBANKING/initAppn1.start()
      
      Usuario = hprimos
      Clave   = zxcvbnm+4
  */


  urlDevice: string = this.ip + 'app_auth/';
  //urlDevice: string = this.ip+'';




  // E1F // HOMEBANKING
  //   http://10.10.1.30:8080/E1F/ServletController?CMD=APPLOGIN&CH=APP&LNG=en_us&E2EW=null%20%BALogin%20%BA%20%BAE2NCNR01%20%BAnull%20%BA%BA%20&PAR=1%20%BA%20%BAHGONZALEZ%20%BAzxcvbnm4@

  //'APPLOGIN&CH=APP&LNG=en_us&E2EW=null'+separator+'Login'+separator+separator+'E2NCNR01'+separator+'null'+separator+separator+'PAR='+company+separator+separator+user+separator+passw;

  public iv: string = "";
  public salt: string = "";
  public passphrase: string = "";
  public idkey: string = "";


  public ivDefault: string = "";
  public saltDefault: string = "";
  public passphraseDefault: string = "";
  public idkeyDefault: string = "";

  constructor(public http: Http /*, public utils: UtilsProvider*/) {

  }



  public callServer(json, urlData) {
    var headers = new Headers();
    //headers.append('Access-Control-Allow-Origin', '*');
    //headers.append('Access-Control-Allow-Origin-Methods', 'POST, GET, OPTIONS, PUT',);
    headers.append('Accept', 'application/json');
    //headers.append('apiKey', 'jsfonseca');
    headers.append('Content-type', 'application/json');
    //headers.append('IV', this.iv);
    //headers.append('SALT', this.salt);

    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify(json);

    return this.http
      .post(this.urlDevice + urlData, body, options)
      .map(res => res.json(),
        err => {
          console.log(err);
        }
      )
      .toPromise();
  }


  public callServerValidateE2E(json, urlData) {
    var headers = new Headers();
    //headers.append('Access-Control-Allow-Origin', '*');
    //headers.append('Access-Control-Allow-Origin-Methods', 'POST, GET, OPTIONS, PUT',);
    headers.append('Accept', 'application/json');
    //headers.append('apiKey', 'jsfonseca');
    headers.append('Content-type', 'application/json');
    headers.append('iv', this.iv);
    headers.append('salt', this.salt);

    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify(json);

    return this.http
      .post(this.urlDevice + urlData, body, options)
      .map(res => res.json(),
        err => {
          console.log(err);
        }
      )
      .toPromise();
  }

  public callServerP() {
    console.log("mensaje=> CallServerKEY");
    console.log("mensaje=>entro");

    // this.utils.reload();
    var headers = new Headers();

    headers.append('Accept', 'application/json');
    headers.append('Content-type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify({ "typekey": "D" });
    return this.http
      .post(this.urlDevice + 'device/deviceSetup/', body, options).timeout(300000)
      .map(res => res.json(),
        err => {
          alert("Error en el llamado \n" + JSON.stringify(err));
        }
      )
      .toPromise();
  }


}