import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import {NgbCollapseModule, NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MarkdownComponent} from './markdown/markdown.component';

import {NavbarComponent} from './navbar/navbar.component';
import {LocationIconPipe} from './pipes/location-icon.pipe';
import {TokenComponent} from './token/token.component';
import {LocationLinkComponent} from './location-link/location-link.component';

@NgModule({
  declarations: [
    NavbarComponent,
    TokenComponent,
    MarkdownComponent,
    LocationLinkComponent,
    LocationIconPipe,
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
    MarkdownComponent,
    LocationLinkComponent,
    LocationIconPipe,
  ],
})
export class CoreModule {
}
