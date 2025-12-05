import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { GeminiService } from 'src/app/services/gemini.service';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatContainer') private chatContainer: ElementRef;

  messages: Message[] = [];
  userInput: string = '';
  isLoading: boolean = false;
  isSpeaking: boolean = false;
  voiceEnabled: boolean = true;

  // Preguntas frecuentes
  quickQuestions = [
    '¿Para qué sirve este sistema?',
    '¿Dónde puedo registrar un nuevo conductor?',
    '¿En qué parte puedo realizar un pedido?',
    '¿Cómo gestiono las motocicletas?',
    '¿Cómo veo los reportes?'
  ];

  // Web Speech API
  private synth: SpeechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null;

  constructor(private geminiService: GeminiService) {
    this.synth = window.speechSynthesis;
  }

  ngOnInit(): void {
    // Mensaje de bienvenida
    const welcomeMessage = '¡Hola! Soy tu asistente virtual del sistema de delivery. ¿En qué puedo ayudarte hoy?';
    this.messages.push({
      text: welcomeMessage,
      isUser: false,
      timestamp: new Date()
    });

    // Hablar mensaje de bienvenida
    if (this.voiceEnabled) {
      this.speak(welcomeMessage);
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  sendMessage() {
    if (!this.userInput.trim() || this.isLoading) return;

    // Detener cualquier voz en reproducción
    this.stopSpeaking();

    // Agregar mensaje del usuario
    this.messages.push({
      text: this.userInput,
      isUser: true,
      timestamp: new Date()
    });

    const question = this.userInput;
    this.userInput = '';
    this.isLoading = true;

    // Obtener respuesta del bot
    this.geminiService.sendMessage(question).subscribe({
      next: (response) => {
        this.messages.push({
          text: response,
          isUser: false,
          timestamp: new Date()
        });
        this.isLoading = false;

        // Hablar la respuesta
        if (this.voiceEnabled) {
          this.speak(response);
        }
      },
      error: (err) => {
        console.error('Error al obtener respuesta:', err);
        const errorMsg = 'Lo siento, hubo un error al procesar tu pregunta. Por favor, intenta de nuevo.';
        this.messages.push({
          text: errorMsg,
          isUser: false,
          timestamp: new Date()
        });
        this.isLoading = false;

        if (this.voiceEnabled) {
          this.speak(errorMsg);
        }
      }
    });
  }

  sendQuickQuestion(question: string) {
    this.userInput = question;
    this.sendMessage();
  }

  // Función para hablar usando Web Speech API
  speak(text: string) {
    if (!this.synth) return;

    // Cancelar cualquier voz anterior
    this.synth.cancel();

    this.utterance = new SpeechSynthesisUtterance(text);
    
    // Configurar voz en español
    const voices = this.synth.getVoices();
    const spanishVoice = voices.find(voice => voice.lang.includes('es')) || voices[0];
    
    if (spanishVoice) {
      this.utterance.voice = spanishVoice;
    }

    this.utterance.lang = 'es-ES';
    this.utterance.rate = 1.0; // Velocidad normal
    this.utterance.pitch = 1.0; // Tono normal
    this.utterance.volume = 1.0; // Volumen máximo

    this.utterance.onstart = () => {
      this.isSpeaking = true;
    };

    this.utterance.onend = () => {
      this.isSpeaking = false;
    };

    this.utterance.onerror = (event) => {
      console.error('Error en síntesis de voz:', event);
      this.isSpeaking = false;
    };

    this.synth.speak(this.utterance);
  }

  // Detener la voz
  stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }

  // Alternar activación de voz
  toggleVoice() {
    this.voiceEnabled = !this.voiceEnabled;
    if (!this.voiceEnabled) {
      this.stopSpeaking();
    }
  }

  private scrollToBottom(): void {
    try {
      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Error al hacer scroll:', err);
    }
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}