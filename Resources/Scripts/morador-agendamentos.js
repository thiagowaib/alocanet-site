/**
 * Script referente ao controlador da tela
 * de agendamentos do painel do morador
 * (Morador/agendamentos.html)
 */

// Realiza o display do limite de locações na tela
const displayLimiteLocacoes = (limite, numLocacoes) => {
    const h2 = document.getElementById("display-limite-locacoes")
    h2.style.opacity = "0"

    document.getElementById("display-limite-locacoes").innerHTML = `
    Você pode ter mais
    <span>${limite - numLocacoes}</span>
    locação ${(limite-numLocacoes)>1?"ativas":"ativa"} simultâneamente
    `

    h2.style.opacity = "1"
}

// Função que realiza a busca do parâmetro ("limiteLocações")
const buscarLimiteLocacoes = (numLocacoes) => {

    // Busca o JWT nos cookies
    let JWT = ""
    try{
        JWT = document.cookie
                    .split("; ")
                    .find(tag => tag.startsWith("JWT="))
                    .split("=")[1]
    }catch{
        console.warn("JWT não encontrado como cookie")
        return; // Retorna caso não ache
    }

    fetch(`https://alocanet-servidor.glitch.me/buscarParametros`, {
        method: "GET",
        headers: {
            "auth": `${JWT}`
        },
        cache: "no-store"
    })
    .then(async (res) => {
        const json = await res.json()
        if(res.status.toString()[0] === "4") {  // -> Erro Prevísto
            console.error(json.message)
            alert(json.message)
        } else {                                // -> Sucesso
            // Caso haja um limite de locações, invoca seu display
            json.limiteLocacoes > 0 ? 
            displayLimiteLocacoes(json.limiteLocacoes, numLocacoes) : 
            console.log("Não há limite de locações")
        }
    })
    .catch((err) => {
        console.error(err)
        alert("Houve algo de errado x-x")
    })
}

// Função que realiza o cancelamento de uma locação
const cancelarLocacao = (id) => {
    // Busca o JWT nos cookies
    let JWT = ""
    try{
        JWT = document.cookie
                    .split("; ")
                    .find(tag => tag.startsWith("JWT="))
                    .split("=")[1]
    }catch{
        console.warn("JWT não encontrado como cookie")
        return; // Retorna caso não ache
    }

    fetch(`https://alocanet-servidor.glitch.me/cancelar/${id}`, {
        method: "PUT",
        headers: {
            "auth": `${JWT}`
        },
        cache: "no-store"
    })
    .then(async (res) => {
        const json = await res.json()
        if(res.status.toString()[0] === "4") {  // -> Erro Prevísto
            console.error(json.message)
            alert(json.message)
        } else {                                // -> Sucesso
            location.reload()
            console.log(json.message)
            alert(json.message)
        }
    })
    .catch((err) => {
        console.error(err)
        alert("Houve algo de errado x-x")
    })
}

// Função que atribui eventListeners aos elementos das locações
const atribuirEventListeners = () => {
    const botoes = document.getElementsByClassName("botao-opcoes-locacao")
    const spans = document.getElementsByClassName("botao-cancelar-locacao")

    for(let i = 0; i<botoes.length; i++)
    {
        const botao = botoes[i]
        const span = botao.parentElement.children[1]

        // EventListener para abrir o elemento <span> Cancelar </span>
        botao.addEventListener("click", () => {
            if(span.classList.contains("aberto")){
                span.classList.remove("aberto")
            } else {
                for(let j=0; j<spans.length; j++)
                    spans[j].classList.remove("aberto")
                span.classList.add("aberto")    
            }
        })

        // EventListener para chamada da função de cancelamento da locação
        span.addEventListener("click", () => {
            cancelarLocacao(span.getAttribute("objectId"))
        })
    }
}

// Função que realiza o display das locações do Apto
const displayLocacoes = (locacoes) => {

    const container = document.getElementById("container-locacoes")
    container.style.opacity = "0"

    let locacoesHTML = ""
    locacoes.forEach((locacao, index) => {
        locacoesHTML += `
        <li class="locacao">
            <span class="locacao-numero">
                ${index+1}&nbsp;&nbsp;•&nbsp;&nbsp;
            </span>
            <div class="locacao-dados">
                <div class="locacao-dados-superior">
                    <p>${locacao.data}</p>
                    <p>R$${locacao.valor},00</p>
                </div>
                <div class="locacao-dados-inferior">
                    <p>${locacao.espaco}</p>
                    <div>
                        <button type="button" class="botao-opcoes-locacao">
                            <img src="../../Resources/Icons/menu-bolinhas-vertical.svg" alt="Opções">
                        </button>
                        <span type="button" class="botao-cancelar-locacao" objectId="${locacao._id.toString()}">Cancelar</span>
                    </div>
                </div>
            </div>
        </li>
        `
    })

    container.innerHTML = locacoesHTML
    container.style.opacity = "1"

    // Invoca a função que atribui eventListeners aos botões
    atribuirEventListeners()
}

// Função que busca as locações do Apto
const buscarLocacoes = () => {

    // Busca o JWT e APTO nos cookies
    let JWT = ""
    let APTO = ""
    try{
        APTO = document.cookie
                .split("; ")
                .find(tag => tag.startsWith("APTO="))
                .split("=")[1]
        JWT = document.cookie
                    .split("; ")
                    .find(tag => tag.startsWith("JWT="))
                    .split("=")[1]
    }catch{
        console.warn("JWT não encontrado como cookie")
        return; // Retorna caso não ache
    }

    fetch(`https://alocanet-servidor.glitch.me/consultarApto/${APTO}`, {
        method: "GET",
        headers: {
            "auth": `${JWT}`
        },
        cache: "no-store"
    })
    .then(async (res) => {
        const json = await res.json()
        if(res.status.toString()[0] === "4") {  // -> Erro Prevísto
            console.error(json.message)
            alert(json.message)
        } else {                                // -> Sucesso
            // Caso haja locações, invoca seu display
            if(json.locacoes.length > 0) {
                displayLocacoes(json.locacoes)
                buscarLimiteLocacoes(json.locacoes.length)
            } else {
                console.log("Não há locações feitas")
            }           
        }
    })
    .catch((err) => {
        console.error(err)
        alert("Houve algo de errado x-x")
    })
}

// Onload da página
window.onload = buscarLocacoes

// Onclick que resulta no fechamento do <span> Cancelar </span>
// caso o usuário clique no resto da tela
window.onclick = (e) => {
    if(
        !e.target.classList.contains("botao-cancelar-locacao")  && 
            (
            !e.target.classList.contains("botao-opcoes-locacao")&&
            !e.target.parentElement.classList.contains("botao-opcoes-locacao")
            )
    ) {
        const spans = document.getElementsByClassName("botao-cancelar-locacao")
        for(let j=0; j<spans.length; j++)
            spans[j].classList.remove("aberto")
    }
}