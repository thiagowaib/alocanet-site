/**
 * Script utilizado para controlar o
 * modal de excluir contas, presente na página
 * de gerenciamento de moradores (Admin/moradores.html)
 */



// Função de Abrir o Modal
const abrirModalExcluirConta = () => {
    const modal = document.getElementById("container-modal-excluir-conta")
    modal.classList.add("aberto")

    // Atribui a função de fechar aos botões correspondentes
    document.getElementById("span-fechar-modal-excluir-conta").addEventListener("click", fecharModalExcluirConta)
    document.getElementById("botao-fechar-modal-excluir-conta").addEventListener("click", fecharModalExcluirConta)

    // Verifica o status do botão de excluir de acordo com o valor do input
    const botaoExcluir = document.getElementById("botao-excluir-modal-excluir-conta")
    const inputExcluirConta = document.getElementById("input-excluir-conta")
    inputExcluirConta.addEventListener("input", () => {
        if(inputExcluirConta.value > 0)     // -> Se o número for > 0: Botão Enabled
            botaoExcluir.disabled = false   // ~
        else                                // -> Se o número for <= 0: Botão Disabled
            botaoExcluir.disabled = true    // ~
    })

    // EventListener para atribuir a função de exclusão de conta
    botaoExcluir.addEventListener("click", () => excluirConta(inputExcluirConta, inputExcluirConta.value))
}

// Função de Fechar o Modal
const fecharModalExcluirConta = () => {
    const modal = document.getElementById("container-modal-excluir-conta")
    modal.classList.remove("aberto")
}

// Atribui a função de abrir ao evento "click" do botão de excluir conta
document.getElementById("botao-excluir-conta").addEventListener("click", abrirModalExcluirConta)


// Exclui a conta de acordo com o número inserido no input
const excluirConta = (input, numApto) => {
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

    // https://alocanet-servidor.glitch.me/#api-Apartamentos-removerAptoPorNumero
    fetch(`https://alocanet-servidor.glitch.me/removerApto/${numApto}`, {
        method: "DELETE",
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
            input.value = ""
            console.log("Apartamento descadastrado")
            alert("Conta excluida com sucesso!")
        }
    })
    .catch((err) => {                           // -> Erro não previsto
        console.error(err)
        alert("Houve algo de errado x-x")
    })
}
