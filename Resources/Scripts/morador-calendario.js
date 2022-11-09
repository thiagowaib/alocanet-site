/**
 * Script utilizado no funcionamento do
 * calendáro (Morador)
 */

// Instancia um novo calendário em <div id="calendar"></div>
const calendar = new VanillaCalendar("#calendar", {
    settings: {
        lang: 'pt-br',
        selection: {
            day: 'single',
            time: false,
        },
        visibility: {
            today: true,
        }
    },
    actions: {
        clickDay(e) {

            setTimeout(apagarDias, 750)
            // Formata data de YYYY-MM-DD -> DD/MM/YYYY
            const data = e.target.getAttribute("data-calendar-day")
            const dia = data.split("-")[2]
            const mes = data.split("-")[1]
            const ano = data.split("-")[0] 
            const dataFormatada = `${dia}/${mes}/${ano}`


            abrirModalConfirmacao(dataFormatada)
        },

        clickMonth() {
            setTimeout(apagarDias, 750)
        },

        clickYear() {
            setTimeout(apagarDias, 750)
        },
    }
}).init()

// Função que apaga dias que estão no passado
const apagarDias = () => {
    // Para todo dia, verifíca se há locações e modifica sua classe de acordo
    const dias = document.getElementsByClassName("vanilla-calendar-day__btn")
    for(let i = 0; i < dias.length; i++)
    {
        const dia = dias[i]

        // Ler a Data
        const hoje = dia.getAttribute("data-calendar-day")  // Formato YYYY-MM-DD

        // Formatar a Data
        const anoHoje = hoje.split("-")[0]
        const mesHoje = hoje.split("-")[1]
        const diaHoje = hoje.split("-")[2]

        // Criar um objeto Date
        const dataHoje = new Date(parseInt(anoHoje), parseInt(mesHoje) - 1, parseInt(diaHoje))
        // Comparar a Data
        if(dataHoje.getTime() < new Date().getTime()) {
            // Atribuir Classe
            dia.disabled = true
            dia.classList.add("passado")
        } else {
            // Remover Classe
            dia.disabled = false
            dia.classList.remove("passado")
        }
    }
}


//** Script utilizado no Modal de Confirmação */
// Abrir Modal de Confirmação
const abrirModalConfirmacao = (data) => {
    const modal = document.getElementsByClassName("container-modal-confirmacao")[0]
    modal.classList.add("aberto")

    // Adiciona os EventListeners para fechar o modal quando necessário
    document.getElementById("span-fechar-modal-confirmacao").addEventListener("click", fecharModalConfirmacao)
    document.getElementById("botao-fechar-modal-confirmacao").addEventListener("click", fecharModalConfirmacao)
    const botaoAgendar = document.getElementById("botao-agendar-modal-confirmacao")
    const inputs = document.getElementsByClassName("inputSelecionar")
    botaoAgendar.disabled = true

    botaoAgendar.addEventListener('click', () => {
        let idEspaco = ""

        for(let i = 0; i < inputs.length ; i++)
            if(inputs[i].checked) idEspaco = inputs[i].value
            
        agendar(data, idEspaco)
    })
    // Busca as Locações no Banco de Dados e Popula o Modal
    buscarLocacoes(data)
} 
// Fechar Modal de Confirmação
const fecharModalConfirmacao = () => {
    const containerLocacoes = document.getElementById("container-locacoes")
    containerLocacoes.style.opacity = "0"

    const modal = document.getElementsByClassName("container-modal-confirmacao")[0]
    modal.classList.remove("aberto")
}

// Popular o modal com as locações
const popularModalConfirmacao = (espacos = [], numeroApto = 0, data = "", dados = {}) => {

    // Popular Detalhes da Locação
    document.getElementById("apto-modal").innerHTML = `Apartamento: <span>${numeroApto}</span>`   // Número do Apto
    document.getElementById("data-modal").innerHTML = `Data: <span>${data}</span>`          // Data da Locação

    // Quantidade de Locações possíveis (com base no limite)
    if(dados !== null) {
        if(dados.numeroLocacoes < dados.limiteLocacoes) {
            document.getElementById("limite-modal").innerHTML = `Você já tem <span>${dados.numeroLocacoes}</span> de <span>${dados.limiteLocacoes}</span> locações ativas`
        } else {
            document.getElementById("limite-modal").innerHTML = `Você já atingiu o seu limite de ${dados.limiteLocacoes} locações ativas simultâneas.`
            return;
        }
    }
    document.getElementById("container-detalhes").style.opacity = "1"

    const containerLocacoes = document.getElementById("container-locacoes")
    let espacosHTML = ""
    for(let i = 0; i<espacos.length; i++) 
    {
        const espaco = espacos[i]

        espacosHTML +=`
        <div class="locacao">
            <input class="inputSelecionar" type="radio" name="radio" id="radio1" value="${espaco.espacoId}" ${espaco.disponivel?"":"disabled"}/>
            <div class="cabecalho-locacao ${espaco.disponivel?"":"alugado"}">
                <label>${espaco.nome}</label>
                <img src="../../Resources/Images/imagem-locacao.png" alt="Salão de Festa">
            </div>
            <div class="corpo-locacao">
                <h2 class="${espaco.disponivel?"":"alugado"}">${espaco.disponivel?"DISPONÍVEL":"ALUGADO"}</h2>
                <h3>R$ ${parseInt(espaco.valor)},00</h3>
            </div>
        </div>
        `
    }
    containerLocacoes.innerHTML = espacosHTML
    containerLocacoes.style.opacity = "1"

    const botaoAgendar = document.getElementById("botao-agendar-modal-confirmacao")
    const inputs = document.getElementsByClassName("inputSelecionar")
    for(let i=0; i<inputs.length; i++){
        inputs[i].addEventListener("input", ()=>{
            let checked = false
            for(let e=0; e<inputs.length; e++)
                if(inputs[e].checked)
                    checked = true
            checked ? botaoAgendar.disabled = false: botaoAgendar.disabled = true
        })
    }
}

// Busca as Locações no Banco de Dados
const buscarLocacoes = (data) => {
    // Busca o JWT e APTO dos cookies
    let JWT = ""
    let APTO = ""
    try{
        // Busca o JWT salvo em cookie
        JWT = document.cookie
            .split("; ")
            .find(tag => tag.startsWith("JWT="))
            .split("=")[1]

        // Busca o APTO salvo em cookie
        APTO = document.cookie
            .split("; ")
            .find(tag => tag.startsWith("APTO="))
            .split("=")[1]
    }catch{
        console.warn("JWT ou APTO não encontrados como cookie")
        return;                     // -> Caso não haja JWT, a função já retorna
    }

    // https://alocanet-servidor.glitch.me/#api-Usurios-buscarDetalhes
    fetch("https://alocanet-servidor.glitch.me/buscarDetalhes//", {
        method: "POST",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "auth": `${JWT}`
        },
        body: JSON.stringify({
            dataDesejada: data,
            numeroApto: APTO
        }),
        cache: "no-store"
    })
    .then(async (res) => {
        const json = await res.json()
        if(res.status.toString()[0] === "4") {  // -> Erro Prevísto
            console.error(json.message)
            alert(json.message)
        } else {                                // -> Sucesso
            popularModalConfirmacao(json.espacos, APTO, data, json.dados)
            
        }
    })
    .catch((err) => {                           // -> Erro não previsto
        console.error(err)
        alert("Houve algo de errado x-x")
    })
}

const agendar = (data, idEspaco) => {
     // Busca o JWT e APTO dos cookies
     let JWT = ""
     let APTO = ""
     try{
         // Busca o JWT salvo em cookie
         JWT = document.cookie
             .split("; ")
             .find(tag => tag.startsWith("JWT="))
             .split("=")[1]
 
         // Busca o APTO salvo em cookie
         APTO = document.cookie
             .split("; ")
             .find(tag => tag.startsWith("APTO="))
             .split("=")[1]
     }catch{
         console.warn("JWT ou APTO não encontrados como cookie")
         return;                     // -> Caso não haja JWT, a função já retorna
     }

    fetch("https://alocanet-servidor.glitch.me/alocar//", {
        method: "POST",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "auth": `${JWT}`
        },
        body: JSON.stringify({
            data: data,
            apartamento: APTO,
            espacoId: idEspaco
        }),
        cache: "no-store"
    })
    .then(async (res) => {
        const json = await res.json()
        if(res.status.toString()[0] === "4") {  // -> Erro Prevísto
            console.error(json.message)
            alert(json.message)
        } else {                                // -> Sucesso
            alert(json.message)
            console.log(json.message)
            fecharModalConfirmacao()
        }
    })
    .catch((err) => {                           // -> Erro não previsto
        console.error(err)
        alert("Houve algo de errado x-x")
    })
}
window.onload = apagarDias