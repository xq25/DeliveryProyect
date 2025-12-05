import { Component, OnInit, OnDestroy, AfterViewInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MotorcyclesService } from 'src/app/services/motorcycles.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import * as L from 'leaflet';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.scss']
})
export class TrackComponent implements OnInit, OnDestroy, AfterViewInit {
  plate: string = '';
  isTracking: boolean = false;
  currentLocation: any = null;
  
  private map: L.Map | null = null;
  private marker: L.Marker | null = null;
  private locationSubscription: Subscription | null = null;
  private isFirstLocation: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private motorcycleService: MotorcyclesService,
    private webSocketService: WebSocketService
  ) {}

  @HostListener('window:resize')
  onResize() {
    this.map?.invalidateSize();
  }

  ngOnInit(): void {
    this.plate = this.route.snapshot.params['plate'];
  }

  ngAfterViewInit(): void {
    this.waitForMapContainer();
  }

  ngOnDestroy(): void {
    this.stopTracking();
    if (this.locationSubscription) {
      this.locationSubscription.unsubscribe();
    }
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  waitForMapContainer() {
    const checkContainer = () => {
      const container = document.getElementById('map');
      if (container && container.offsetHeight > 0) {
        console.log(`✅ Contenedor listo: ${container.offsetWidth}x${container.offsetHeight}`);
        this.initMap();
        if (this.plate) {
          setTimeout(() => this.startTracking(), 500);
        }
      } else {
        console.log('⏳ Esperando contenedor...');
        setTimeout(checkContainer, 100);
      }
    };
    
    setTimeout(checkContainer, 200);
  }

  initMap() {
    // Coordenadas iniciales genéricas (centro de Manizales)
    const lat = 5.0689;
    const lng = -75.5174;
    
    console.log('🗺️ Inicializando mapa Leaflet...');
    
    const container = document.getElementById('map');
    if (!container) {
      console.error('❌ Contenedor #map no encontrado');
      return;
    }
    
    // Limpiar contenedor
    container.innerHTML = '';
    
    // Crear mapa SIN marcador inicial
    this.map = L.map('map').setView([lat, lng], 13); // Zoom 13 para vista general
    
    // Tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png', {
      attribution: '© CARTO © OpenStreetMap',
      maxZoom: 19
    }).addTo(this.map);
    
    // NO crear marcador aquí - esperar GPS
    console.log('✅ Mapa listo - esperando primera ubicación GPS');
    
    // Fix de tiles
    this.map.whenReady(() => {
      console.log('✅ Leaflet listo');
      this.fixTiles();
    });
  }

  createMarker(lat: number, lng: number) {
    // Crear marcador solo la primera vez
    const icon = L.divIcon({
      html: `
        <div style="
          font-size: 50px; 
          text-shadow: 
            0 0 10px rgba(255, 255, 255, 1),
            0 0 20px rgba(255, 255, 255, 0.8),
            2px 2px 8px rgba(0, 0, 0, 0.9);
          position: relative;
          z-index: 9999;
          animation: bounce 2s infinite;
        ">🏍️</div>
        <style>
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
        </style>
      `,
      iconSize: [50, 50],
      iconAnchor: [25, 25],
      className: 'custom-marker',
      popupAnchor: [0, -25]
    });

    this.marker = L.marker([lat, lng], { 
      icon: icon,
      zIndexOffset: 1000
    }).addTo(this.map!);
    
    console.log('✅ Marcador creado en:', lat, lng);
  }

  fixTiles() {
    //console.log('🔧 Aplicando fix de tiles...');
    
    const delays = [0, 50, 100, 150, 200, 300, 500, 1000];
    
    delays.forEach((delay, index) => {
      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize(true);
          
          const container = this.map.getContainer();
          const parent = container.parentElement;
          if (parent) {
            parent.style.height = parent.offsetHeight + 'px';
            setTimeout(() => {
              parent.style.height = '';
            }, 10);
          }
          
          if (index < 4) {
            window.dispatchEvent(new Event('resize'));
          }
          
          this.map.eachLayer((layer: any) => {
            if (layer.redraw) {
              layer.redraw();
            }
          });
          
          //console.log(`🔧 Fix ${index + 1}/${delays.length} (${delay}ms)`);
        }
      }, delay);
    });
  }

  startTracking() {
    this.motorcycleService.startTracking(this.plate).subscribe({
      next: (response) => {
        this.isTracking = true;
        Swal.fire({
          icon: 'success',
          title: 'Tracking iniciado',
          text: 'Esperando señal GPS...',
          timer: 2000,
          showConfirmButton: false
        });
        this.setupWebSocket();
      },
      error: (err) => {
        console.error('Error:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo iniciar el tracking'
        });
      }
    });
  }

  setupWebSocket() {
    this.webSocketService.setNameEvent(this.plate);
    this.locationSubscription = this.webSocketService.callback.subscribe({
      next: (data) => this.processLocationUpdate(data),
      error: (err) => console.error('WebSocket error:', err)
    });
  }

  processLocationUpdate(data: any) {
    if (data.lat && data.lng) {
      const lat = parseFloat(data.lat);
      const lng = parseFloat(data.lng);
      if (!isNaN(lat) && !isNaN(lng)) {
        this.updateLocation(lat, lng, data.time);
      }
    }
  }

  updateLocation(lat: number, lng: number, timestamp?: string) {
    this.currentLocation = {
      latitude: lat,
      longitude: lng,
      timestamp: timestamp || new Date().toISOString(),
      plate: this.plate
    };
    
    if (!this.marker) {
      // Primera ubicación - crear marcador
      this.createMarker(lat, lng);
      
      if (this.map) {
        this.map.setView([lat, lng], 16); // Zoom más cercano
        
        // Abrir popup inicial
        this.marker?.bindPopup(`
          <div style="text-align: center; padding: 10px;">
            <b style="font-size: 1.3rem; color: #5e72e4;">🏍️ ${this.plate}</b><br>
            <hr style="margin: 8px 0;">
            <small style="font-size: 0.95rem;">📍 ${lat.toFixed(6)}, ${lng.toFixed(6)}</small><br>
            <small style="color: #8898aa;">🕐 Iniciando seguimiento...</small>
          </div>
        `).openPopup();
        
        setTimeout(() => this.fixTiles(), 300);
      }
      
      console.log('🎯 Primera ubicación recibida');
      this.isFirstLocation = false;
      
    } else {
      // Actualizaciones posteriores - mover marcador existente
      const newPos = L.latLng(lat, lng);
      this.marker.setLatLng(newPos);
      
      const time = new Date(timestamp || '').toLocaleTimeString('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      
      this.marker.setPopupContent(`
        <div style="text-align: center; padding: 10px;">
          <b style="font-size: 1.3rem; color: #5e72e4;">🏍️ ${this.plate}</b><br>
          <hr style="margin: 8px 0;">
          <small style="font-size: 0.95rem;">📍 ${lat.toFixed(6)}, ${lng.toFixed(6)}</small><br>
          <small style="color: #8898aa;">🕐 ${time}</small>
        </div>
      `);
      
      // Seguir la moto con el mapa
      this.map?.panTo(newPos, { animate: true, duration: 0.5 });
      
      console.log('✅ Ubicación actualizada:', lat, lng);
    }
  }

  stopTracking() {
    if (!this.isTracking) return;
    
    this.motorcycleService.stopTracking(this.plate).subscribe({
      next: () => {
        this.isTracking = false;
        if (this.locationSubscription) {
          this.locationSubscription.unsubscribe();
        }
        Swal.fire({
          icon: 'info',
          title: 'Tracking detenido',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }

  goBack() {
    this.router.navigate(['/motorcycles']);
  }
}