/**
 * Script referente ao controlador do modal
 * de modificação de espaços do painel Admin
 * (Admin/espacos.html)
 */

// Função que fecha o modal
const fecharModalModificarEspaco = () => {
    const modal = document.getElementById("container-modal-modificar-espaco")
    modal.classList.remove("aberto")
}

// Função que modifica os dados do espaço
const modificarEspaco = (objectId, novoNome, novoValor) => {
    // Busca JWT nos Cookies
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

    // https://alocanet-servidor.glitch.me/#api-Espaos-modificarSenhaById
    fetch(`https://alocanet-servidor.glitch.me/modificarEspaco/${objectId}`, {
        method: "PUT",
        headers: {
            "auth": `${JWT}`,
            "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
            nome: novoNome ? novoNome : "",
            valor: novoValor ? novoValor : "",
        }),
        cache: "no-store"
    })
    .then(async (res) => {
        const json = await res.json()
        if(res.status.toString()[0] === "4") {  // -> Erro Prevísto
            console.error(json.message)
            alert(json.message)
        } else {                                // -> Sucesso
            console.log("Alterações salvas")
            alert("Alterações salvas com sucesso!")
            fecharModalModificarEspaco()
            location.reload()
        }
    })
    .catch((err) => {                           // -> Erro não previsto
        console.error(err)
        alert("Houve algo de errado x-x")
    })
}

// Função que abre o modal
const abrirModalModificarEspaco = (objectId, nomeAtual, valorAtual) => {
    const modal = document.getElementById("container-modal-modificar-espaco")
    const botaoFechar = document.getElementById("botao-fechar-modal-modificar-espaco")
    const spanFechar = document.getElementById("span-fechar-modal-modificar-espaco")
    const botaoSalvar = document.getElementById("botao-modificar-modal-modificar-espaco")

    // Atribui a função de fechar o modal
    botaoFechar.onclick = fecharModalModificarEspaco
    spanFechar.onclick = fecharModalModificarEspaco

    // Popula o HTML do modal com os detalhes do espaço
    const detalhesEspaco = document.getElementById("modal-modificar-espaco").children[2]
    detalhesEspaco.innerHTML = `
    <p>Nome Atual: <span>${nomeAtual}</span></p>
    <p>Valor Atual: <span>${valorAtual}</span></p>
    `

    // Atribui uma verificação para casos onde o botão de salvar é disabilitado
    const inputNome = document.getElementById("nome-modificar-espaco")
    const inputValor = document.getElementById("valor-modificar-espaco")
    const validarInputs = () => {
        if ((inputValor.value !== "" && inputValor.value < 0) || inputNome.value + inputValor.value === "" )
            botaoSalvar.disabled = true
        else 
            botaoSalvar.disabled = false
    }
    inputNome.oninput = validarInputs
    inputValor.oninput = validarInputs

    // Atribui a função de salvar modificações
    botaoSalvar.onclick = () => { modificarEspaco(objectId, inputNome.value, inputValor.value) }

    modal.classList.add("aberto")
}

// Busca todos os botões "Modificar" e atribui a func. de abrir modal p/ o evento "click"
const atribuir_abrirModalModificar = () => {
    const botoesAbrirModalExcluir = document.getElementsByClassName("modificar-espaco")
    for(let i = 0; i<botoesAbrirModalExcluir.length; i++)
    {
        const botao = botoesAbrirModalExcluir[i]
        // Busca os dados salvos como atributos no HTML
        const objectIdEspaco = botao.getAttribute("objectId")
        const nomeEspaco = botao.getAttribute("nome")
        const valorEspaco = botao.getAttribute("valor")
        // Adiciona o eventlistener
        botao.addEventListener("click", () => abrirModalModificarEspaco(objectIdEspaco, nomeEspaco, valorEspaco))
    }
}

setTimeout(atribuir_abrirModalModificar, 1000)