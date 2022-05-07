import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Alert, LoadingController, AlertController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UtilsProvider } from '../../providers/utils/utils';
import { HttpProvider } from '../../providers/http/http';
import { MenuController } from 'ionic-angular';
import { DbaProvider } from '../../providers/dba/dba';
import { Push, PushObject, PushOptions } from '@ionic-native/push/';

declare var AesUtil: any;

/**
 * Generated class for the ValidacionPositivaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-validacion-positiva',
  templateUrl: 'validacion-positiva.html',
})
export class ValidacionPositivaPage {

  public jsonDataDevice: any;
  public userName: string;
  res = null;
  resp = null;
  public requestId: string;
  public messageId: string;
  public msgjsessionId: string;
  public message: any;

  preguntas: any;
  public jsonData: any;

  public typeQ: string;
  public textQ: string;
  public posQ: number;
  public totalQ: number;

  public answerQuestion: string;

  public typem: string;



  public relationship: string;
  public relationshipp: string;
  public respuestas = [];
  public cantQ: number = 0;
  public vectorPreguntas: any;

  // Variables para las opciones de seleccion multiple
  public option1: any = false;
  public option2: any = false;
  public option3: any = false;
  public option4: any;
  public option5: any;
  public option1_id: any;
  public option2_id: any;
  public option3_id: any;
  public option4_id: any;
  public option5_id: any;
  public option1_texto: any;
  public option2_texto: any;
  public option3_texto: any;
  public option4_texto: any;
  public option5_texto: any;
  public consultaDeviceId: any;
  public qCycle: number;
  public qQuantity: number;
  public imgResStatus: boolean = false;
  public imgResStatus2: boolean = false;
  public icono: string;
  public errorAdicional: boolean = false;

  public data: any;
  public jsonDataDevice2: any;
  public encripData: string;

  public btnPreguntas: boolean = false;
  public latitud: any;
  public longitud: any;
  public mostrarValidacion: boolean = false;

  public mostrarDevolver: boolean = true;


  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, public utils: UtilsProvider, private alertCtrl: AlertController,
    public http: HttpProvider, public menuCtrl: MenuController, public dba: DbaProvider, public loadingCtrl: LoadingController, public push: Push,
    public platform: Platform) {

    /*   se descomenta para hacer pruebas directas con la pantalla y se 
         comenta el codigo que esta abajo en el constructor
    
       this.mostrarValidacion = false;
 
       let  res={
         "message": {
             "code": "0000",
             "description": "STATUS OK"
         },
         "messageId": "MS5KUkVTVFJFUE8uOThmZDdlZDQ5OWRmNmQxZi4yMDIxMDIxNiAxNTIyMDYuMTcwZTYxdjg2czExZmhyMm1tdTA=",
         "msgjsessionId": "c75d98fa335b125b2c36f239196e",
         "keyMessage": "key1234",
         "authType": "QR",
         "requestId": "25",
         "reasonCalled": "auth_loadPreg",
         "scoreRiskCustomer": "0",
         "deviceTrustId": "98fd7ed499df6d1f",
         "deviceTrustData": "{\"iddev\":\"98fd7ed499df6d1f\",\"model\":\"Moto G (5)\",\"cordova\":\"7.1.4\",\"plataform\":\"Android\",\"version\":\"8.1.0\",\"manufacturer\":\"motorola\",\"serial\":\"ZY322VW2LT\",\"isVirtual\":\"false\"}",
         "questionCycle":0,
         "questionQuantity": 6,
         "questions": [
             {
                 "id": "27",
                 "method": "M",
                 "type": "B",
                 "text": "Last number of Credit Card Visa",
                 "category": "0",
                 "option01_id": "1",
                 "option02_id": "2",
                 "option03_id": "3",
                 "option01_text": "*** *** **** 5115",
                 "option02_text": "*** *** **** 7698",
                 "option03_text": "*** *** **** 2944"
             },
             {
                 "id": "6",
                 "method": "M",
                 "type": "B",
                 "text": "birth month",
                 "category": "0",
                 "option01_id": "1",
                 "option02_id": "2",
                 "option03_id": "3",
                 "option01_text": "Abril",
                 "option02_text": "Enero",
                 "option03_text": "Mayo"
             },
             {
                 "id": "30",
                 "method": "M",
                 "type": "B",
                 "text": "Number movil phone",
                 "category": "0",
                 "option01_id": "1",
                 "option02_id": "2",
                 "option03_id": "3",
                 "option01_text": "3023727088",
                 "option02_text": "3113727088",
                 "option03_text": "3193727088"
             },
             {
                 "id": "80",
                 "method": "A",
                 "type": "P",
                 "text": "Mother name"
             },
             {
                 "id": "1",
                 "method": "A",
                 "type": "C",
                 "text": "a"
             },
             {
                 "id": "2",
                 "method": "A",
                 "type": "C",
                 "text": "b"
             }
         ]
       };
       
           this.btnPreguntas = true;
           this.cantQ = res.questionQuantity; // Obtiene la cantidad de preguntas para hacer
           console.log("mensaje=>preguntas: "+JSON.stringify(res));
           this.utils.errorControl(res.message.code);
         
           this.message = JSON.stringify(res);
  
           this.storage.set('MESSAGEID', res.messageId);
           this.storage.set('msgjsessionId', res.msgjsessionId);
           this.storage.set('REQUESTID', res.requestId);
           
           if (res.messageId != null || res.messageId != "") {
             this.storage.set('MESSAGEID', res.messageId);
             this.storage.set('msgjsessionId', res.msgjsessionId);
             this.messageId = res.messageId;
           }
   
       
           this.qCycle = res.questionCycle;
           this.qQuantity = res.questionQuantity;
       
           this.preguntas = res.questions;
           //alert("TOTAL PREGUNTAS: "+JSON.stringify(this.preguntas));
           this.vectorPreguntas = res.questions;
           this.posQ = 0;
           var row = this.preguntas[this.posQ];
           //alert("row: "+ JSON.stringify(row));
           this.typeQ = row.method;
           //alert("type: "+this.typeQ);
           this.textQ = row.text;
           //alert("text: "+this.textQ);
           this.totalQ = 1;
       
           this.preguntasMultiples(this.typeQ, row);
 */


    this.mostrarDevolver = true;

    // Metodo que escucha el llamado de las notificaciones push
    platform.ready().then(() => {
      this.notificacionPush();
      this.mostrarDevolver = true;
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

    //Obtención del userName - Ya viene encriptado
    this.storage.get('userName').then((val) => {
      if (val != null) {
        //this.userName = val;

        var aesUtil = new AesUtil(128, 1000);
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
      if (val != null) {
        this.messageId = val;
      }
    });

    this.storage.get('msgjsessionId').then((val) => {
      if (val != null) {
        this.msgjsessionId = val;
      }
    });



    this.dba.searchIdFinger().then(idFinger => {
      this.consultaDeviceId = idFinger;
      this.presentLoading();
      this.carguePreguntas();

    })
    // this.consultaDeviceId = this.searchIdDevice(); 

    platform.registerBackButtonAction(() => {
      this.navCtrl.push("InboxPage");
    });

  }

  ionViewDidLoad() {

    // Inicia y valida el tiempo de sesion "esta configurado para 1 minuto"
    //this.utils.initTimeOut("si");



    //this.presentLoading();
    // this.carguePreguntas();





    // *************************
    // se cargan este tipo de preguntas solo para pruebas, borrar
    /*this.typeQ = "M";
    this.textQ = "ingrese la edad";
    this.totalQ = 3;
    this.cantQ = 4;
    this.option1_texto = "Noviembre";
    this.option2_texto = "Marzo";
    this.option3_texto = "Mayo";
    this.resp = "Respuesta OK";*/
  }

  public presentLoading() {

    let loading = this.loadingCtrl.create({
      content: ''
    });

    loading.present();

    setTimeout(() => {
      loading.dismiss();
    }, 4000);
  }

  public carguePreguntas() {

    this.mostrarValidacion = false;
    /*
    let  res={
      "message": {
          "code": "0000",
          "description": "STATUS OK"
      },
      "messageId": "MS5KUkVTVFJFUE8uOThmZDdlZDQ5OWRmNmQxZi4yMDIxMDIxNiAxNTIyMDYuMTcwZTYxdjg2czExZmhyMm1tdTA=",
      "msgjsessionId": "c75d98fa335b125b2c36f239196e",
      "keyMessage": "key1234",
      "authType": "QR",
      "requestId": "25",
      "reasonCalled": "auth_loadPreg",
      "scoreRiskCustomer": "0",
      "deviceTrustId": "98fd7ed499df6d1f",
      "deviceTrustData": "{\"iddev\":\"98fd7ed499df6d1f\",\"model\":\"Moto G (5)\",\"cordova\":\"7.1.4\",\"plataform\":\"Android\",\"version\":\"8.1.0\",\"manufacturer\":\"motorola\",\"serial\":\"ZY322VW2LT\",\"isVirtual\":\"false\"}",
      "questionCycle":0,
      "questionQuantity": 6,
      "questions": [
          {
              "id": "27",
              "method": "M",
              "type": "B",
              "text": "Last number of Credit Card Visa",
              "category": "0",
              "option01_id": "1",
              "option02_id": "2",
              "option03_id": "3",
              "option01_text": "**** **** **** 5115",
              "option02_text": "**** **** **** 7698",
              "option03_text": "**** **** **** 2944"
          },
          {
              "id": "6",
              "method": "M",
              "type": "B",
              "text": "birth month",
              "category": "0",
              "option01_id": "1",
              "option02_id": "2",
              "option03_id": "3",
              "option01_text": "Abril",
              "option02_text": "Enero",
              "option03_text": "Mayo"
          },
          {
              "id": "30",
              "method": "S",
              "type": "B",
              "text": "Number movil phone",
              "category": "0",
              "option01_id": "1",
              "option02_id": "2",
              "option03_id": "3",
              "option01_text": "3023727088",
              "option02_text": "3113727088",
              "option03_text": "3193727088"
          },
          {
              "id": "80",
              "method": "A",
              "type": "P",
              "text": "Mother name"
          },
          {
              "id": "1",
              "method": "A",
              "type": "C",
              "text": "a"
          },
          {
              "id": "2",
              "method": "A",
              "type": "C",
              "text": "b"
          }
      ]
    };
    
    
    
        this.btnPreguntas = true;
        this.cantQ = res.questionQuantity; // Obtiene la cantidad de preguntas para hacer
    
        //alert("Cantidad de preguntas ciclo: "+this.cantQ);
    
         console.log("mensaje=>preguntas: "+JSON.stringify(res));
        this.utils.errorControl(res.message.code);
        //alert(res.message.code); 
        this.message = JSON.stringify(res);
        //alert("MESSAGEID nuevo: "+res.messageId);
        //alert("this.message: "+this.message); 
        this.storage.set('MESSAGEID', res.messageId);
        this.storage.set('msgjsessionId', res.msgjsessionId);
        this.storage.set('REQUESTID', res.requestId);
        //alert("res.requestId: "+res.requestId);
        if (res.messageId != null || res.messageId != "") {
          this.storage.set('MESSAGEID', res.messageId);
          this.storage.set('msgjsessionId', res.msgjsessionId);
          this.messageId = res.messageId;
        }
        //alert("respuesta para preguntas de seguridad: \n " + JSON.stringify(this.message));
        //alert("Preguntas2: "+res.questionQuantity+" <--> "+res.questionCycle);
        //alert("total: "+ JSON.stringify(res.questionQuantity));
        //alert("Preguntas: "+ JSON.stringify(res));
    
        this.qCycle = res.questionCycle;
        this.qQuantity = res.questionQuantity;
    
        this.preguntas = res.questions;
        //alert("TOTAL PREGUNTAS: "+JSON.stringify(this.preguntas));
        this.vectorPreguntas = res.questions;
        this.posQ = 0;
        var row = this.preguntas[this.posQ];
        //alert("row: "+ JSON.stringify(row));
        this.typeQ = row.method;
        //alert("type: "+this.typeQ);
        this.textQ = row.text;
        //alert("text: "+this.textQ);
        this.totalQ = 1;
    
        this.preguntasMultiples(this.typeQ, row);
    */








    this.storage.get('MESSAGEID').then((val) => {
      if (val != null) {
        this.messageId = val;

        this.storage.get('msgjsessionId').then((val) => {
          if (val != null) {
            this.msgjsessionId = val;

            this.storage.get('REQUESTID').then((val) => {
              if (val != null) {
                this.requestId = val;


                var aesUtil = new AesUtil(128, 1000);

                var urlOtp = "auth/callReqQuestion/";

                /*var newModel: string = this.utils.changePuntoComa(this.device.model);

                this.data = '{"iddev":"' + this.device.uuid + '",' +
                  '"model":"' + newModel + '",' +
                  '"cordova":"' + this.device.cordova + '",' +
                  '"plataform":"' + this.device.platform + '",' +
                  '"version":"' + this.device.version + '",' +
                  '"manufacturer":"' + this.device.manufacturer + '",' +
                  '"serial":"' + this.device.serial + '",' +
                  '"isVirtual":"' + this.device.isVirtual + '"}';*/

                this.data = this.utils.infoDevice();
                this.encripData = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, JSON.stringify(this.data));

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
                  "reasonCalled": "auth_loadPreg",
                  "scoreRiskCustomer": "0",
                  "geoRefLatitude": this.latitud,
                  "geoRefLongitude": this.longitud,
                  "deviceTrustId": aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.utils.deviceId ),
                  "deviceTrustData": this.encripData,
                  "idkey": this.http.idkey
                }
                console.log("mensaje=>Envio auth/callReqQuestion/: " + JSON.stringify(this.jsonDataDevice));

                this.http.callServer(this.jsonDataDevice, urlOtp).then(res => {

                  this.btnPreguntas = true;
                  this.cantQ = res.questionQuantity; // Obtiene la cantidad de preguntas para hacer

                  this.message = JSON.stringify(res);
                  console.log("mensaje=>Resultado auth/callReqQuestion/: " + this.message);
                  this.storage.set('MESSAGEID', res.messageId);
                  this.storage.set('msgjsessionId', res.msgjsessionId);
                  this.storage.set('REQUESTID', res.requestId);
                  this.utils.errorControl(res.message.code);
                  
                  if (res.messageId != null || res.messageId != "") {
                    this.storage.set('MESSAGEID', res.messageId);
                    this.storage.set('msgjsessionId', res.msgjsessionId);
                    this.messageId = res.messageId;
                  }
                  //alert("respuesta para preguntas de seguridad: \n " + JSON.stringify(this.message));
                  //alert("Preguntas2: "+res.questionQuantity+" <--> "+res.questionCycle);
                  //alert("total: "+ JSON.stringify(res.questionQuantity));
                  //alert("Preguntas: "+ JSON.stringify(res));

                  this.qCycle = res.questionCycle;
                  this.qQuantity = res.questionQuantity;

                  this.preguntas = res.questions;
                  //alert("TOTAL PREGUNTAS: "+JSON.stringify(this.preguntas));
                  this.vectorPreguntas = res.questions;
                  this.posQ = 0;
                  var row = this.preguntas[this.posQ];
                  //alert("row: "+ JSON.stringify(row));
                  this.typeQ = row.method;
                  //alert("type: "+this.typeQ);
                  this.textQ = row.text;
                  //alert("text: "+this.textQ);
                  this.totalQ = 1;

                  this.preguntasMultiples(this.typeQ, row);

                },
                  error => {
                    this.btnPreguntas = false;
                    if (error) {
                      this.utils.presentAlert("mensajePeticion" + error);
                      this.storage.clear();
                      this.utils.clearVariableSesion();
                      this.navCtrl.setRoot("LoginPage");
                    }
                  })

              }
            });
          }
        });

      }
    });

  }

  // Metodo que valida que las preguntas tengan su respuesta cada una
  public next(type) {

    if (type == null || type == undefined) {
      this.utils.presentAlert('validacionPos');
    }
    else {
      this.nextPage();
    }
  }

  // Metod que devuelve de pregunta
  public back() {

    this.posQ = this.posQ - 1;
    this.totalQ = (this.totalQ - 1);
    var row = this.preguntas[this.posQ];
    var pag = this.posQ;
    this.typeQ = row.method;
    //alert("BACK this.typeQ: "+this.typeQ);
    this.textQ = row.text;
    //alert("BACK textQ: "+this.textQ);
    this.posQ = pag;

    this.preguntasMultiples(this.typeQ, row);

  }

  // Metodo que direcciona a la siguiente pregunta
  public nextPage() {
    //alert("next");
    this.saveQuestions(this.typeQ, this.posQ);
    //alert("llego: "+JSON.stringify(this.preguntas));
    this.posQ++;
    var row = this.preguntas[this.posQ];
    //alert("next: "+JSON.stringify(row));
    var pag: number = this.posQ;
    this.typeQ = row.method;
    //alert("NEXT this.typeQ: "+this.typeQ);
    this.textQ = row.text;
    //alert("NEXT textQ: "+this.textQ);
    this.totalQ = this.posQ + 1;

    //alert("3\ntotalQ: "+this.totalQ+"\ncantQ: "+this.cantQ);
    this.preguntasMultiples(this.typeQ, row);

  }

  // Metodo para guardar preguntas
  public saveQuestions(tipoQ, pos) {
    //alert("saveQuestions");
    //alert("Va a guardar: "+tipoQ+" en la posicion: "+pos);
    switch (tipoQ) {
      case 'C':
        this.respuestas[pos] = this.answerQuestion;

        this.vectorPreguntas[pos].answer = this.answerQuestion.trim().toUpperCase();
        //alert("Pregunta que llega "+ JSON.stringify(this.vectorPreguntas[pos]));
        //alert("c: "+this.vectorPreguntas[pos].answer);
        //alert("Respuesta a enviar: "+JSON.stringify(this.vectorPreguntas[pos]));
        this.answerQuestion = "";
        break;
      case 'A':
        this.respuestas[pos] = this.answerQuestion;

        this.vectorPreguntas[pos].answer = this.answerQuestion.trim().toUpperCase();
        //alert("Pregunta que llega "+ JSON.stringify(this.vectorPreguntas[pos]));
        //alert("a: "+this.vectorPreguntas[pos].answer);
        //alert("Respuesta a enviar: "+JSON.stringify(this.vectorPreguntas[pos]));
        this.answerQuestion = "";
        break;
      case 'N':
        this.respuestas[pos] = this.answerQuestion;

        this.vectorPreguntas[pos].answer = this.answerQuestion.trim().toUpperCase();
        //alert("Pregunta que llega "+ JSON.stringify(this.vectorPreguntas[pos]));
        //alert("n: "+this.vectorPreguntas[pos].answer);
        //alert("Respuesta a enviar: "+JSON.stringify(this.vectorPreguntas[pos]));
        this.answerQuestion = "";
        break;
      case 'S':
        console.log("resp S: " + this.answerQuestion);
        this.respuestas[pos] = this.answerQuestion;
        this.vectorPreguntas[pos].answer = this.answerQuestion
        //alert("Pregunta que llega "+ JSON.stringify(this.vectorPreguntas[pos]));
        //alert("s: "+ this.vectorPreguntas[pos].answer);
        //alert("Respuesta a enviar: "+JSON.stringify(this.vectorPreguntas[pos]));
        this.answerQuestion = null;
        break;
      case 'M':
        //alert("Tipo M Pregunta que llega "+ JSON.stringify(this.vectorPreguntas[pos]));
        var res = this.seleccionPreguntas();
        //alert("lo que selecciono en la pregunta tipo M: "+res);
        this.respuestas[pos] = res;
        this.vectorPreguntas[pos].answer = res
        //alert("m: "+(this.vectorPreguntas[pos].answer =  res));
        //alert("Respuesta a enviar: "+JSON.stringify(this.vectorPreguntas[pos]));
        break;
      case 'R':
        //alert("Tipo R Pregunta que llega "+ JSON.stringify(this.vectorPreguntas[pos]));
        var res = this.seleccionPreguntas();
        //alert("lo que selecciono en la pregunta tipo R: "+res);
        this.respuestas[pos] = res;
        this.vectorPreguntas[pos].answer = res
        //alert("r: "+(this.vectorPreguntas[pos].answer =  res));
        //alert("Respuesta a enviar: "+JSON.stringify(this.vectorPreguntas[pos]));
        break;
      default:
        this.btnPreguntas = false;
        this.utils.presentAlert("validacionPos.pre");
        break;
    }

  }

  public mostrarDatos() {
    this.presentLoading();
    this.saveQuestions(this.typeQ, this.posQ);
    //alert("PREGUNTAS QUE SE VAN A ENVIAR: \n"+JSON.stringify(this.vectorPreguntas));
    this.validarRespuestas(this.vectorPreguntas)
    /*for (let i = 0; i < this.respuestas.length; i++) {
      const element = this.respuestas[i];
      alert("Dato "+i+ ": "+element);
      
    }*/
  }

  // Se obtiene las opciones de la pregunta de tipo "Multiple"
  public preguntasMultiples(tipoM, row) {
    //alert("multiple")
    if (tipoM == 'M' || tipoM == 'R') {
      this.option1_id = row.option01_id;
      this.option2_id = row.option02_id;
      this.option3_id = row.option03_id;
      this.option4_id = row.option04_id;
      this.option5_id = row.option05_id;

      this.option1_texto = row.option01_text;
      this.option2_texto = row.option02_text;
      this.option3_texto = row.option03_text;
      this.option4_texto = row.option04_text;
      this.option5_texto = row.option05_text;
    }

  }

  // Metodo para validar las respuestas que se escoge de seleccion multiple 
  public seleccionPreguntas(): string {
    var uno: any, dos: any, tres: any;
    var multiple: string;

    //alert("1: "+this.option1+" - "+(this.option1 == true)+"\n2: "+this.option2+" - "+(this.option2 == true)+"\n3: "+this.option3+" - "+(this.option3 == true));

    if (this.option1 == true) {
      uno = this.option1_id;
      //alert("uno: "+uno);
      multiple = uno;
      this.option1 = null;
      //alert("multiple1: "+multiple);
    } else

      if (this.option2 == true) {
        dos = this.option2_id;
        //alert("dos: "+dos);
        multiple = dos;
        this.option2 = null;
        //alert("multiple2: "+multiple);
      } else

        if (this.option3 == true) {
          tres = this.option3_id;
          //alert("tres: "+tres);
          multiple = tres;
          this.option3 = null;
          //alert("multiple3: "+multiple);
        }

    //alert("multiple: "+multiple);
    return multiple;

  }

  /*  Metodo para validar las respuestas de las preguntas
      y dependiendo de las respuestas se valida si se procede
      a iniciar un nuevo ciclo de preguntas
  */
  public validarRespuestas(envioPreguntas) {

    console.log("mensaje=>envioPreguntas:" + JSON.stringify(envioPreguntas));



    this.storage.get('MESSAGEID').then((val) => {
      if (val != null) {
        this.messageId = val;

        this.storage.get('msgjsessionId').then((val) => {
          if (val != null) {
            this.msgjsessionId = val;


            this.storage.get('REQUESTID').then((val) => {
              if (val != null) {
                this.requestId = val;

                //alert("envia requestId: "+this.requestId);   
                //this.consultaDeviceId = this.searchIdDevice();
                //alert("this.consultaDeviceId: "+this.consultaDeviceId);
                //alert("this.requestId: "+this.requestId);

                var aesUtil = new AesUtil(128, 1000);
                var envioDeviceID = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.consultaDeviceId);

                var urlOtp = "auth/callValQuestion/";

               /* var newModel: string = this.utils.changePuntoComa(this.device.model);

                this.data = '{"iddev":"' + this.device.uuid + '",' +
                  '"model":"' + newModel + '",' +
                  '"cordova":"' + this.device.cordova + '",' +
                  '"plataform":"' + this.device.platform + '",' +
                  '"version":"' + this.device.version + '",' +
                  '"manufacturer":"' + this.device.manufacturer + '",' +
                  '"serial":"' + this.device.serial + '",' +
                  '"isVirtual":"' + this.device.isVirtual + '"}';*/

                  this.data = this.utils.infoDevice();
                this.encripData = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, JSON.stringify(this.data));

                //Datos del dispositivo
                this.jsonDataDevice =
                {
                  "userName": this.userName,
                  "authType": "QR",
                  "data": this.res,
                  "requestId": this.requestId,
                  "questionCycle": this.qCycle,
                  "questionQuantity": this.qQuantity,
                  "messageId": this.messageId,
                  "msgjsessionId": this.msgjsessionId,
                  "keyMessage": "key1234",
                  "questions": envioPreguntas,
                  "device": {
                    "iddev": aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.utils.deviceId )
                  },
                  "optional01": envioDeviceID,
                  "reasonCalled": "auth_validaPre",
                  "scoreRiskCustomer": "0",
                  "geoRefLatitude": this.latitud,
                  "geoRefLongitude": this.longitud,
                  "deviceTrustId": aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.utils.deviceId ),
                  "deviceTrustData": this.encripData,
                  "idkey": this.http.idkey
                }
                console.log("mensaje=>Envio auth/callValQuestion/: " + JSON.stringify(this.jsonDataDevice));

                this.http.callServer(this.jsonDataDevice, urlOtp).then(res => {

                  //alert("Respuesta validacion preguntas: \n"+JSON.stringify(res)); 

                  this.btnPreguntas = true;
                  this.cantQ = res.questionQuantity; // Obtiene la cantidad de preguntas para hacer

                  this.mostrarValidacion = true; // Muestra la pantalla de validacion si es positiva o negativa
                  this.message = JSON.stringify(res);
                  console.log("mensaje=>Resultado auth/callValQuestion/: " + this.message);
                  this.storage.set('MESSAGEID', res.messageId);
                  this.storage.set('msgjsessionId', res.msgjsessionId);
                  this.storage.set('REQUESTID', res.requestId);

                  if (res.messageId != null || res.messageId != "") {
                    this.storage.set('MESSAGEID', res.messageId);
                    this.storage.set('msgjsessionId', res.msgjsessionId);
                    this.messageId = res.messageId;
                  }

                  //alert("1 questionQuantity? \n" + "1 res.questionQuantity: " + res.questionQuantity);
                  //alert("1 res.message.code: " + res.message.code + "\n1 res.message.description: " + res.message.description);

                  if (res.message.code == "0000" || res.message.description == "STATUS OK") {
                    //alert("2 questionQuantity?");
                    //alert("2 res.questionQuantity: " + res.questionQuantity);
                    if (res.questionQuantity != 0) {
                      //alert("Entro");

                      this.utils.presentAlert('validacionPos.resValidate');
                      this.mostrarValidacion = false;
                      this.qCycle = 0;
                      this.qQuantity = 0;
                      this.preguntas = "";
                      this.vectorPreguntas = "";
                      this.option1 = null;
                      this.option2 = null;
                      this.option3 = null;
                      this.totalQ = 0;
                      this.cantQ = 0;

                      this.qCycle = res.questionCycle;
                      this.qQuantity = res.questionQuantity;
                      this.cantQ = res.questionQuantity; // Obtiene la cantidad de preguntas para hacer

                      this.preguntas = res.questions;
                      this.vectorPreguntas = res.questions;
                      // alert("preguntas nuevas: "+this.preguntas);

                      this.posQ = 0;
                      var row = this.preguntas[this.posQ];
                      // alert("row nueva: "+ JSON.stringify(row));
                      this.typeQ = row.method;
                      // alert("type nueva: "+JSON.stringify(this.typeQ));
                      this.textQ = row.text;
                      // alert("text nueva: "+this.textQ);
                      this.totalQ = 1;
                      //alert("7\ntotalQ: " + this.totalQ + "\ncantQ: " + this.cantQ);
                      this.preguntasMultiples(this.typeQ, row);
                    }
                    else if (res.questionQuantity == 0) {
                      this.mostrarValidacion = true;
                      this.typeQ = null;
                      this.resp = this.utils.getMessageLanguage("validacionPos.aceptada");
                      document.getElementById("contenedorBtn").style.display = "none";
                      this.imgResStatus = true;
                      this.icono = "../../assets/img/verde.jpg";
                      //this.utils.presentAlert('validacionPos.aceptada');  

                    }

                  }
                  else if (res.message.code == "406") {
                    //this.utils.alertServidor(res.message.description);
                    this.mostrarValidacion = true;
                    this.typeQ = null;
                    document.getElementById("contenedorBtn").style.display = "none";
                    //this.imgResStatus = true;
                    this.imgResStatus2 = true;
                    this.errorAdicional = true;
                    this.icono = "../../assets/img/rojo.jpg";
                    this.resp = this.utils.getMessageLanguage("validacionPos.rechazado");
                  }
                  else if (res.message.code == "900") {
                    this.mostrarValidacion = true;
                    this.utils.alertServidor(res.message.description);
                  }
                  else if (res.message.code == "017") {
                    this.mostrarValidacion = true;
                    this.utils.alertServidor(res.message.description);
                  }
                  else {
                    this.mostrarValidacion = true;
                    //alert("Entro al error controlado");
                    this.utils.errorControl(res.message.code);
                  }

                },
                  error => {
                    //alert("error");
                    this.mostrarValidacion = true;
                    if (error) {
                      this.utils.presentAlert("mensajePeticion" + error);
                      /*this.utils.presentAlert("mensaje.error");
                      this.storage.clear();
                      this.utils.clearVariableSesion();
                      this.navCtrl.setRoot("LoginPage");*/
                    }
                  })

              }
            });
          }
        });
      }
    });

  }


  private logout() {
    this.utils.presentConfirm("LoginPage");
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
            //alert("Consulta bd: "+this.consultaDeviceId );            
          }

        }
      }
    })
      .catch(e => console.log("Error al consultar " + JSON.stringify(e)));

    return this.consultaDeviceId;
  }

  // Metodo para salir de la app
  public logoutApp() {

    //Obtención del messageId - PROVIENE DEL LOGIN
    this.storage.get('nameUser').then((val) => {
      if (val != null) {
        //alert("logout 2");
        var aesUtil = new AesUtil(128, 1000);

       /* var newModel: string = this.utils.changePuntoComa(this.device.model);
        this.data = '{"iddev":"' + this.device.uuid + '",' +
          '"model":"' + newModel + '",' +
          '"cordova":"' + this.device.cordova + '",' +
          '"plataform":"' + this.device.platform + '",' +
          '"version":"' + this.device.version + '",' +
          '"manufacturer":"' + this.device.manufacturer + '",' +
          '"serial":"' + this.device.serial + '",' +
          '"isVirtual":"' + this.device.isVirtual + '"}';*/

          this.data = this.utils.infoDevice();
        this.encripData = aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, JSON.stringify(this.data));

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
          "reasonCalled": "auth_logout",
          "scoreRiskCustomer": "0",
          "geoRefLatitude": this.latitud,
          "geoRefLongitude": this.longitud,
          "deviceTrustId": aesUtil.encrypt(this.http.salt, this.http.iv, this.http.passphrase, this.utils.deviceId ),
          "deviceTrustData": this.encripData,
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
