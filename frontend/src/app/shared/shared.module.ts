import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import {NgbCollapseModule} from "@ng-bootstrap/ng-bootstrap";

import {NavbarComponent} from './navbar/navbar.component';

@NgModule({
  declarations: [
    NavbarComponent,
  ],
  imports: [
    CommonModule,
    NgbCollapseModule,
    RouterModule,
  ],
  exports: [
    RouterModule,
    NavbarComponent,
  ],
})
export class SharedModule {
}
