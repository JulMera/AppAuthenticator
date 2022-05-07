import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TkPage } from './tk';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    TkPage,
  ],
  imports: [
    IonicPageModule.forChild(TkPage),
    TranslateModule
  ],
})
export class TkPageModule {}
