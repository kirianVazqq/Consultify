import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { BudgetService } from 'src/app/services/budget.service';
import { Storage } from '@ionic/storage-angular';
import { jwtDecode } from 'jwt-decode';
@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.page.html',
  styleUrls: ['./budgets.page.scss'],
})
export class BudgetsPage implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
    private budgetService: BudgetService,
    private storage: Storage
  ) {
    this.init();
  }
  budgets: any[] = [];
  flag: boolean = true;
  async init() {
    await this.storage.create();
  }

  ngOnInit() {
    this.getBudgetByUser();
  }
  async getBudget() {
    const token = await this.storage.get('token');
    if (token === null) {
      console.error('Token no encontrado');
      return;
    }
    this.budgetService.getBudgets(token).subscribe(
      (data: any) => {
        this.budgets = data;
      },
      (error) => {
        console.error('Error al obtener los presupuestos', error);
      }
    );
  }

  async getBudgetByUser() {
    const token = await this.storage.get('token');
    if (token === null) {
      console.error('Token no encontrado');
      return;
    }

    const decoded = jwtDecode(token) as any; // Aquí estás diciendo que decoded puede ser de cualquier tipo
    const userId = decoded.id; // TypeScript ya no se quejará porque usamos 'any'
    this.budgetService.getBudgetsByUser(token, userId).subscribe(
      (data: any) => {
        this.budgets = data;
      },
      (error) => {
        console.error('Error al obtener los presupuestos', error);
      }
    );
  }

  addInForm(budget: any) {
    const navigationExtras = {
      state: {

        flag: this.flag,
        budget: budget,
      },
    };
    this.router.navigate(['/form-budget'], navigationExtras);
  }

  async deleteBudget(budgetId: number) {
    const token = await this.storage.get('token');
    if (token) {
      this.budgetService.deleteBudget(budgetId, token).subscribe(
        (response) => {
          console.log('Presupuesto eliminado');
          this.getBudgetByUser();
        },
        (error) => {
          console.error('Error al eliminar el usuario', error);
        }
      );
    } else {
      console.error('Token no encontrado');
    }
  }
  goToBudgetsForm(){
    this.router.navigate(['/form-budget']);
  }

  // async addInForm(user: any, id: number) {
  //   this.editButtonPressed = true;
  //   this.editingId = id;
  //   this.formRegister.patchValue({
  //     username: user.username,
  //     email: user.email,
  //   });
  // }

  // async editUser() {
  //   if (!this.formRegister.valid) {
  //     console.error('El formulario no es válido');
  //     return;
  //   }

  //   // El ID del usuario debe estar disponible para poder editar
  //   const userId = this.editingId; // Asegúrate de que editingId se ha definido y se ha establecido correctamente
  //   if (!userId) {
  //     console.error('No hay un ID de usuario para editar');
  //     return;
  //   }

  //   // Obtener el token de autenticación si es necesario para tu API
  //   const token = await this.storage.get('token');
  //   if (!token) {
  //     console.error('Token de autenticación no encontrado');
  //     return;
  //   }

  //   const formValue = this.formRegister.value;
  //   const userToUpdate = {
  //     username: formValue.username,
  //     email: formValue.email,
  //     password: formValue.password,
  //     isAdmin: false,
  //   };

  //   this.userService.editUser(userId, userToUpdate, token).subscribe(
  //     (response) => {
  //       console.log('Usuario actualizado exitosamente', response);
  //     this.getUsers();
  //     this.formRegister.reset();
  //     },
  //     (error) => {
  //       console.error('Error al actualizar el usuario', error);
  //     }
  //   );
  // }
}
