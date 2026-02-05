import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);
  if (JSON.parse(localStorage.getItem('userRole')) === 'supplier') {
    return true;
  } else {
    toastr.error("Unauthorized")
    router.navigate(['/owner']);
  }
};
