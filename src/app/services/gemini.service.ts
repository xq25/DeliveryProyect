import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from 'src/environments/environment';
import { Observable, from, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    try {
      if (!environment.geminiApiKey || environment.geminiApiKey === 'TU_API_KEY_DE_GEMINI_AQUI') {
        console.error('⚠️ API Key de Gemini no configurada correctamente');
      }
      this.genAI = new GoogleGenerativeAI(environment.geminiApiKey);
      // 👇 Usar gemini-2.5-flash (modelo disponible en tu API Key)
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      console.log('✅ Servicio Gemini inicializado correctamente con gemini-2.5-flash');
    } catch (error) {
      console.error('❌ Error al inicializar Gemini:', error);
    }
  }

  sendMessage(message: string): Observable<string> {
    console.log('📤 Enviando mensaje a Gemini:', message);

    const prompt = `
Eres un asistente virtual experto del sistema de gestión de delivery. Tu objetivo es ayudar a los usuarios a entender y utilizar todas las funcionalidades del sistema.

INFORMACIÓN COMPLETA DEL SISTEMA:

1. MÓDULOS PRINCIPALES:
   - Dashboard: Visualización de estadísticas y métricas del negocio
   - Pedidos (Orders): Gestión completa de órdenes de delivery
   - Menús: Administración de menús de restaurantes
   - Turnos de Repartidores (Shifts): Control de horarios y disponibilidad de conductores
   - Motos (Motorcycles): Registro y estado de vehículos (disponible, no disponible, mantenimiento)
   - Conductores (Drivers): Gestión de información de repartidores
   - Clientes (Customers): Base de datos de usuarios del servicio
   - Restaurantes: Registro y administración de establecimientos asociados
   - Productos: Catálogo de items disponibles para pedidos
   - Informes (Reports): Generación de reportes y análisis de datos
   - Direcciones (Addresses): Gestión de ubicaciones de entrega
   - Fotos (Photos): Gestión de imágenes del sistema
   - Incidencias (Issues): Registro y seguimiento de problemas

2. FUNCIONALIDADES POR MÓDULO:
   - Cada módulo permite: Listar, Crear, Ver detalles, Actualizar y Eliminar registros
   - Todos los módulos tienen validaciones de formularios
   - Sistema de notificaciones con SweetAlert2
   - Interfaz responsiva con Bootstrap y Argon Dashboard

3. CARACTERÍSTICAS TÉCNICAS:
   - Autenticación con Firebase (OAuth)
   - Guards de autenticación para proteger rutas
   - Interceptor HTTP para manejo de tokens
   - Backend API REST en Python (puerto 5000)
   - Formularios dinámicos reutilizables
   - WebSockets para notificaciones en tiempo real (ngx-socket-io)
   - Gráficos con Chart.js

4. FLUJO DE TRABAJO TÍPICO:
   - Usuario se autentica en el sistema
   - Puede navegar por el menú lateral (sidebar)
   - Registra restaurantes, productos y menús
   - Registra conductores y motocicletas
   - Asigna turnos a conductores
   - Clientes realizan pedidos
   - Sistema asigna pedidos a conductores disponibles
   - Se monitorean entregas y se generan reportes

5. RUTAS PRINCIPALES:
   - /dashboard - Pantalla principal
   - /orders/list - Lista de pedidos
   - /orders/create - Crear nuevo pedido
   - /drivers/list - Lista de conductores
   - /drivers/create - Registrar conductor
   - /motorcycles/list - Lista de motos
   - /restaurants/list - Lista de restaurantes
   - /menus/list - Lista de menús
   - /shifts/list - Turnos de repartidores
   - /customers/list - Lista de clientes
   - /products/list - Catálogo de productos
   - /reports - Informes y estadísticas
   - /chatbot/chat - Este asistente virtual

PREGUNTA DEL USUARIO:
${message}

INSTRUCCIONES:
- Responde de manera clara, amigable y profesional
- Si preguntan cómo hacer algo, explica los pasos detalladamente
- Si preguntan dónde está algo, indica la ruta exacta en el menú
- Puedes sugerir funcionalidades relacionadas que puedan ser útiles
- Si la pregunta es técnica sobre implementación, explica basándote en el stack tecnológico
- Si no estás seguro de algo, indica que pueden consultar la documentación o contactar soporte
- Mantén un tono conversacional y útil
`;

    return from<string>(
      this.model.generateContent(prompt)
        .then((result: any) => {
          console.log('📥 Respuesta recibida de Gemini:', result);
          const response = result.response;
          const text = response.text();
          console.log('✅ Texto extraído:', text);
          return text as string;
        })
        .catch((error: any) => {
          console.error('❌ Error en generateContent:', error);
          throw error;
        })
    ).pipe(
      catchError((error) => {
        console.error('❌ Error completo en sendMessage:', error);
        
        if (error.message?.includes('API key')) {
          return throwError(() => new Error('Error de API Key: Verifica que tu clave de Gemini sea válida'));
        }
        if (error.message?.includes('quota')) {
          return throwError(() => new Error('Cuota excedida: Has alcanzado el límite de llamadas a la API'));
        }
        if (error.message?.includes('network') || error.message?.includes('Failed to fetch')) {
          return throwError(() => new Error('Error de conexión: Verifica tu conexión a internet'));
        }
        if (error.message?.includes('not found') || error.message?.includes('404')) {
          return throwError(() => new Error('Modelo no disponible. Verifica la versión de la librería @google/generative-ai'));
        }
        
        return throwError(() => new Error('Error desconocido: ' + (error.message || 'Intenta de nuevo')));
      })
    );
  }
}