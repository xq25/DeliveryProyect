import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Theater } from 'src/app/models/Theaters';
import { TheatersService } from 'src/app/services/theaters.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  theaters: Theater[] = [];

  constructor(private service : TheatersService, private router: Router,) { }

  ngOnInit(): void { // Este es como el useEffect de react, esta funcion es la que se ejecuta al cargar la pagina.
    this.service.list().subscribe(data=>{ // subscribe es como un await
      this.theaters=data;
    });
  }
  delete(id: number) {
    console.log("Delete theater with id:", id);
    Swal.fire({
      title: 'Eliminar',
      text: "Está seguro que quiere eliminar el registro?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.delete(id).
          subscribe(data => {
            Swal.fire(
              'Eliminado!',
              'Registro eliminado correctamente.',
              'success'
            )
            this.ngOnInit();
          });
      }
    })
  }
  update(){
    this.router.navigate(['/'])
  }
  

}
