import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { IftaLabelModule } from 'primeng/iftalabel';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';

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
    SelectModule
  ],
})
export class PrimeNGModule { }
