import { Component, ChangeDetectionStrategy } from '@angular/core';
import { EnConstruccion } from '../../compartidos/en-construccion/en-construccion';
import { ChatbotFlotante } from '../../chatbot/chatbot-flotante/chatbot-flotante';

@Component({
  selector: 'app-inicio',
  imports: [EnConstruccion, ChatbotFlotante],
  templateUrl: './inicio.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './inicio.css',
})
export class Inicio {
  pendientes = [
    'Si orientacion.mostrarOrientacion → tarjetas de primeros pasos (Figura 21)',
    'Selector de mes/año, tarjetas de indicadores y gráficos (Figura 22)',
    'El chatbot ya está colocado abajo (<app-chatbot-flotante>): no lo muevas, lo hace Luz',
  ];
}
