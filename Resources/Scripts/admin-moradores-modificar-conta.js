/**
 * Script utilizado para controlar o
 * modal de modificar contas, presente na página
 * de gerenciamento de moradores (Admin/moradores.html)
 */



// Função de Abrir o Modal
const abrirModalModificarConta = () => {
    const modal = document.getElementById("container-modal-modificar-conta")
    modal.classList.add("aberto")

    // Atribui a função de fechar aos botões correspondentes
    document.getElementById("span-fechar-modal-modificar-conta").addEventListener("click", fecharModalModificarConta)
    document.getElementById("botao-fechar-modal-modificar-conta").addEventListener("click", fecharModalModificarConta)

    // Verifica o status do botão de salvar de acordo com o valor do input
    const botaoModificar = document.getElementById("botao-salvar-modal-modificar-conta")
    const inputModificarConta = document.getElementById("input-modificar-conta")
    const senhaModificarConta = document.getElementById("senha-modificar-conta")
    const confirmarModificarConta = document.getElementById("confirmar-senha-modificar-conta")

    // Função de validação dos inputs para tirar/colocar o disabled no botão de modificar
    const validarInputs = () => {
        let validacao = 0
        inputModificarConta.value > 0 ? validacao++ : null                          //N° Apto  > 0
        senhaModificarConta.value !== "" ? validacao++ : null                       //Senha !== ""
        confirmarModificarConta.value !== "" ? validacao++ : null                   //Confirmação !== ""
        senhaModificarConta.value === confirmarModificarConta.value ? validacao++ : null//Senha === Confirmação

        // Caso todos os testes sejam verdadeiros, retira o disable do botão
        validacao === 4 ? botaoModificar.disabled = false : botaoModificar.disabled = true
    }

    // Atribui a função de validar no evento "input" dos três <input>s
    inputModificarConta.addEventListener("input", validarInputs)
    senhaModificarConta.addEventListener("input", validarInputs)
    confirmarModificarConta.addEventListener("input", validarInputs)

    // EventListener para atribuir a função de criação de conta
    botaoModificar.addEventListener("click", () => modificarConta([inputModificarConta, senhaModificarConta, confirmarModificarConta], inputModificarConta.value, senhaModificarConta.value))
}

// Função de Fechar o Modal
const fecharModalModificarConta = () => {
    const modal = document.getElementById("container-modal-modificar-conta")
    modal.classList.remove("aberto")
}

// Atribui a função de abrir ao evento "click" do botão de criar conta
document.getElementById("botao-modificar-conta").addEventListener("click", abrirModalModificarConta)


// Cria a conta de acordo com o número inserido no input
const modificarConta = (inputs, numeroApto, senhaApto) => {
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

    // https://alocanet-servidor.glitch.me/modificarSenha
    fetch(`https://alocanet-servidor.glitch.me/modificarSenha`, {
        method: "PUT",
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
            console.log("Apartamento atualizado")
            alert("Senha modificada com sucesso!")
        }
    })
    .catch((err) => {                           // -> Erro não previsto
        console.error(err)
        alert("Houve algo de errado x-x")
    })
}