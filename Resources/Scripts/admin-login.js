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
        }
    })
    .then(async(res) => {
        const json = await res.json()
        if(res.status.toString()[0] === "4")
            console.error(json.message)
        else
            window.location.href = "./agendamentos.html"
    })
}catch{}

// EventListner no botão de envio
document.getElementById("botao-login").addEventListener("click", () => {
    // Dados de Login
    const usuario = document.getElementById("input-usuario").value
    const senha = document.getElementById("input-senha").value    
    
    // Valida se há dados suficientes
    if(usuario === "") return;
    if(senha === "") return;

    // https://alocanet-servidor.glitch.me/#api-Admins-loginAdmin
    fetch("https://alocanet-servidor.glitch.me/loginAdmin", {
        method: "POST",
        body: JSON.stringify({
            usuario: usuario,
            senha: senha
        }),
        headers: {"Content-type": "application/json; charset=UTF-8"}
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


