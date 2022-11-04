/**
 * Script utilizado na consulta de Aptos na tela (Admin/moradores.html)
 */

const popularModal = (locacoes, cancelamentos) => {
    const containerItens = document.getElementsByClassName("container-itens-historico")[0]
    containerItens.style.opacity = "0"

    let index = 1
    let locacoesHTML = ""
    locacoes.forEach(item => {
        const anoItem = item.data.split("/")[2]
        const mesItem = item.data.split("/")[1]
        const diaItem = item.data.split("/")[0]
        const dataItem = new Date(anoItem, (mesItem-1), diaItem).getTime()

        const anoCriado = item.createdAt.split("-")[0]
        const mesCriado = item.createdAt.split("-")[1]
        const diaCriado = item.createdAt.split("-")[2].split("T")[0]
        const dataCriado = `${diaCriado}/${mesCriado}/${anoCriado}`
        locacoesHTML += `
        <li class="item-historico ${dataItem <= new Date().getTime() ? "concluido" : ""}">
            <span>${index}&nbsp;&nbsp;•&nbsp;&nbsp;</span>
            <div class="container-historico">
                <div class="container-historico-superior">
                    <p>${item.data}</p>
                    <p>R$${item.valor},00</p>
                </div>
                <div class="container-historico-meio">${item.espaco}</div>
                <div class="container-historico-inferior">
                    ${dataItem <= new Date().getTime() ? "Concluído em" : "Desde"} ${dataCriado}
                    </div>
            </div>
        </li>
        `
        index++
    });

    let cancelamentosHTML = ""
    cancelamentos.forEach(item => {
        const anoCriado = item.createdAt.split("-")[0]
        const mesCriado = item.createdAt.split("-")[1]
        const diaCriado = item.createdAt.split("-")[2].split("T")[0]
        const dataCriado = `${diaCriado}/${mesCriado}/${anoCriado}`
        cancelamentosHTML += `
        <li class="item-historico cancelado">
            <span>${index}&nbsp;&nbsp;•&nbsp;&nbsp;</span>
            <div class="container-historico">
                <div class="container-historico-superior">
                    <p>${item.data}</p>
                    <p>R$${item.valor},00</p>
                </div>
                <div class="container-historico-meio">${item.espaco}</div>
                <div class="container-historico-inferior">Cancelado em ${dataCriado}</div>
            </div>
        </li>
        `
        index++
    });

    containerItens.innerHTML = (locacoesHTML + cancelamentosHTML)
    containerItens.style.opacity = "1"
}

const consultarApto = (apto) => {
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

    // https://alocanet-servidor.glitch.me/#api-Apartamentos-consultarAptoPorNumero
    fetch(`https://alocanet-servidor.glitch.me/consultarApto/${apto}`, {
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
            if(json.locacoes.length + json.cancelamentos.length > 0)
                popularModal(json.locacoes, json.cancelamentos)
            else
                console.log("Esse apartamento não possúi histórico ainda")
        }
    })
    .catch((err) => {                           // -> Erro não previsto
        console.error(err)
        alert("Houve algo de errado x-x")
    })
}

const fecharModalConsultarConta = () => {
    const modal = document.getElementById("container-modal-consultar-conta")
    modal.classList.remove("aberto")
}

const abrirModalConsultarConta = (apto) => {
    const modal = document.getElementById("container-modal-consultar-conta")

    document.getElementById("botao-fechar-modal-consultar-conta").onclick = fecharModalConsultarConta
    document.getElementById("span-fechar-modal-consultar-conta").onclick = fecharModalConsultarConta

    const h2 = modal.children[0].children[2]
    h2.innerHTML = `Apartamento ${apto}`

    consultarApto(apto)

    modal.classList.add("aberto")
}

const inputNumApto = document.getElementById("input-n-apto")
const btnConsultarApto = document.getElementById("botao-consultar-conta")

inputNumApto.addEventListener("input", ()=>{
    const nApto = inputNumApto.value
    if(nApto > 0) {
        btnConsultarApto.disabled = false
    } else {
        btnConsultarApto.disabled = true
    }
})

btnConsultarApto.addEventListener("click", () => {abrirModalConsultarConta(inputNumApto.value)})

