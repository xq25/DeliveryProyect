import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';

import { SecurityService } from 'src/app/services/security.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {  //onDestroy para limpiar recursos, llama un metodo justo despues de cerrar o salir de la pagina
  user: User
  constructor(private securityService: SecurityService,private router:Router) { // Inyeccion de dependencias
    this.user = { email: "", password: "" } // Inicializamos las cajas de texto en blanco. (Similar al initialize values de Formik)
  }
  login() {
    console.log("Login con ", JSON.stringify(this.user));
    this.securityService.login(this.user).subscribe({ // Lamamos al backend.
      next: (data) => { // Si todo sale bien el backend nos devuelve el {"id": 1,"name": "Felipe Gómez","email": "felipe.gomez@example.com","password": "SecurePass123!","token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" // opcional}
        this.securityService.saveSession(data) // Guardamos la session
        this.router.navigate(["dashboard"])
      },
      error: (error) => {
        console.log("Error en el login ", JSON.stringify(error));
        Swal.fire("Autenticación Inválida", "Usuario o contraseña inválido", "error")
      }
    })
  }

  ngOnInit() {
  }
  ngOnDestroy() {
  }

}
