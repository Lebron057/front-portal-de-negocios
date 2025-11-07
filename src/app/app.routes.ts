import { Routes } from '@angular/router';


import { RegisterCliente } from './components/register-cliente/register-cliente';
import { RegisterEmpresa } from './components/register-empresa/register-empresa';   

export const routes: Routes = [
   
    {
        path: 'register_cliente', component: RegisterCliente
    },
    {
        path: 'register_empresa', component: RegisterEmpresa
    }
];
