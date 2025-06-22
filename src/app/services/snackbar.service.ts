import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
// import { MessageService } from 'primeng/api';


@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  private showToastSubject = new BehaviorSubject<any>({});
  public showToast$ = this.showToastSubject.asObservable();

  constructor(
    private snackBar: MatSnackBar,
    // private messageService: MessageService
  ) { }

  show(message: string, action: string = 'X', duration: number = 3000) {
    this.snackBar.open(message, action, {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      // panelClass: ['snackbar-style']
    });
  }

  showToast(detail: string, summary: string = 'Success', severity: string = 'success') {
    const toastObject = {
      detail,
      summary,
      severity
    }
    this.showToastSubject.next(toastObject);
  }



  // showSuccess(detail: string, summary: string = "success", life: number = 3000): void {
  //   this.messageService.add({ severity: 'success', summary: summary, detail: detail, life: life });
  // }

  // showInfo(detail: string, summary: string = "info", life: number = 3000): void {
  //   this.messageService.add({ severity: 'info', summary: summary, detail: detail, life: life });
  // }

  // showWarning(detail: string, summary: string = "warn", life: number = 3000): void {
  //   this.messageService.add({ severity: 'warn', summary: summary, detail: detail, life: life });
  // }

  // showError(detail: string, summary: string = "error", life: number = 3000): void {
  //   this.messageService.add({ severity: 'error', summary: summary, detail: detail, life: life });
  // }

}
