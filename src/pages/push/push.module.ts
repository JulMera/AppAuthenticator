import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PushPage } from './push';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    PushPage,
  ],
  imports: [
    IonicPageModule.forChild(PushPage),
    TranslateModule
  ],
})
export class PushPageModule {}
