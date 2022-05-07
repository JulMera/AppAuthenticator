import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GcPage } from './gc';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    GcPage,
  ],
  imports: [
    IonicPageModule.forChild(GcPage),
    TranslateModule
  ],
})
export class GcPageModule {}
