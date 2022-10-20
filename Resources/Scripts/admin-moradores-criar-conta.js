/**
 * Script utilizado para controlar o
 * modal de criar contas, presente na página
 * de gerenciamento de moradores (Admin/moradores.html)
 */



// Função de Abrir o Modal
const abrirModalCriarConta = () => {
    const modal = document.getElementById("container-modal-criar-conta")
    modal.classList.add("aberto")

    // Atribui a função de fechar aos botões correspondentes
    document.getElementById("span-fechar-modal-criar-conta").addEventListener("click", fecharModalCriarConta)
    document.getElementById("botao-fechar-modal-criar-conta").addEventListener("click", fecharModalCriarConta)

    // Verifica o status do botão de criar de acordo com o valor do input
    const botaoCriar = document.getElementById("botao-criar-modal-criar-conta")
    const inputCriarConta = document.getElementById("input-criar-conta")
    const senhaCriarConta = document.getElementById("senha-criar-conta")
    const confirmarCriarConta = document.getElementById("confirmar-senha-criar-conta")

    // Função de validação dos inputs para tirar/colocar o disabled no botão de criar
    const validarInputs = () => {
        let validacao = 0
        inputCriarConta.value > 0 ? validacao++ : null                          //N° Apto  > 0
        senhaCriarConta.value !== "" ? validacao++ : null                       //Senha !== ""
        confirmarCriarConta.value !== "" ? validacao++ : null                   //Confirmação !== ""
        senhaCriarConta.value === confirmarCriarConta.value ? validacao++ : null//Senha === Confirmação

        // Caso todos os testes sejam verdadeiros, retira o disable do botão
        validacao === 4 ? botaoCriar.disabled = false : botaoCriar.disabled = true
    }

    // Atribui a função de validar no evento "input" dos três <input>s
    inputCriarConta.addEventListener("input", validarInputs)
    senhaCriarConta.addEventListener("input", validarInputs)
    confirmarCriarConta.addEventListener("input", validarInputs)

    // EventListener para atribuir a função de criação de conta
    botaoCriar.addEventListener("click", () => criarConta([inputCriarConta, senhaCriarConta, confirmarCriarConta], inputCriarConta.value, senhaCriarConta.value))
}

// Função de Fechar o Modal
const fecharModalCriarConta = () => {
    const modal = document.getElementById("container-modal-criar-conta")
    modal.classList.remove("aberto")
}

// Atribui a função de abrir ao evento "click" do botão de criar conta
document.getElementById("botao-criar-conta").addEventListener("click", abrirModalCriarConta)


// Cria a conta de acordo com o número inserido no input
const criarConta = (inputs, numeroApto, senhaApto) => {
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

    // https://alocanet-servidor.glitch.me/novoApto
    fetch(`https://alocanet-servidor.glitch.me/novoApto`, {
        method: "POST",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "auth": `${JWT}`
        },
        body: JSON.stringify({
            numero: numeroApto,
            senha: senhaApto
        }),
        cache: "no-store"
    })
    .then(async (res) => {
        const json = await res.json()
        if(res.status.toString()[0] === "4") {  // -> Erro Prevísto
            console.error(json.message)
            alert(json.message)
        } else {                                // -> Sucesso
            inputs.forEach(input => input.value = "")
            console.log("Apartamento cadastrado")
            alert("Conta criada com sucesso!")
        }
    })
    .catch((err) => {                           // -> Erro não previsto
        console.error(err)
        alert("Houve algo de errado x-x")
    })
}