import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from 'src/app/models/Order';
import { OrdersService } from 'src/app/services/orders.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  constructor(private router: Router, private service: OrdersService) { }

  orders: Order[] = [];
  headers: string[] = []
  actionButtons = [
    { label: 'Ver', class: 'btn btn-info btn-sm', action: 'view' },
    { label: 'Editar', class: 'btn btn-warning btn-sm', action: 'edit' },
    { label: 'Eliminar', class: 'btn btn-danger btn-sm', action: 'delete' },
    { label: 'Visualizar Envio', class: 'btn btn-primary btn-sm', action: 'tracking' }

  ];

  ngOnInit(): void {
    const excluded = ['menu', 'motorcycle', 'customer'];
    this.service.list().subscribe(data => {
      this.orders = data;
      if (data.length > 0) {
        this.headers = Object.keys(data[0]).filter(key => !excluded.includes(key)).sort((a, b) => {
          const aIsId = a.toLowerCase().includes('id') ? 0 : 1;
          const bIsId = b.toLowerCase().includes('id') ? 0 : 1;
          return aIsId - bIsId;
        });
      }
    });
  }
  view(id: number){
    this.router.navigate([`/orders/view/${id}`])
  }
  delete(id: number) {
    console.log("Delete order with id:", id);
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
    this.router.navigate([`/orders/create`])
  }
  
  update(id: number){
    this.router.navigate([`/orders/update/${id}`])
  }
  trackingDelivery(){
    this.router.navigate(['../']) //Direccion de la pagina de visualizacion del mapa.
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
    else if (event.action === 'tracking'){
      // Agregar la pagina de mapa con la moto en movimiento
      this.trackingDelivery()
    }
  }

}
