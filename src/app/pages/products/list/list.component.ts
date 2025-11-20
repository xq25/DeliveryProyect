import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/Product';
import { ProductsService } from 'src/app/services/products.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  products: Product[] = [];
  headers: string[] = [];
  actionButtons = [
    { label: 'Ver', class: 'btn btn-info btn-sm', action: 'view' },
    { label: 'Editar', class: 'btn btn-warning btn-sm', action: 'edit' },
    { label: 'Eliminar', class: 'btn btn-danger btn-sm', action: 'delete' }
  ];


  constructor(private service: ProductsService, private router: Router) { }

  ngOnInit(): void {
    this.service.list().subscribe(data => {
      this.products = data;
      if (data.length > 0) {
        this.headers = Object.keys(data[0]);
      }
    });
  }
  view(id: number){
    this.router.navigate([`/products/view/${id}`])
  }
  delete(id: number) {
      console.log("Delete product with id:", id);
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
    this.router.navigate([`/products/create`])
  }
  
  update(id: number){
    this.router.navigate([`/products/update/${id}`])
  }

  handleTableAction(event: any) {
    if (event.action === 'edit') {
      this.update(event.row.id);
    }
    else if (event.action === 'delete') {
      this.delete(event.row.id);
    }
  }

}
