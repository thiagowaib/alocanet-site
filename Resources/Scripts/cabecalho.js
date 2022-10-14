/**
 * Script utilizado no funcionamento do
 * cabeçalho no painel administrativo
 */

// EventListener para realizar Logout
document.getElementById("botao-logout").addEventListener("click", () => {
    document.cookie = "JWT="                     // -> Apaga o JWT dos Cookies
    window.location.replace("./index.html")      // -> Retorna para a página de login
})

// EventListener para abrir o menu de navegação
document.getElementById("botao-abrir-menu").addEventListener("click", () => {
    const menu = document.getElementById("menu-navegacao")
    menu.style.display = "flex"
})

// EventListener para fechar o menu de navegação
document.getElementById("botao-fechar-menu").addEventListener("click", () => {
    const menu = document.getElementById("menu-navegacao")
    menu.style.display = "none"
})