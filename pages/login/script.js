import { APILogin, APICheckAdmin } from "../../scripts/requests.js";
import { toast } from "../../scripts/toasty.js";

function activateMenuMobile(){
    let btnMenu = document.querySelector('.btn-menu')
    let dropMenu = document.querySelector('.drop-menu')

    btnMenu.addEventListener('click', () => {
        dropMenu.classList.toggle('hide')
    })
}
activateMenuMobile()

function login() {
    let loginBtn = document.querySelector('#loginBtn')
    loginBtn.addEventListener('click', async () => {
        let formEmail = document.querySelector('#email').value
        let formPswrd = document.querySelector('#password').value

        let loginInfo = {
            email: formEmail,
            password: formPswrd,
        }
        console.log(loginInfo);

        try{
            let responseLogin = await APILogin(loginInfo)
            console.log(responseLogin);
            if(responseLogin.token){
                localStorage.setItem('token', responseLogin.token)

                let responseADMIN = await APICheckAdmin(responseLogin.token)
                
                localStorage.setItem('admin', responseADMIN.is_admin);

                if(responseADMIN.is_admin){
                    toast('Sucesso!', 'Login realizado como ADMINISTRADOR')
                    
                    setTimeout(() => {
                        window.location.replace('../adminDashboard/index.html')
                    }, 4000)
                    
                } else {
                    toast('Sucesso!', 'Login realizado como USUÁRIO')
                    
                    setTimeout(() => {
                        window.location.replace('../userDashboard/index.html')
                    }, 4000)

                }
                
            } else {
                toast('Erro!', responseLogin.error)
                
            }
        } catch {
            toast('Erro!', 'Algo deu errado com a sua requisição, por favor, tente novamente mais tarde.')

        }
    })
}
login()