/**
 * Script controlador do modal de
 * exclusão de espaço na página Admin/espacos.html
 */

// Função que fecha o modal
const fecharModalExcluirEspaco = () => {
    // Abre o modal
    const modal = document.getElementById("container-modal-excluir-espaco")
    modal.classList.remove("aberto")
}

// Função de excluir o espaço
const excluirEspaco = (objectId) => {
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

    // http://alocanet-servidor.glitch.me/#api-Espaos-removerEspacoById
    fetch(`https://alocanet-servidor.glitch.me/removerEspaco/${objectId}`, {
        method: "DELETE",
        headers: {
            "auth": `${JWT}`
        },
        cache: "no-store"
    })
    .then(async (res) => {
        console.log({res})
        const json = await res.json()
        if(res.status.toString()[0] === "4") {  // -> Erro Prevísto
            console.error(json.message)
            alert(json.message)
        } else {                                // -> Sucesso
            console.log("Espaço excluido")
            alert("Espaço excluído com sucesso!")
            fecharModalExcluirEspaco()
            location.reload()
        }
    })
    .catch((err) => {                           // -> Erro não previsto
        console.error(err)
        alert("Houve algo de errado x-x")
    })
}

// Função que abre o modal com os dados do espaço em questão
const abrirModalExcluirEspaco = (objectId, nome, valor) => {
    // Popula os dados
    document.getElementById("span-nome-espaco").innerHTML = nome
    document.getElementById("span-valor-espaco").innerHTML = `R$${valor},00`

    // Atribui as funções de fechar aos respectivos botões
    document.getElementById("span-fechar-modal-excluir-espaco")
    .addEventListener("click", fecharModalExcluirEspaco)
    document.getElementById("botao-fechar-modal-excluir-espaco")
    .addEventListener("click", fecharModalExcluirEspaco)

    // Atribui a função de excluir o espaço
    document.getElementById("botao-excluir-modal-excluir-espaco")
    .addEventListener("click", () => excluirEspaco(objectId))

    // Abre o modal
    const modal = document.getElementById("container-modal-excluir-espaco")
    modal.classList.add("aberto")
}

// Busca todos os botões "Excluir" e atribui a func. de abrir modal p/ o evento "click"
const atribuir_abrirModalExcluir = () => {
    const botoesAbrirModalExcluir = document.getElementsByClassName("excluir-espaco")
    for(let i = 0; i<botoesAbrirModalExcluir.length; i++)
    {
        const botao = botoesAbrirModalExcluir[i]
        // Busca os dados salvos como atributos no HTML
        const objectIdEspaco = botao.getAttribute("objectId")
        const nomeEspaco = botao.getAttribute("nome")
        const valorEspaco = botao.getAttribute("valor")
        // Adiciona o eventlistener
        botao.addEventListener("click", () => abrirModalExcluirEspaco(objectIdEspaco, nomeEspaco, valorEspaco))
    }
}

setTimeout(atribuir_abrirModalExcluir, 1000)