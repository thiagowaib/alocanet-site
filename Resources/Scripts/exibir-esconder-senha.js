/**
 * Script utilizado para exibir e esconder a senha
 * dos inputs utilizados nos login
 */

// Elemento <input> da senha
const inputSenha = document.getElementById("input-senha")

// Elementos <img> dos icones
const iconFechado = document.getElementById("fechado")
const iconAberto = document.getElementById("aberto")

// Elemento <span> da zona clicável
const span = iconFechado.parentElement

let fechado = true

// EventListener para Exibir/Esconder a senha
span.addEventListener("click", () => {
    if(fechado) {   // -> Exibir
        iconFechado.style.display = "none"
        iconAberto.style.display = "block"
        inputSenha.type = "text"
        fechado = false
    } else {        // -> Esconder
        iconAberto.style.display = "none"
        iconFechado.style.display = "block"
        inputSenha.type = "password"
        fechado = true
    }
})