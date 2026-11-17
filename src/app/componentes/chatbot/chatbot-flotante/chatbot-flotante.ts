import {
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatFabButton, MatIconButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { ChatbotService } from '../../../servicios/chatbot-service';
import { SesionService } from '../../../servicios/sesion-service';
import { MensajeChat } from '../../../modelo/chatbot';

@Component({
  selector: 'app-chatbot-flotante',
  imports: [MatIcon, MatButton, MatFabButton, MatIconButton, TranslatePipe],
  templateUrl: './chatbot-flotante.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './chatbot-flotante.css',
})
export class ChatbotFlotante {
  abierto = signal(false);
  mensajes = signal<MensajeChat[]>([]);
  pregunta = signal('');
  esperando = signal(false); // muestra "Escribiendo..." mientras llega la respuesta

  private lista = viewChild<ElementRef<HTMLElement>>('lista');
  sesion = inject(SesionService);
  private chatbotService = inject(ChatbotService);
  private router = inject(Router);

  alternar(): void {
    if (this.abierto()) {
      this.cerrar();
    } else {
      this.abierto.set(true);
    }
  }

  // La conversación no se guarda: al cerrar se borra
  cerrar(): void {
    this.abierto.set(false);
    this.mensajes.set([]);
    this.pregunta.set('');
    this.esperando.set(false);
  }

  enviar(): void {
    const texto = this.pregunta().trim();
    if (!texto || this.esperando()) return;

    this.agregar({ autor: 'estudiante', texto });
    this.pregunta.set('');
    this.esperando.set(true);

    this.chatbotService.consultar(texto).subscribe((data) => {
      this.esperando.set(false);
      this.agregar({ autor: 'asistente', texto: data.respuesta });
    });
  }

  irAPremium(): void {
    this.cerrar();
    this.router.navigate(['/pasar-premium']);
  }

  private agregar(mensaje: MensajeChat): void {
    this.mensajes.update((lista) => [...lista, mensaje]);
    // Baja hasta el último mensaje después de que se dibuje
    setTimeout(() => {
      const el = this.lista()?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }
}
