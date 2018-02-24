import { Component, OnInit } from '@angular/core';
import { T3chcoinService } from '../core/t3chcoin/t3chcoin.service';

const PROFILE_PLACEHOLDER_IMAGE_URL = '/assets/images/profile_placeholder.png';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  openLink(urlLink) {
    window.open(urlLink, '_blank');
  }
}
