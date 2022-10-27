/**
 * Script utilizado na tela de Gerenciamento de Moradores
 */

/**
 * (TASK OVERLAY/MODAL DE CONSULTA DE CONTAS)
 */
document.getElementById("input-n-apto").addEventListener("input", ()=>{
    const nApto = document.getElementById("input-n-apto").value
    const btnConsultarApto = document.getElementById("botao-consultar-conta")
    if(nApto > 0) {
        btnConsultarApto.disabled = false
    } else {
        btnConsultarApto.disabled = true
    }
})

/**
 * Script utilizado para controlar o modal de Consulta de contas.
 */


// Função de Abrir o Modal
const abrirModalConsultarConta = () => {
    const modal = document.getElementById("container-modal-consultar-conta")
    modal.classList.add("aberto")

    // Atribui a função de fechar aos botões correspondentes
    document.getElementById("span-fechar-modal-consultar-conta").addEventListener("click", fecharModalConsultarConta)
    document.getElementById("botao-fechar-modal-consultar-conta").addEventListener("click", fecharModalConsultarConta)
}

// Função de Fechar o Modal
const fecharModalConsultarConta = () => {
    const modal = document.getElementById("container-modal-consultar-conta")
    modal.classList.remove("aberto")
}

// Atribui a função de abrir ao evento "click" do botão de criar conta
document.getElementById("botao-consultar-conta").addEventListener("click", abrirModalConsultarConta)
