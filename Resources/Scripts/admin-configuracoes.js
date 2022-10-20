/**
 * Script utilizado no funcionamento da
 * edição de configurações (Admin)
 */
 let parametrosDefault = {
    minDiasAlocar: 0,
    maxDiasAlocar: 0,
    minDiasCancelar: 0,
    maxDiasCancelar: 0,
    limiteLocacoes: 0,
}

const botaoEditar = document.getElementById("botao-editar-configs")
const containerBotoesEdicao = document.getElementById("container-botoes-edicao")
const botaoCancelar = document.getElementById("botao-cancelar-edicao")
const botaoSalvar = document.getElementById("botao-salvar-edicao")

const inputs = document.getElementsByClassName("input-config")
const inputMinLocacao = document.getElementById("input-min-locacao")
const inputMaxLocacao = document.getElementById("input-max-locacao")
const inputMinCancelamento = document.getElementById("input-min-cancelamento")
const inputMaxCancelamento = document.getElementById("input-max-cancelamento")
const inputLimiteLocacoes = document.getElementById("input-limite-locacoes")

// Disable no botão de salvar caso algum dos campos seja inválido
for(let i = 0; i<inputs.length; i++)
{
    const input = inputs[i]
    input.addEventListener("input", () => {
        input.value < 0 ? botaoSalvar.disabled = true : botaoSalvar.disabled = false
    })
}

// Habilitar Alterações
botaoEditar.addEventListener("click", () => {
    // Realiza a troca dos botões
    containerBotoesEdicao.classList.add("mostrar")
    botaoEditar.classList.remove("mostrar")

    for(let i = 0; i<inputs.length; i++)
    {
        const input = inputs[i]
        input.disabled = false
    }
})

// Cancelar Alterações
botaoCancelar.addEventListener("click", () => {
    // Define os valores dos inputs
    inputMinLocacao.value = parametrosDefault.minDiasAlocar
    inputMaxLocacao.value = parametrosDefault.maxDiasAlocar
    inputMinCancelamento.value = parametrosDefault.minDiasCancelar
    inputMaxCancelamento.value = parametrosDefault.maxDiasCancelar
    inputLimiteLocacoes.value = parametrosDefault.limiteLocacoes

    for(let i = 0; i<inputs.length; i++)
    {
        const input = inputs[i]
        input.disabled = true
    }

    containerBotoesEdicao.classList.remove("mostrar")
    botaoEditar.classList.add("mostrar")
})

// Salvar alterações
botaoSalvar.addEventListener("click", () => {
    if(parametrosDefault.minDiasAlocar !== inputMinLocacao.value) 
        modificarParametro("minDiasAlocar", inputMinLocacao.value)
    if(parametrosDefault.maxDiasAlocar !== inputMaxLocacao.value) 
        modificarParametro("maxDiasAlocar", inputMaxLocacao.value)
    if(parametrosDefault.minDiasCancelar !== inputMinCancelamento.value) 
        modificarParametro("minDiasCancelar", inputMinCancelamento.value)
    if(parametrosDefault.maxDiasCancelar !== inputMaxCancelamento.value) 
        modificarParametro("maxDiasCancelar", inputMaxCancelamento.value)
    if(parametrosDefault.limiteLocacoes !== inputLimiteLocacoes.value) 
        modificarParametro("limiteLocacoes", inputLimiteLocacoes.value)

    for(let i = 0; i<inputs.length; i++)
    {
        const input = inputs[i]
        input.disabled = true
    }

    containerBotoesEdicao.classList.remove("mostrar")
    botaoEditar.classList.add("mostrar")
})

// Modifica um dado parametro
const modificarParametro = (parametro, valor) => {
    // Faz a busca do JWT nos cookies
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

    // https://alocanet-servidor.glitch.me/#api-Parmetros-modificarParametro
    fetch(`https://alocanet-servidor.glitch.me/modificarParametro/${parametro}/${valor}/`, {
        method: "PUT",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "auth": `${JWT}`
        },
        cache: "no-store"
    })
    .then(async (res) => {
        const json = await res.json()

        if(res.status.toString()[0] === "4") {  // -> Erro Prevísto
            if(parametro === "minDiasAlocar")   inputMinLocacao.value = parametrosDefault.minDiasAlocar
            if(parametro === "maxDiasAlocar")   inputMaxLocacao.value = parametrosDefault.maxDiasAlocar
            if(parametro === "minDiasCancelar")   inputMinCancelamento.value = parametrosDefault.minDiasCancelar
            if(parametro === "maxDiasCancelar")   inputMaxCancelamento.value = parametrosDefault.maxDiasCancelar
            if(parametro === "limiteLocacoes")   inputLimiteLocacoes.value = parametrosDefault.limiteLocacoes
            console.error(json.message)
            alert(json.message)
        } else {                                // -> Sucesso
            if(parametro === "minDiasAlocar")   parametrosDefault.minDiasAlocar = valor
            if(parametro === "maxDiasAlocar")   parametrosDefault.maxDiasAlocar = valor
            if(parametro === "minDiasCancelar")   parametrosDefault.minDiasCancelar = valor
            if(parametro === "maxDiasCancelar")   parametrosDefault.maxDiasCancelar = valor
            if(parametro === "limiteLocacoes")   parametrosDefault.limiteLocacoes = valor

            console.info(`Parametro '${parametro}' salvo com sucesso!`)
        }
    })
    .catch((err) => {                           // -> Erro não previsto
        console.error(err)
        alert("Houve algo de errado x-x")
    })
}


// Poupla os inputs e parametrosDefault com os parametros buscados
const popularInputs = (parametros) => {
    // Define os parametrosDefault
    parametrosDefault.minDiasAlocar = parametros.minDiasAlocar
    parametrosDefault.maxDiasAlocar = parametros.maxDiasAlocar
    parametrosDefault.minDiasCancelar = parametros.minDiasCancelar
    parametrosDefault.maxDiasCancelar = parametros.maxDiasCancelar
    parametrosDefault.limiteLocacoes = parametros.limiteLocacoes

    // Define os valores dos inputs
    inputMinLocacao.value = parametros.minDiasAlocar
    inputMaxLocacao.value = parametros.maxDiasAlocar
    inputMinCancelamento.value = parametros.minDiasCancelar
    inputMaxCancelamento.value = parametros.maxDiasCancelar
    inputLimiteLocacoes.value = parametros.limiteLocacoes

    document.getElementsByClassName("container-conteudo")[0].style.opacity = "1"
}

// Realiza a busca dos parâmetros no servidor p/ popular os inputs
const buscaParametros = () => {
    // Faz a busca do JWT nos cookies
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

    // https://alocanet-servidor.glitch.me/#api-Parmetros-buscarParametros
    fetch("https://alocanet-servidor.glitch.me/buscarParametros/", {
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
            popularInputs(json)
        }
    })
    .catch((err) => {                           // -> Erro não previsto
        console.error(err)
        alert("Houve algo de errado x-x")
    })
}

window.onload = buscaParametros