import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatFabButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { EnConstruccion } from '../../compartidos/en-construccion/en-construccion';

/**
 * Chatbot flotante de la pantalla de Inicio (Figura 23). Responsable: Luz.
 * Ya está colocado en inicio.html: solo trabaja dentro de esta carpeta.
 */
@Component({
  selector: 'app-chatbot-flotante',
  imports: [MatIcon, MatFabButton, TranslatePipe, EnConstruccion],
  templateUrl: './chatbot-flotante.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './chatbot-flotante.css',
})
export class ChatbotFlotante {
  abierto = signal(false);

  pendientes = [
    'Ventana con la lista de mensajes (@for sobre MensajeChat[]) y campo + botón Enviar',
    'Al enviar: agregar la pregunta, llamar a chatbotService.consultar() y agregar la respuesta',
    'Plan Free → aviso Premium en vez del chat (usar sesion.esPremium())',
    'La conversación no se guarda al cerrar',
  ];
}
