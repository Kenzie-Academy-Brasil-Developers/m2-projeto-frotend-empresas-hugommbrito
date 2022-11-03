import { APIRegisterUser } from "../../scripts/requests.js";
import { toast } from "../../scripts/toasty.js"

function activateMenuMobile(){
    let btnMenu = document.querySelector('.btn-menu')
    let dropMenu = document.querySelector('.drop-menu')

    btnMenu.addEventListener('click', () => {
        dropMenu.classList.toggle('hide')
    })
}
activateMenuMobile()

async function resgisterNewUser(){
    let registerBtn = document.querySelector('#registerBtn')
    
    registerBtn.addEventListener('click', async (e) => {
        let formName = document.querySelector('#name').value
        let formEmail = document.querySelector('#email').value
        let formPswrd = document.querySelector('#password').value
        let formLevel = document.querySelector('#levelSelect').value
        
        let newUser = {
            username: formName,
            password: formPswrd,
            email: formEmail,
            professional_level: formLevel,
        }

        try{
            let response = await APIRegisterUser(newUser) 

            if(response.uuid){
                toast('Sucesso!', 'Usuário cadastrado')

                setTimeout(() => {
                    window.location.replace('../login/index.html')
                }, 4000)

            } else {
                toast('Erro!', response.error)
            }
        } catch {
            toast('Erro!', 'Algo deu errado, tente novamente mais tarde')
        }
       
       
    })
}
resgisterNewUser()
