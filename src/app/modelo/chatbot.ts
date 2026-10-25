/** POST /chatbot/consultas (Premium) */
export interface ConsultaChatbotRequest {
  pregunta: string;
}

export interface ConsultaChatbotResponse {
  respuesta: string;
}

/** Solo del frontend: cada burbuja del chat */
export interface MensajeChat {
  autor: 'estudiante' | 'asistente';
  texto: string;
}
