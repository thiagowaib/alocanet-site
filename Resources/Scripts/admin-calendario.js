/**
 * Script utilizado no funcionamento do
 * calendáro da página de agendamentos (Admin)
 */


// Abrir Modal de Detalhes
const abrirModal = (data) => {
    const modal = document.getElementsByClassName("container-modal-detalhes")[0]
    modal.classList.add("aberto")

    // Adiciona os EventListeners para fechar o modal quando necessário
    document.getElementById("span-fechar-modal").addEventListener("click", fecharModal)
    document.getElementById("botao-fechar-modal").addEventListener("click", fecharModal)

    // Indica a data em questão no cabeçalho do modal
    const dataModal = modal.children[0].children[1].children[1]
    dataModal.innerHTML = data
    // Busca as Locações no Banco de Dados e Popula o Modal
    buscarLocacoes(data)
} 
// Fechar Modal de Detalhes
const fecharModal = () => {
    const containerLocacoes = document.getElementById("container-locacoes")
    containerLocacoes.style.opacity = "0"

    const modal = document.getElementsByClassName("container-modal-detalhes")[0]
    modal.classList.remove("aberto")
}

// Popular o modal com as locações
const popularModalDetalhes = (dados) => {
    const containerLocacoes = document.getElementById("container-locacoes")
    let locacoesHTML = ""
    for(let i = 0; i<dados.length; i++) 
    {
        const locacao = dados[i]

        locacoesHTML +=`
            <div class="locacao">
                <div class="cabecalho-locacao">
                    <h1>${locacao.espaco}</h1>
                    <img src="../../Resources/Images/imagem-locacao.png" alt="Salão de Festa">
                </div>
                <div class="corpo-locacao">
                    <p>Apartamento: <span>${locacao.apto}</span></p>
                    <p>Alugado Desde: <span>${locacao.desde}</span></p>
                    <p>Valor na Locação: <span>${locacao.valor}</span></p>
                </div>
            </div>
            `
    }
    containerLocacoes.innerHTML = locacoesHTML
    containerLocacoes.style.opacity = "1"
}

// Busca as Locações no Banco de Dados
const buscarLocacoes = (data) => {
    let JWT = ""
    try{
        // Busca o JWT salvo em cookie
        JWT = document.cookie
            .split("; ")
            .find(tag => tag.startsWith("JWT="))
            .split("=")[1]
    }catch{
        console.warn("JWT não encontrado como cookie")
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
            dataDesejada: data
        })
    })
    .then(async (res) => {
        const json = await res.json()
        if(res.status.toString()[0] === "4") {  // -> Erro Prevísto
            console.error(json.message)
            alert(json.message)
        } else {                                // -> Sucesso
            json.dados.length > 0 ? popularModalDetalhes(json.dados) : null;
        }
    })
    .catch((err) => {                           // -> Erro não previsto
        console.error(err)
        alert("Houve algo de errado x-x")
    })
}


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
            buscarDatas()
            // Formata data de YYYY-MM-DD -> DD/MM/YYYY
            const data = e.target.getAttribute("data-calendar-day")
            const dia = data.split("-")[2]
            const mes = data.split("-")[1]
            const ano = data.split("-")[0] 
            const dataFormatada = `${dia}/${mes}/${ano}`
            
            // Abre o Modal (Overlay) de detalhes
            abrirModal(dataFormatada)
        },

        clickMonth() {
            buscarDatas()
        },

        clickYear() {
            buscarDatas()
        },
    }
}).init()

// Chamado caso hajam datas sem locações
const apagarDias = (datas) => {
    
    // Formata datas de DD/MM/YYYY -> YYYY-MM-DD
    datas = datas.map(data => {
        const dia = data.split("/")[0]
        const mes = data.split("/")[1]
        const ano = data.split("/")[2]

        return `${ano}-${mes}-${dia}`
    })
    
    // Para todo dia, verifíca se há locações e modifica sua classe de acordo
    const dias = document.getElementsByClassName("vanilla-calendar-day__btn")
    for(let i = 0; i < dias.length; i++)
    {
        const dia = dias[i]

        if(datas.includes(dia.getAttribute("data-calendar-day"))) {
            dia.disabled = false
            dia.classList.add("com-locacao")
        } else {
            dia.disabled = true
            dia.classList.remove("com-locacao")
        }
    }
}

// Busca datas em que existem locações ao carregar a página
const buscarDatas = () => {

    let JWT = ""
    try{
        // Busca o JWT salvo em cookie
        JWT = document.cookie
            .split("; ")
            .find(tag => tag.startsWith("JWT="))
            .split("=")[1]
    }catch{
        console.warn("JWT não encontrado como cookie")
        return;                     // -> Caso não haja JWT, a função já retorna
    }

    // https://alocanet-servidor.glitch.me/#api-Usurios-buscarDatas
    fetch("https://alocanet-servidor.glitch.me/buscarDatas//", {
        method: "GET",
        headers: {
            "auth": `${JWT}`
        }
    })
    .then(async (res) => {
        const json = await res.json()
        if(res.status.toString()[0] === "4") {  // -> Erro Prevísto
            console.error(json.message)
            console.log(`${JWT}`)
            // alert(json.message)
        } else {                                // -> Sucesso
            json.datas.length > 0 ? apagarDias(json.datas) : null;
        }
    })
    .catch((err) => {                           // -> Erro não previsto
        console.error(err)
        alert("Houve algo de errado x-x")
    })
}

window.onload = buscarDatas
