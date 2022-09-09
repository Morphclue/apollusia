import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.scss'],
})
export class TokenComponent implements OnInit {
  input: string = '';
  visible: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.input).then().catch(e => console.log(e));
  }

  toggleVisibility() {
    this.visible = !this.visible;
  }
}
