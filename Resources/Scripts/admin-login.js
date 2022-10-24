/**
 * Script utilizado para realizar o login do admin
 */

// Verifica se já há JWT salvo em cookie
// * TRUE: Pula etapa de login
// ! FALSE: Dá continuidade ao login
try{
    const JWT = document.cookie
                .split("; ")
                .find(tag => tag.startsWith("JWT="))
                .split("=")[1]
    fetch("https://alocanet-servidor.glitch.me/authJWT", {
        method: "GET",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "auth": `${JWT}`
        },
        cache: "no-store"
    })
    .then(async(res) => {
        const json = await res.json()
        if(res.status.toString()[0] === "4")
            console.error(json.message)
        else
            window.location.href = "./agendamentos.html"
    })
}catch{}

// Busca os elementos <input> e <button> do login
const botaoLoginAdmin = document.getElementById("botao-login")
const inputUsuarioAdmin = document.getElementById("input-usuario")
const inputSenhaAdmin = document.getElementById("input-senha")

// Função que valida se o botão de fazer login está disabled ou não
const validarInputs = () => {
    let validacao = 0
    inputUsuarioAdmin.value !== "" ? validacao++ : null
    inputSenhaAdmin.value !== "" ? validacao++ : null
    validacao === 2 ? botaoLoginAdmin.disabled = false : botaoLoginAdmin.disabled = true
}

// Define os listeners para o evento de "input" dos elementos <input>
inputUsuarioAdmin.oninput = validarInputs
inputSenhaAdmin.oninput = validarInputs

// EventListner no botão de envio
document.getElementById("botao-login").addEventListener("click", () => {
    // Dados de Login
    const usuario = inputUsuarioAdmin.value
    const senha = inputSenhaAdmin.value

    // https://alocanet-servidor.glitch.me/#api-Admins-loginAdmin
    fetch("https://alocanet-servidor.glitch.me/loginAdmin", {
        method: "POST",
        body: JSON.stringify({
            usuario: usuario,
            senha: senha
        }),
        headers: {"Content-type": "application/json; charset=UTF-8"},
        cache: "no-store"
    })
    .then(async (res) => {
        const json = await res.json()
        if(res.status.toString()[0] === "4") {  // -> Erro Prevísto
            console.error(json.message)
            alert(json.message)
        } else {                                // -> Sucesso
            console.log(json.message)
            document.cookie = `JWT=${json.tokenAcesso}` // -> Salva JWT nos Cookies
            window.location.href = "./agendamentos.html"
        }
    })
    .catch((err) => {                           // -> Erro não previsto
        console.error(err)
        alert("Houve algo de errado x-x")
    })
})


