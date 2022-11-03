function toast(title, messagem){
    const body = document.querySelector('body')
    
    const container = document.createElement('div')
    container.classList.add('toast-container')
    
    if(title === 'Sucesso!'){
        container.classList.add('successToast')
    } else if (title === 'Erro!'){
        container.classList.add('erroToast')
    }

    const textContainer = document.createElement('div')

    const h3 = document.createElement('h3')
    h3.innerText = title

    const span = document.createElement('span')
    span.innerText = messagem

    textContainer.append(h3, span)

    container.append(textContainer)
    body.appendChild(container)
}

export {toast}