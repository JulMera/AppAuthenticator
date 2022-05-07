//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Storage } from '@ionic/storage';
import { Device } from '@ionic-native/device';
import { Platform} from 'ionic-angular';
import { BehaviorSubject} from 'rxjs/Rx';

/*
  Generated class for the DbaProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DbaProvider {

  private dba: SQLiteObject;
  ide: number;
  nombre: string;
  
  public f: Date;
  public fecha: string;
  public hora: string;
  public userName: string;
  public idRequest: string; 
  public saveGC: Array<Array<String>> = new Array<Array<String>>();
  //public deviceId: string="";
  private dataBaseStatus : BehaviorSubject<boolean>;
  public optinal_01: string;
  public queryGrilla: string;
  public queryD1: string;

  constructor(private sqlite: SQLite, private storage: Storage, private device: Device,private platform: Platform) {
    //console.log('Hello DbaProvider Provider');
    this.dataBaseStatus = new BehaviorSubject(false);
    this.platform.ready().then( ()=>{
          this.createDataBaseFile();
          this.searchIdDevice("optional"); // se realiza esta consulta para loginFinger
      }
    );
  }

  public createDataBaseFile() 
  {

    this.sqlite.create({
      name: 'authDb.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      this.dba = db;
      console.log("base de datos creada");
      this.createTables();
    })
    .catch(e => console.log("Error al crear la base de datos "+ e));
  }

  public createTables(): void{

      this.dba.executeSql("CREATE TABLE IF NOT EXISTS 'USUARIO' ( 'optional01' TEXT, 'grilla' TEXT, 'fechaHora' TEXT, 'time_01' NUMBER,'requestId' TEXT, 'dUno' TEXT)", [])
      .then(() => {
        console.log("tabla user creada");
        this.dataBaseStatus.next(true);
      })
      .catch(e => console.log("Error al crear la tabla " + e));

      this.dba.executeSql("CREATE TABLE IF NOT EXISTS 'ADMIN_DEVICE' ( 'ID' TEXT, 'DATO1' TEXT,'DATO2' TEXT, 'DATO3' TEXT)", [])
      .then(() => {
        console.log("tabla user creada ADMIN_DEVICE");
        this.dataBaseStatus.next(true);
      })
      .catch(e => console.log("Error al crear la tabla ADMIN_DEVICE" + e));

  }

  public getStatusDataBase(){
    return this.dataBaseStatus.asObservable();
  }

  public guardarBD(opcion01)
  {
    //alert("guardarBD: "+opcion01);
    this.optinal_01 = opcion01;
    
    //Obtención del userName - Ya viene encriptado
    this.storage.get('userName').then((val) => {
      if(val != null){
        this.userName = val;
      }
    });

    //Obtención de la grilla - Ya viene ordenada
    this.storage.get('saveGC').then((val) => {
      if(val != null){
        this.saveGC = val;
      }
    });

    //Obtención del requestId - viene del login
    this.storage.get('REQUESTID').then((val) => {
      if(val != null){
        this.idRequest = val;
      }
    });

    var userName: string = this.userName;
    var grilla: Array<Array<String>> = new Array<Array<String>>();
    grilla = this.saveGC;
    //var fechaHora: string;
    
    var requestId: string = this.idRequest;

    var f = new Date();
    var fecha;
    var hora;
    var fechaHora;

    var time;

    fecha = f.getDate() + "/" + (f.getMonth() + 1) + "/" + f.getFullYear();
    hora = f.getHours() + ":" + f.getMinutes() + "m" + f.getSeconds() + "s";
    fechaHora = fecha + ' - '+ hora;

    time = f.getFullYear() + (f.getMonth() + 1) + f.getDate() + f.getHours() + + f.getMinutes() + f.getSeconds();

      var stringSQL:string = "INSERT INTO 'USUARIO' (optional01, fechaHora, time_01) VALUES ('" + opcion01 + "', '" + fechaHora + "', '" + time + "')";                                      
      console.log(stringSQL);
      this.dba.executeSql(stringSQL, [])
      .then(() => {
       console.log("se inserto con exito en user");
      })
      .catch(e => console.log("Error al guardar " + JSON.stringify(e)));
  }



  //se guardan los datos que faltan despues de hacer el registro de afiliacion
  public guardarDatosActualizados(grilla)
  {
    //console.log("guardarDatosActualizados");
    //Obtención de la grilla - Ya viene ordenada
   /* this.storage.get('saveGC').then((val) => {
      if(val != null){
        this.saveGC = val;
      }
      });*/
      
        //Obtención del requestId - viene del login
             

            this.dba.executeSql("UPDATE 'USUARIO' SET grilla = '"+ grilla +"' where time_01 = (select MAX(time_01) from USUARIO)", [])
            .then(() => {
              console.log("Modifico correctamente!");
              //this.dba.executeSql('', [] )
              //.then(() => console.log(''))
              //.catch(e =>console.log("error al guardar en bd 1 "+e));
            })
            .catch(e => console.log("Error al guardar " + e));

  }
                  
/**
 * @argument
 * @author sisjfl
 * @date 01/10/2018
 * @description Query to find deviceId on table User
 */                    
  public searchIdDevice(deviceId:string):string {
    console.log("entro a consultar");
    
    
    var sql:string = 'select optional01 from USUARIO where time_01 = (select MAX(time_01) from USUARIO) ';
    var response = this.executeQuery(sql);
    
    response.then((data) => {           
      console.log("DATA "+ JSON.stringify(data));
      if(data.rows){
        if(data.rows.length > 0){
          for(var i=0; i<data.rows.length; i++){           
           deviceId = (data.rows.item(i).optional01);    
           this.optinal_01 = deviceId;  
           console.log("mensaje=>optinal_01"+this.optinal_01) ;    
          }
          
        }
      }
    })
    .catch(e => console.log("Error al consultar " + JSON.stringify(e)));

    return this.optinal_01;

  }


  async executeQuery(sql){
   return await this.dba.executeSql(sql, [] );
  }

  

  public dropTable(): string[]{
    
    var movies: string[]= [];
    this.dba.executeSql('DELETE FROM USUARIO', [] )
      .then((data) => {
        if(data == null){
          return;
        }
        
      })
      .catch(e => alert("Error al ELIMINAR " + JSON.stringify(e)));
      
      return movies;
  }


  /**
 * @argument
 * @author sisjfl
 * @date 10/10/2018
 * @description consultar grilla
 */                    
   public searchGrilla() {
    return new Promise((resolve, reject) => {
    var sql:string = 'select grilla from USUARIO where time_01 = (select MAX(time_01) from USUARIO) ';
    var response = this.executeQueryGrilla(sql);
    
    response.then((data) => {           
      
      if(data.rows){
        if(data.rows.length > 0){
          for(var i=0; i<data.rows.length; i++){           
           this.queryGrilla = (data.rows.item(i).grilla);   
           console.log("mensaje=>  searchGrilla  " + this.queryGrilla);
           resolve(this.queryGrilla);         
          }
          
        }
      }else{resolve(""); }
    })
    .catch(e => {
     
      console.log("Error al consultar " + JSON.stringify(e));
      resolve("");});
  });
    //return this.queryGrilla;
  
  }

async executeQueryGrilla(sql){
 return await this.dba.executeSql(sql, [] );
}


/*
  Apartir de aqui se crean todos los metodos nuevos del año 2019
*/

 /**
 * @argument
 * @author sisjfl
 * @date 29/01/2019
 * @description Se guarda la masterKey donde ya viene encriptada
 */ 
  public actualizarD1(text) 
  {
    //this.guardarBD("optional");
    this.dba.executeSql("UPDATE 'USUARIO' SET dUno = '"+ text +"' where time_01 = (select MAX(time_01) from USUARIO)", [])
    //var stringSQL:string = "INSERT INTO 'USUARIO' (dUno) VALUES ('" + text + "')";                                      
      //this.dba.executeSql(stringSQL, [])
    .then(() => {
      console.log("Modifico correctamente!");
    })
    .catch(e => console.log("Error al Actualizar " + JSON.stringify(e)));

  }

  /**
 * @argument
 * @author sisjfl
 * @date 29/01/2019
 * @description Se guarda la masterKey donde ya viene encriptada
 */ 
public obtenerD1(): string {
   
  var sql:string = "select dUno from USUARIO where time_01 = (select MAX(time_01) from USUARIO) ";
  var response = this.executeQueryGrilla(sql);
  
  response.then((data) => {           
    
    if(data.rows){
      if(data.rows.length > 0){
        for(var i=0; i<data.rows.length; i++){           
         this.queryD1 = (data.rows.item(i).dUno);  
         console.log("this.queryD1: "+this.queryD1);          
        }
        
      }
    }
  })
  .catch(e => console.log("Error al consultar " + JSON.stringify(e)));

  return this.queryD1;

}

public searchIdFinger() {
  return new Promise((resolve, reject) => {
    var deviceId: any;

    var sql: string = 'select optional01 from USUARIO where time_01 = (select MAX(time_01) from USUARIO) ';
    var response = this.executeQuery(sql);

    response.then((data) => {
      if (data.rows) {
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            deviceId = (data.rows.item(i).optional01);
            this.optinal_01 = deviceId; 
            console.log("mensaje=>userNameDb:"+deviceId);
                      
            resolve(deviceId);
          }
        } else { resolve(""); }
      } else { resolve(""); }
    })
      .catch(e => console.log("Error al consultar " + JSON.stringify(e)));

  });
}





 public deviceExists() {
   console.log("mensaje=> deviceExists entro");
   
  return new Promise((resolve, reject) => {
    var deviceId: any;

    var sql: string = 'select optional01 from USUARIO where time_01 = (select MAX(time_01) from USUARIO) ';
    var response = this.executeQuery(sql);

    response.then((data) => {
      if (data.rows) {
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            deviceId = (data.rows.item(i).optional01);
            this.optinal_01 = deviceId; 
            console.log("mensaje=>userNameDb:"+deviceId);
                      
            resolve(deviceId);
          }
        } else { resolve(""); }
      } else { resolve(""); }
    })
      .catch(e =>{
        console.log("Error al consultar " + JSON.stringify(e));
        
        reject(e);} );

  });
}

public searchDeviceConfig() {
  return new Promise((resolve, reject) => {


    var sql: string = 'select ID ,DATO1 ,DATO2, DATO3 from ADMIN_DEVICE ';
    var response = this.executeQuery(sql);

    response.then((data) => {
      if (data.rows) {
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            let datos = {
              'ID': (data.rows.item(i).ID),
              'DATO1': (data.rows.item(i).DATO1),
              'DATO2': (data.rows.item(i).DATO2),
              'DATO3': (data.rows.item(i).DATO3)
            };
            console.log("sql=> " + JSON.stringify(datos))
            resolve(datos);
          }
        } else { resolve(""); }
      } else { resolve(""); }
    })
      .catch(e => console.log("Error al consultar ADMIN_DEVICE" + JSON.stringify(e)));

  });
}

public deleteDeviceConfig() {


  this.dba.executeSql('DELETE FROM ADMIN_DEVICE', [])
    .then((data) => {

      console.log("Elimino correctamente ADMIN_DEVICE");
      return;


    })
    .catch(e => console.log("Error al ELIMINAR " + JSON.stringify(e)));

}
public saveDeviceConfig(ID, DATO1, DATO2, DATO3) {

  var stringSQL: string = "INSERT INTO 'ADMIN_DEVICE' (ID ,DATO1 ,DATO2, DATO3) VALUES ('" + ID + "', '" + DATO1 + "', '" + DATO2 + "', '" + DATO3 + "')";

  this.dba.executeSql(stringSQL, [])
    .then(() => {
      console.log("se inserto con exito en saveDeviceConfig");
    })
    .catch(e => console.log("Error al guardar saveDeviceConfig" + JSON.stringify(e)));

}


}