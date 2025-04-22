import Swal from "sweetalert2";

export function ErrorAlert(data,msg){
    Swal.fire({
        position: "top-end",
        icon: "error",
        title: data || msg,
        toast: true,
        showConfirmButton: false,
        timer: 3500,
      });
}

export function SuccessAlert(data,msg){
    Swal.fire({
        position: "top-end",
        icon: "success",
        title: data || msg,
        toast: true,
        showConfirmButton: false,
        timer: 3500,
      });
}

export function SimpleAlert(data,msg){
    Swal.fire({
        position: "top-end",
        icon: "alert",
        title: data || msg,
        toast: true,
        showConfirmButton: false,
        timer: 3500,
      });
}