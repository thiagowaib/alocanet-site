/**
 * Script utilizado no funcionamento do
 * calendáro (Morador)
 */

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
            setTimeout(apagarDias, 750)

            // Formata data de YYYY-MM-DD -> DD/MM/YYYY
            const data = e.target.getAttribute("data-calendar-day")
            const dia = data.split("-")[2]
            const mes = data.split("-")[1]
            const ano = data.split("-")[0] 
            const dataFormatada = `${dia}/${mes}/${ano}`
            
            // TODO: Chamar a função de abrir o modal, passando a data como parâmetro
            console.log(`Data de Hoje: ${dataFormatada}`)
        },

        clickMonth() {
            setTimeout(apagarDias, 750)
        },

        clickYear() {
            setTimeout(apagarDias, 750)
        },
    }
}).init()

// Função que apaga dias que estão no passado
const apagarDias = () => {
    // Para todo dia, verifíca se há locações e modifica sua classe de acordo
    const dias = document.getElementsByClassName("vanilla-calendar-day__btn")
    for(let i = 0; i < dias.length; i++)
    {
        const dia = dias[i]

        // Ler a Data
        const hoje = dia.getAttribute("data-calendar-day")  // Formato YYYY-MM-DD

        // Formatar a Data
        const anoHoje = hoje.split("-")[0]
        const mesHoje = hoje.split("-")[1]
        const diaHoje = hoje.split("-")[2]

        // Criar um objeto Date
        const dataHoje = new Date(parseInt(anoHoje), parseInt(mesHoje) - 1, parseInt(diaHoje))
        // Comparar a Data
        if(dataHoje.getTime() < new Date().getTime()) {
            // Atribuir Classe
            dia.disabled = true
            dia.classList.add("passado")
        } else {
            // Remover Classe
            dia.disabled = false
            dia.classList.remove("passado")
        }
    }
}

window.onload = apagarDias