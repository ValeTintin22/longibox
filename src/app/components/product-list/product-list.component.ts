import { Component, CUSTOM_ELEMENTS_SCHEMA, input, output } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { DataServiceService } from '../../services/data-service.service';
import { ComprasService } from '../../services/compras.service';
import { ProductService } from '../../services/product.service';
import { Cart, Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { PurchaseService } from '../../services/purchase.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { ActivateMotorsService } from '../../services/activate-motors.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class ProductListComponent {
  id_users = 0;
  productos: Product[] = [];
  selectedIndex = 0;
  i = 0;
  cartItems: Cart[] = [];
  user!: User;
  isProcessing = false;

  constructor(
    private router: Router,
    private dataService: DataServiceService,
    private serviceCompras: ComprasService,
    private serviceProducto: ProductService,
    private cartService: PurchaseService,
    private serviceUser: UserService,
    private activateMotorsService: ActivateMotorsService
  ) { }

  ngOnInit() {
    this.dataService.datoActual.subscribe(dato => {
      this.id_users = dato;
    });
    this.getCarrito();
    this.loadUsersId();
    this.cartItems = this.cartService.getCartItems();
  }

  slideLeft(sliderId: string) {
    console.log("left" + sliderId)
    const slider = document.getElementById(sliderId) as HTMLElement | null;
    if (slider) {
      slider.scrollLeft -= 500;
    }
  }

  slideRight(sliderId: string) {
    console.log("right" + sliderId)
    const slider = document.getElementById(sliderId) as HTMLElement | null;
    if (slider) {
      slider.scrollLeft += 500;
    }
  }

  retirarCompra() {
    // Verificar si hay productos en el carrito
    if (this.cartItems.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    // Verificar si el usuario tiene suficientes retiros disponibles
    const totalProductos = this.cartItems.reduce((total, item) => total + item.quantity, 0);
    if (this.user && this.user.productos_restantes < totalProductos) {
      alert('No tienes suficientes retiros disponibles');
      return;
    }

    // Evitar múltiples envíos simultáneos
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    // Enviar la solicitud a Firebase
    this.activateMotorsService.requestProducts(this.cartItems)
      .pipe(
        finalize(() => {
          // Se ejecutará cuando termine, con éxito o error
          this.isProcessing = false;
        })
      )
      .subscribe({
        next: (response) => {
          console.log('Solicitud enviada correctamente:', response);

          // Actualizar datos del usuario y registrar la compra
          this.serviceCompras.enpoint(this.id_users, totalProductos).subscribe({
            next: (response) => {
              console.log('Datos Actualizados:', response);
              this.createCompra();
            },
            error: (err) => {
              console.error('Error al actualizar datos:', err);
              alert('Error: Superaste la cantidad de retiros que tienes');
            }
          });
        },
        error: (err) => {
          console.error('Error al enviar solicitud:', err);
          alert('Error al comunicarse con el dispensador. Por favor, intente nuevamente.');
        }
      });
  }

  loadUsersId() {
    this.serviceUser.getUserById(this.id_users).subscribe((data) => {
      this.user = data;
    });
  }

  createCompra() {
    this.serviceCompras.createCompras(this.id_users).subscribe({
      next: (response) => {
        console.log('Compra registrada:', response);
        console.log(response.id);

        // Registrar los detalles de la compra
        let detallesRegistrados = 0;
        const totalDetalles = this.cartItems.length;

        for (let i = 0; i < this.cartItems.length; i++) {
          const item = this.cartItems[i];
          console.log(`ID del producto: ${item.product.id}, Cantidad: ${item.quantity}`);

          this.createDetalleCompra(response.id, item.product.id, item.quantity).subscribe({
            next: () => {
              detallesRegistrados++;

              // Si se registraron todos los detalles, mostrar mensaje y navegar
              if (detallesRegistrados === totalDetalles) {
                console.log("Retiro Exitoso");
                alert('Retiro Exitoso. Por favor retire sus productos del dispensador.');
                this.clearCart();
                this.router.navigate(['/invalid-user']);
              }
            },
            error: (err) => {
              console.error('Error al registrar detalle:', err);
            }
          });
        }
      },
      error: (err) => {
        console.error('Error al crear compra:', err);
        alert('Error al registrar la compra');
      }
    });
  }

  createDetalleCompra(id_compra: number, id_producto: Number, cantidad: Number) {
    return this.serviceCompras.createDetalleCompras(id_compra, id_producto, cantidad);
  }

  cancel() {
    this.router.navigate(['']);
  }

  getCarrito() {
    this.serviceProducto.getProduct().subscribe({
      next: (response) => {
        console.log('Productos:', response);
        this.productos = response;
      },
      error: (err) => {
        console.error('Error:', err);
      }
    })
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.cartItems = [];
    console.log('Carrito limpiado:', this.cartItems);
    console.log('Productos disponibles:', this.productos);
  }


  addToCart(item: Product) {
    console.log('Agregando al carrito:', item);
    this.cartService.addToCart(item);
    this.cartItems = this.cartService.getCartItems();
    console.log('Carrito actual:', this.cartItems);
  }

  incrementQuantity(item: Cart): void {
    item.quantity += 1;
  }

  decrementQuantity(item: Cart): void {
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      this.cartService.removeFromCart(item.product.name);
      this.cartItems = this.cartService.getCartItems();
    }
  }

  removeItem(name: String): void {
    this.cartService.removeFromCart(name);
    this.cartItems = this.cartService.getCartItems();
  }
}