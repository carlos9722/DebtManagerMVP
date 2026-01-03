import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FrontNavbarComponent } from '../../components/front-navbar/front-navbar.component';

@Component({
  selector: 'app-debt-front-layout',
  imports: [RouterOutlet, FrontNavbarComponent],
  templateUrl: './debt-front-layout.component.html',
})
export class DebtFrontLayoutComponent { }
