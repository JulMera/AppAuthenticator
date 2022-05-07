import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite';


/*
  Generated class for the TasksServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TasksServiceProvider {

  db: SQLiteObject = null;

  constructor(public http: Http) { 
     this.db = new SQLiteObject("");
  }

  

  setDatabase(db: SQLiteObject){
    if(this.db === null){
      this.db = db;
    }
  }

  createTable(){
    let sql = 'CREATE TABLE IF NOT EXISTS AFILIACION(id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT, pass TEXT)';
    return this.db.executeSql(sql, []);
  }

  getAll(){
    let sql = 'SELECT * FROM AFILIACION';
    return this.db.executeSql(sql, [])
    .then(response => {
      let tasks = [];
      for (let index = 0; index < response.rows.length; index++) {
        tasks.push( response.rows.item(index) );
      }
      return Promise.resolve( tasks );
    })
    .catch(error => Promise.reject(error));
  }

  create(task: any){
    let sql = 'INSERT INTO AFILIACION(user, pass) VALUES(?,?)';
    return this.db.executeSql(sql, [task.user, task.pass]);
  }

}
