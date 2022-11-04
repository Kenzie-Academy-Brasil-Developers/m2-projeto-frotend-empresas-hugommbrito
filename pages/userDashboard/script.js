import { APIGetDpEmployees, APIGetLogedEmployeeInfo, APIGetLogedDpList, APIEditLogedEmployee } from "../../scripts/requestsUser.js";
import { toast } from "../../scripts/toasty.js";

function checkToken(){
    const loginToken = localStorage.getItem("token");

    (!loginToken) ? window.location.replace('../login/index.html') : ""
}
checkToken()

const token = localStorage.getItem('token')

async function renderUserInfo() {
    let infoContainer = document.querySelector('#user')

    let userInfo = await APIGetLogedEmployeeInfo(token)

    infoContainer.innerText = ""
    infoContainer.insertAdjacentHTML('beforeend', `
            <h2 class="font-32-700">${userInfo.username}</h2>
            <div id="userInfo">
                <p class="font-20-400" id="userEmail">${userInfo.email}</p>
                <p class="font-20-400" id="userJob">${userInfo.professional_level || ""}</p>
                <p class="font-20-400" id="userWorkType">${userInfo.kind_of_work || ""}</p>
                <button class="btn-pen"></button>
            </div>
    `)

    editUserInfo(userInfo)
}
renderUserInfo()

async function renderCoworkers(){
    let companyInfoResponse = await APIGetLogedDpList(token)
    let departmentEmployees = await APIGetDpEmployees(token)

    let coworkersContainer = document.querySelector('#coworkers')

    if(companyInfoResponse.uuid){
        coworkersContainer.insertAdjacentHTML('beforeend', `
        <div id="companyDepartment" class="font-32-700 flex flex-center">${companyInfoResponse.name} - ${departmentEmployees[0].name}</div>
        <div id="cardsContainer">

        </div>
        `)

        let cardsContainer = document.querySelector('#cardsContainer')
        departmentEmployees[0].users.forEach(user => {
            cardsContainer.insertAdjacentHTML('beforeend', `
                <div id="coworkerCard">
                    <p class="font-16-700" id="coworkerName">${user.username}</p>
                    <p class="font-16-400" id="coworkerJob">${user.professional_level}</p>
                </div>
            `)
        })
    } else {
        coworkersContainer.insertAdjacentHTML('beforeend', `
            <h3 class="font-32-700 centerPadding">Você ainda não foi contratado</h3>
        `)
    }
}
renderCoworkers()


function logout() {
    let logoutBtn = document.querySelector('#btnLogout')
    logoutBtn.addEventListener('click', () => {
        localStorage.setItem('token', '')
        localStorage.setItem('admin', '')

        window.location.replace('../../index.html')
    })
}
logout()

function editUserInfo(userInformation) {
    let editBtn = document.querySelector('.btn-pen')
    editBtn.addEventListener('click', () => {
        let dialog = document.querySelector('dialog')

        dialog.showModal()
        dialog.classList.toggle('hide')

        dialog.innerText = ""
        dialog.insertAdjacentHTML('beforeend', `
            <button class="btn-close"></button>
            <h2 class="font-40-700">Editar Perfil</h2>
            <input type="text" class="input-default" id="editUserName" value="${userInformation.username}">
            <input type="email" class="input-default" id="editUserEmail" value="${userInformation.email}">
            <input type="password" class="input-default" id="editUserPassword" placeholder="Sua senha" required>
            <button class="btn-primary-2" id="confirmEditUser">Editar Perfil</button>
        `)

        let confirmEditBtn = document.querySelector('#confirmEditUser')
        confirmEditBtn.addEventListener('click', async () => {
            let newName = document.querySelector('#editUserName').value
            let newEmail = document.querySelector('#editUserEmail').value
            let newPassword = document.querySelector('#editUserPassword').value

            let editRequestBody = {
                username: newName,
                password: newPassword,
                email: newEmail,
            }   

            console.log(editRequestBody);

            try{

                let editResponse = await APIEditLogedEmployee(token, editRequestBody)

                if(editResponse.uuid){
                    toast('Sucesso!', 'Usuário devidamente editado')
                    
                    dialog.close()
                    dialog.classList.toggle('hide')
                    
                    renderUserInfo()
                } else {
                    toast('Erro!', editResponse.error)
                    
                }
                
                
            } catch {
                
                toast('Erro!', 'Tivemos algum problema, tente novamente mais tarde.')
            }
        })


        btnCloseModal()
    })

}

function btnCloseModal(){
    let btnCloseModal = document.querySelector('.btn-close')
    btnCloseModal.addEventListener('click', () => {
        let dialog = document.querySelector('dialog')
        dialog.close()
        dialog.classList.toggle('hide')
    })
}