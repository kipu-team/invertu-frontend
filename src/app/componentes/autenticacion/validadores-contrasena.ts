import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Reglas de contraseña compartidas por registro (US-01) y restablecer contraseña (US-04).
 * Son las mismas del backend (RegistroRequestDTO y RestablecerContrasenaRequestDTO).
 */

/** Mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial */
export const PATRON_CONTRASENA = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,}$/;

/**
 * Validador del formulario: el campo de confirmación debe ser igual a la contraseña.
 * Si no coinciden, marca el error "noCoinciden" en el campo de confirmación.
 */
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
