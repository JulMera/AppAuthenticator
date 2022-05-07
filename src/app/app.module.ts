import { BrowserModule} from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { IonicStorageModule } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { UtilsProvider } from '../providers/utils/utils';
import { HttpProvider } from '../providers/http/http';
import { HttpModule} from '@angular/http';

import { FormsModule } from "@angular/forms";
import { CommandsProvider } from '../providers/commands/commands';

import { NgCalendarModule  } from 'ionic2-calendar';

import { Device } from '@ionic-native/device';
import { NetworkInterface } from '@ionic-native/network-interface';
import { Geolocation } from '@ionic-native/geolocation';
import { Network } from '@ionic-native/network';
import { HTTP } from '@ionic-native/http';
import { SQLite } from '@ionic-native/sqlite';
import { TasksServiceProvider } from '../providers/tasks-service/tasks-service';

import { NgxQRCodeModule } from 'ngx-qrcode2';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { DbaProvider } from '../providers/dba/dba';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { TouchID } from '@ionic-native/touch-id';

// Nuevo 2019
import { AES256 } from '@ionic-native/aes-256';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { Keyboard } from '@ionic-native/keyboard';

import { Push, PushObject, PushOptions } from '@ionic-native/push';


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    NgCalendarModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    NgIdleKeepaliveModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp),
    NgxQRCodeModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    SplashScreen,
    SQLite,
    StatusBar,
    Keyboard,
    HttpProvider, 
    {provide: ErrorHandler, useClass: IonicErrorHandler,},
    HttpProvider,
    UtilsProvider,
    CommandsProvider,
    Device,
    NetworkInterface,
    Geolocation,
    Network,
    HTTP,
    TasksServiceProvider,
    BarcodeScanner,
    DbaProvider,
    FingerprintAIO,
    TouchID,
    AES256, // Nuevo 2019
    Push
  ]
})
export class AppModule {}