import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ToastsService {

  constructor() { }

  showToast(icon: 'success' | 'error', title: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      showCloseButton: true,

      timer: 3000,
      timerProgressBar: true,
      customClass: {
        popup: 'custom-toast-zindex', 
      },
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({ icon, title });
  }

  confirmDeletion(): Promise<boolean> {
    return Swal.fire({
      title: "Are you sure?",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
     confirmButtonText: "Deleted",
      cancelButtonText: "Cancel"
    }).then((result) => {
      return result.isConfirmed;
    });
  }
}
