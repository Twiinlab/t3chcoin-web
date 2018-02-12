import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CustomMaterialModule } from './custom-material/custom-material.module';
import { T3chcoinService } from 'app/core/t3chcoin/t3chcoin.service';

@NgModule({
  providers: [
    T3chcoinService
  ],
  exports: [
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    CustomMaterialModule,
  ]
})
export class CoreModule { }
