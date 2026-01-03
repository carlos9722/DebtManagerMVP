import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "@auth/services/auth.service";

/*
  Interceptor de autenticación
  Se ejecuta ANTES de que la petición HTTP salga al servidor
*/
export function authInterceptor(
  req: HttpRequest<unknown>, // Petición HTTP original
  next: HttpHandlerFn        // Permite continuar con la petición
) {

    // Obtenemos el token desde el AuthService
    const token = inject(AuthService).token();

    /*
      Las peticiones HTTP son inmutables (no se pueden modificar),
      por eso se clona la petición y se agrega el token en el header
    */
    const newReq = req.clone({
      headers: req.headers.append(
        'Authorization',       // Nombre del encabezado
        `Bearer ${token}`      // Formato estándar para enviar el token
      ),
    });

    // Se envía la nueva petición con el token agregado
    return next(newReq);
}
