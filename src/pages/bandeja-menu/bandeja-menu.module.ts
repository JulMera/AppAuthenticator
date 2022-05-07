import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BandejaMenuPage } from './bandeja-menu';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    BandejaMenuPage,
  ],
  imports: [
    IonicPageModule.forChild(BandejaMenuPage),
    TranslateModule
  ],
})
export class BandejaMenuPageModule {}
