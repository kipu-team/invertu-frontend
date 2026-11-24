import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConsultaChatbotRequest, ConsultaChatbotResponse } from '../modelo/chatbot';
import { environment } from '../../environments/environment';

/**
 * Chatbot (backend: POST /api/v1/chatbot/consultas, solo Premium). T-115: usa la API real.
 * El token lo agrega el interceptor. Errores: 403 si no es Premium, 400 si la pregunta está vacía,
 * 503 si la IA no responde.
 */
@Service()
export class ChatbotService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/chatbot`;

  consultar(pregunta: string): Observable<ConsultaChatbotResponse> {
    const datos: ConsultaChatbotRequest = { pregunta };
    return this.http.post<ConsultaChatbotResponse>(`${this.url}/consultas`, datos);
  }
}
