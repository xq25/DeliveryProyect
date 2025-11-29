import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Issue } from 'src/app/models/Issue';
import { IssuesService } from 'src/app/services/issues.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  issues: Issue[] = [];
  headers: string[] = [];
  actionButtons = [
    { label: 'Ver', class: 'btn btn-info btn-sm', action: 'view' },
    { label: 'Editar', class: 'btn btn-warning btn-sm', action: 'edit' },
    { label: 'Eliminar', class: 'btn btn-danger btn-sm', action: 'delete' }
  ];

  constructor(private service: IssuesService, private router: Router) { }

  ngOnInit(): void {
    this.service.list().subscribe(data => {
      this.issues = data;
      if (data.length > 0) {
        this.headers = Object.keys(data[0]);
      }
    });
  }
  view(id: number){
    this.router.navigate([`/issues/view/${id}`])
  }
  delete(id: number) {
    console.log("Delete issue with id:", id);
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
  create(){
    this.router.navigate([`/issues/create`])
  }
    
  update(id: number){
    this.router.navigate([`/issues/update/${id}`])
  }
  
  handleTableAction(event: any) {
    if (event.action === 'edit') {
      this.update(event.row.id);
    }
    else if (event.action === 'delete') {
      this.delete(event.row.id);
    }
    else if (event.action === 'view'){
      this.view(event.row.id);
    }
  }

}
