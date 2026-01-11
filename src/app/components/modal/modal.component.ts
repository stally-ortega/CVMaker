import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Reusable Modal Component.
 * 
 * Displays a dialog with a title, message, and two action buttons (Cancel/Confirm).
 */
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() title: string = 'Confirmación';
  @Input() message: string = '¿Estás seguro?';
  @Input() confirmText: string = 'Confirmar';
  @Input() cancelText: string = 'Cancelar';
  @Input() isOpen: boolean = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
