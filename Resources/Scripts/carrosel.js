/**
 * Script Utilizado para realizar o funcionamento de um carrosel de imagens
 */

// Retorna um array de elementos <div></div> (Imagens do Carrosel)
const slides = document.getElementsByClassName("carrosel-slide")

let transicao = 3000            // -> Duração da transição em milisegundos entre imagens
const interval = 5000           // -> Intervalo em milisegundos para alternar imagens
let atual = 0                   // -> Index do Slide Atual
const max = slides.length -1    // -> Index máximo

// Define a opacidade de todos os slides para 0 (Exceto o inicial)
// Além de atribuir o tempo de duração da transição
for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    if(i !== 0) slide.style.opacity = 0
    slide.style.transition = `opacity ${transicao}ms`
}

// Executa uma função a cada intervalo de tempo, trocando a imagem em exposição
if(max > 0) {
    setInterval(() => {
        if(atual < max) {       // -> Caso esteja antes do final
            slides[atual + 1].style.opacity = 1
            slides[atual].style.opacity = 0
            atual++
        } else {                // -> Caso atinja o final
            slides[0].style.opacity = 1
            slides[atual].style.opacity = 0
            atual = 0
        }
    }, (interval+transicao))
}