/**
 * Script utilizado na tela de Gerenciamento de Moradores
 */

/**
 * RENAN
 * ESSE É O SEU CÓDIGO JAVASCRIPT
 * ESSE AQUI
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

