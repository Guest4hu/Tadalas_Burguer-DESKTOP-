import Swal from "sweetalert2";

class Notificacao {
    constructor() {
        this.Swal = Swal;

    }

    async alertaConfirmacao(titulo, texto, icone) {
        const result = await this.Swal.fire({
        title: titulo,
        text: texto,
        icon: icone,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim",
    });
    return result.isConfirmed === true;
  }

  // Exibe modal de carregamento usando SweetAlert2
  abrirCarregar() {
    this.Swal.fire({
      title: "CARREGANDO",
      html: "Espere por favor...",
      allowEscapeKey: false,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        this.Swal.showLoading();
      }
    });
  }

  // Fecha modal de carregamento e exibe mensagem de feedback
  notificacaoMensagem(icone, mensagem) {
    this.Swal.close();
    this.Swal.fire({
      position: "top-end",
      icon: icone,
      title: mensagem,
      showConfirmButton: false,
      timer: 900
    });
  }

}

export default Notificacao