import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CondicionesPage } from './condiciones';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    CondicionesPage,
  ],
  imports: [
    IonicPageModule.forChild(CondicionesPage),
    TranslateModule
  ],
})
export class CondicionesPageModule {}
