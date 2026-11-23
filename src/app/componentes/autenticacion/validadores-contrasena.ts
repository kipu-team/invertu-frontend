import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/*
 * Validaciones de contraseña para registro (US-01) y restablecer (US-04)
 * Mismas reglas que el backend: RegistroRequestDTO y RestablecerContrasenaRequestDTO
 */

// Mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial
export const PATRON_CONTRASENA = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,}$/;

// Confirmación igual a la contraseña: error "noCoinciden" en el campo de confirmación
export function contrasenasCoinciden(campoContrasena: string, campoConfirmar: string): ValidatorFn {
  return (grupo: AbstractControl): ValidationErrors | null => {
    const contrasena = grupo.get(campoContrasena)?.value;
    const confirmar = grupo.get(campoConfirmar);
    if (confirmar?.value && contrasena !== confirmar.value) {
      confirmar.setErrors({ ...confirmar.errors, noCoinciden: true });
    } else if (confirmar?.hasError('noCoinciden')) {
      const { noCoinciden, ...resto } = confirmar.errors ?? {};
      confirmar.setErrors(Object.keys(resto).length ? resto : null);
    }
    return null;
  };
}
