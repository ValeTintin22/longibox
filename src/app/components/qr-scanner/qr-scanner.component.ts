import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { NgIf } from '@angular/common';
import { BarcodeFormat } from '@zxing/library'; // Import BarcodeFormat enum
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { DataServiceService } from '../../services/data-service.service';

@Component({
  selector: 'app-qr-scanner',
  standalone: true,
  imports: [ZXingScannerModule, NgIf],
  templateUrl: './qr-scanner.component.html',
  styleUrl: './qr-scanner.component.scss',
})
export class QrScannerComponent {

  scannedResult: string | null = null;
  allowedFormats = [BarcodeFormat.QR_CODE];
  user!: User;
  constructor(private router: Router,private serviceScaner: UserService,private dataService: DataServiceService) {}

  onScanSuccess(result: string) {
    this.scannedResult = result;
    console.log('QR Code Scanned:', result);

    const cedulaMatch = this.scannedResult.match(/dni:\s*(\d+)/);
    const cedula = cedulaMatch ? cedulaMatch[1] : 'No encontrada';
    
    this.serviceScaner.getUserByDni(cedula).subscribe(
      (data) => {
        this.user = data;
        if (this.user) {
          console.log('Usuario encontrado:', this.user);
          this.dataService.pasarDato(this.user.id);
          this.router.navigate(['/product-list']);
        } else {
          console.log('Usuario no encontrado');
          this.router.navigate(['/invalid-user']);
        }
      },
      (error) => {
        console.error('Error al obtener el usuario:', error);
      }
    )
  }

  cancel() {
    this.router.navigate(['']);
  }
  
}
