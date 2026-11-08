import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { EnConstruccion } from '../../compartidos/en-construccion/en-construccion';
import { ChatbotFlotante } from '../../chatbot/chatbot-flotante/chatbot-flotante';
import { OrientacionInicial } from '../orientacion/orientacion';
import { InicioService } from '../../../servicios/inicio-service';
import { Orientacion } from '../../../modelo/inicio';

@Component({
  selector: 'app-inicio',
  imports: [EnConstruccion, ChatbotFlotante, OrientacionInicial],
  templateUrl: './inicio.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './inicio.css',
})
export class Inicio implements OnInit {
  private inicioService = inject(InicioService);

  orientacion: Orientacion | null = null;

  pendientes = [
    'Selector de mes/año y estado vacío del mes (US-06, Figura 22)',
    'Tarjetas de indicadores (US-07, Figura 22)',
    'Gráficos de ingresos y gastos (US-08, Figura 22)',
    'El chatbot ya está colocado abajo (<app-chatbot-flotante>): no lo muevas, lo hace Luz',
  ];

  ngOnInit(): void {
    // US-05: el backend dice si se muestra la orientación (hasta tener un movimiento y una meta)
    this.inicioService.obtenerOrientacion().subscribe((data) => {
      this.orientacion = data;
    });
  }
}
