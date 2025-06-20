import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { IftaLabelModule } from 'primeng/iftalabel';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { RippleModule } from 'primeng/ripple';
import { ImageModule } from 'primeng/image';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    CommonModule,
    ButtonModule,
    IftaLabelModule,
    FormsModule,
    InputTextModule,
    DividerModule,
    PasswordModule,
    SelectModule,
    InputGroupModule,
    InputGroupAddonModule,
    RippleModule,
    ImageModule,
    DynamicDialogModule
  ],
})
export class PrimeNGModule { }
