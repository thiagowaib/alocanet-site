/**
 * Script utilizado na tela de Gerenciamento de Moradores
 */

// EventListener do OnClick do Botão de Criar Conta
document.getElementById("botao-criar-conta").addEventListener("click", () => {
    console.log("Criar conta")
})

// EventListener do OnClick do Botão de Modificar Conta
document.getElementById("botao-modificar-conta").addEventListener("click", () => {
    console.log("Modificar conta")
})

// EventListener do OnClick do Botão de Excluir Conta
document.getElementById("botao-excluir-conta").addEventListener("click", () => {
    console.log("Excluir conta")
})

document.getElementById("input-n-apto").addEventListener("input", ()=>{
    const nApto = document.getElementById("input-n-apto").value
    const btnConsultarApto = document.getElementById("botao-consultar-conta")
    if(nApto > 0) {
        btnConsultarApto.disabled = false
    } else {
        btnConsultarApto.disabled = true
    }
})

// EventListener do OnClick do Botão de Consultar Conta
document.getElementById("botao-consultar-conta").addEventListener("click", () => {
    const nApto = document.getElementById("input-n-apto").value
    if(nApto > 0) {
        console.log(`Consultar apto número ${nApto}`)
    }
})