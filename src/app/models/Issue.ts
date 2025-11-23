export class Issue{ // Esta clase representa los posibles fallos que puede llegar a tener una motocicleta
    id?: number;
    description: string; // Descripcion del fallo.
    issue_type: string; // Tipo de fallo.
    date_reported: string; // Fecha de reporte del daño.
    status: string; // Continua el fallo?
    motorcycle_id: number; // Moticleta que presenta dicho fallo o percance.
}