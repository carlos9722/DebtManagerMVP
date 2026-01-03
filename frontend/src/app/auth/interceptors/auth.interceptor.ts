import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "@auth/services/auth.service";

/*
  Interceptor de autenticación
  Se ejecuta ANTES de que la petición HTTP salga al servidor
*/
export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) {


    const token = inject(AuthService).token();

    // Solo se agreaga token si existe
    if (!token) {
      return next(req);
    }

    /*
      Las peticiones HTTP son inmutables (no se pueden modificar),
      por eso se clona la petición y se agrega el token en el header
    */
    const newReq = req.clone({
      headers: req.headers.append(
        'Authorization',
        `Bearer ${token}`
      ),
    });

    // Se envía la nueva petición con el token agregado
    return next(newReq);
}
