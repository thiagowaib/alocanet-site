/**
 Este script será utilizado para controlar o modal de criação de espaços,
 que está escrito na tela de gerenciamento de espaço
 */

//Função de fechar o modal
const fecharModalCriarEspaco= () => {
  const modal= document.getElementById("container-modal-criar-espaco")
  modal.classList.remove("aberto")
}

// função que abre o modal
const abrirModalCriarEspaco = () => {
  const modal = document.getElementById("container-modal-criar-espaco")
  modal.classList.add("aberto")

  //Atribui a função de fechar aos botões correspondentes
  document.getElementById("fechar-modal-criar-espaco").addEventListener("click", fecharModalCriarEspaco)
  document.getElementById("botao-cancelar").addEventListener("click", fecharModalCriarEspaco)

  // Verifica o status do botão criar de acorco com o valor do input
  const botaoCriar = document.getElementById("botao-criar")
  const inputNomeEspaco = document.getElementById("nome-espaco")
  const inputValorEspaco = document.getElementById("valor-espaco")

  //Função de validação dos inputs para colocar/tirar o disabled no botão de criar
  const validarInputs = () => {
    let validacao = 0
    inputNomeEspaco.value !== "" ? validacao++ : null //nome do espaço
    inputValorEspaco.value >= 0 ? validacao++ : null //valor do espaço

    //Se os dois testes forem verdadeiros, o disable é retirado do botão
    validacao === 2 ? botaoCriar.disabled = false: botaoCriar.disabled = true
  }

  //Atribui a função de validação nos dois campos <input>
  inputNomeEspaco.addEventListener("input", validarInputs)
  inputValorEspaco.addEventListener("input", validarInputs)

  //EventListener para atribuir função de criação de espaço
  botaoCriar.addEventListener("click", ()=>{
    criarEspaco(inputNomeEspaco.value, inputValorEspaco.value, [inputNomeEspaco, inputValorEspaco])
  })}

const criarEspaco = (nome, valor, inputs) => {
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

  // https://alocanet-servidor.glitch.me/#api-Espaos-novoEspaco
  fetch(`https://alocanet-servidor.glitch.me/novoEspaco`, {
      method: "POST",
      headers: {
          "Content-type": "application/json; charset=UTF-8",
          "auth": `${JWT}`
      },
      body: JSON.stringify({
          nome: nome,
          valor: valor
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
          console.log("Espaço cadastrado")
          fecharModalCriarEspaco()
          alert("Espaço criado com sucesso!")
          location.reload()
      }
  })
  .catch((err) => {                           // -> Erro não previsto
      console.error(err)
      alert("Houve algo de errado x-x")
  })
}

//Atribui a função de criar espaço ao evento "click" do botão de criar espaço
document.getElementById("botao-novo-espaco").addEventListener("click", abrirModalCriarEspaco)

