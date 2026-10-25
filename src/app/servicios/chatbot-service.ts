import { Service } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ConsultaChatbotResponse } from '../modelo/chatbot';
import { RESPUESTAS_CHATBOT } from './datos-prueba/datos-prueba';

/** Chatbot (backend: POST /api/v1/chatbot/consultas, solo Premium). Por ahora con respuestas de prueba. */
@Service()
export class ChatbotService {
  private turno = 0;

  consultar(pregunta: string): Observable<ConsultaChatbotResponse> {
    const respuesta = RESPUESTAS_CHATBOT[this.turno % RESPUESTAS_CHATBOT.length];
    this.turno++;
    return of({ respuesta });
  }
}
