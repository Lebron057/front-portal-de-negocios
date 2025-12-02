import { Component, Input } from '@angular/core';
import { RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})

export class Navbar {
  @Input() actionLabel = 'Entrar';
  @Input() actionLink: string | any[] = '/login';
  @Input() usuarioNome = '';
}
