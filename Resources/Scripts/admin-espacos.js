/**
 * Script que realiza a busca dos espaços
 * através da API AlocaNet, e popula a página
 * Admin/espacos.html com os cards dos espaços
 */

// Função que popula o HTML com os dados buscados
const popularEspacos = (espacos) => {
    // [{id, nome, valor}, {id, nome, valor}, {id, nome, valor}]
    let espacosHTML = ""

    for(let i = 0; i<espacos.length; i++)
    {
        const espaco = espacos[i]

        espacosHTML +=  `
        <div class="espaco" id="espaco-${i}">
            ${espaco.nome}
            <div class="container-opcoes-espaco">
                <button type="button" class="modificar-espaco" id="modificar-espaco-${i}" objectId="${espaco.id}" valor="${espaco.valor}" nome="${espaco.nome}"> Modificar </button>
                <button type="button" class="excluir-espaco" id="excluir-espaco-${i}" objectId="${espaco.id}" valor="${espaco.valor}" nome="${espaco.nome}"> Excluir </button>
            </div>
        </div> 
        `
    }

    const containerEspacos = document.getElementsByClassName("container-espacos")[0]
    containerEspacos.innerHTML = espacosHTML
    containerEspacos.style.opacity = "1";

}
// Função que realiza a busca dos espaços
const buscarEspacos = () => {

    // Tentar ler o JWT dos Cookies da página
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

    // https://alocanet-servidor.glitch.me/#api-Espaos-buscarEspacos
    fetch(`https://alocanet-servidor.glitch.me/buscarEspacos`, {
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
            json.length > 0 ? popularEspacos(json) : null
        }
    })
    .catch((err) => {                           // -> Erro não previsto
        console.error(err)
        alert("Houve algo de errado x-x")
    })
}

// Atribui a Função da busca ao evento "onload" da página (window)
window.onload = buscarEspacos