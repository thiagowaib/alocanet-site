/**
 * Script utilizado para realizar o login do morador
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
            window.location.href = "./calendario.html"
    })
}catch{}

// Busca os elementos <input> e <button> do login
const botaoLoginMorador = document.getElementById("botao-login")
const inputUsuarioMorador = document.getElementById("input-usuario")
const inputSenhaMorador = document.getElementById("input-senha")

// Função que valida se o botão de fazer login está disabled ou não
const validarInputs = () => {
    let validacao = 0
    inputUsuarioMorador.value > 0 ? validacao++ : null
    inputSenhaMorador.value !== "" ? validacao++ : null
    validacao === 2 ? botaoLoginMorador.disabled = false : botaoLoginMorador.disabled = true
}

// Define os listeners para o evento de "input" dos elementos <input>
inputUsuarioMorador.oninput = validarInputs
inputSenhaMorador.oninput = validarInputs

// EventListner no botão de envio
botaoLoginMorador.addEventListener("click", () => {
    // Dados de Login
    const usuario = inputUsuarioMorador.value
    const senha = inputSenhaMorador.value    

    // https://alocanet-servidor.glitch.me/#api-Admins-loginApto
    fetch("https://alocanet-servidor.glitch.me/loginApto", {
        method: "POST",
        body: JSON.stringify({
            numero: usuario,
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
            document.cookie = `APTO=${parseInt(usuario)}`   // -> Salva o Nº do Apto nos Cookies
            document.cookie = `JWT=${json.tokenAcesso}`     // -> Salva JWT nos Cookies
            window.location.href = "./calendario.html"
        }
    })
    .catch((err) => {                           // -> Erro não previsto
        console.error(err)
        alert("Houve algo de errado x-x")
    })
})


