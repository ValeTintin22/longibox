import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getDatabase, provideDatabase } from '@angular/fire/database';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(), provideFirebaseApp(() => initializeApp({ projectId: "longibox-96472", appId: "1:1099371719981:web:19773a25330bbae29f77a4", databaseURL: "https://longibox-96472-default-rtdb.firebaseio.com", storageBucket: "longibox-96472.firebasestorage.app", apiKey: "AIzaSyBZyKvKmAVmED6uDCkEf8XatP2BJLU49jw", authDomain: "longibox-96472.firebaseapp.com", messagingSenderId: "1099371719981" })), provideDatabase(() => getDatabase())
  ],
};
