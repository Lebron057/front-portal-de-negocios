import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { CardEmpresa } from './components/card-empresa/card-empresa';
import { RegisterDetalhesEmpresa } from './components/register-detalhes-empresa/register-detalhes-empresa';



import { Register } from './components/register/register';  
import { Login } from './components/login/login'; 
import { VerDetalhes } from './components/ver-detalhes/ver-detalhes';
import { Usuario } from './components/usuario/usuario';
import { Comerciante } from './components/comerciante/comerciante';


export const routes: Routes = [
    
    {
        path: "", component: Home
    },
    {
        path: "card", component: CardEmpresa
    },
    {
        path: "login", component: Login
    },
    {
        path: 'register', component: Register
    },
    {
        path: 'register-detalhes-empresa', component: RegisterDetalhesEmpresa
    },
    {
        path: 'detalhe/:id', component: VerDetalhes
    },
     {
        path: 'usuario', component: Usuario
    },
    {
        path: 'comerciante', component: Comerciante
    }
];
