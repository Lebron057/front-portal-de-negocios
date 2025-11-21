import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { CardEmpresa } from '../card-empresa/card-empresa';

@Component({
  selector: 'app-home',
  imports: [Navbar, CardEmpresa],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
