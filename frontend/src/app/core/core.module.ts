import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import {NgbCollapseModule, NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {NavbarComponent} from './navbar/navbar.component';
import {TokenComponent} from './token/token.component';

@NgModule({
  declarations: [
    NavbarComponent,
    TokenComponent,
  ],
  imports: [
    CommonModule,
    NgbCollapseModule,
    RouterModule,
    FormsModule,
    NgbTooltipModule,
    ReactiveFormsModule,
  ],
  exports: [
    RouterModule,
    NavbarComponent,
    TokenComponent,
  ],
})
export class CoreModule {
}
