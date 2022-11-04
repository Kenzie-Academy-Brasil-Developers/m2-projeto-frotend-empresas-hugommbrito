import { APIGetAllDepartments, APIGetDepartmentsFromCompany, APICreateNewDp, APIGetOutOfWork, APIGetAllEmployees, APIHireEmployee, APIFireEmployee, APIEditDp, APIDeleteDp, APIEditUser, APIDeleteUser } from "../../scripts/requestsAdmin.js";
import { APIGetAllCompanies } from "../../scripts/requests.js";
import { toast } from "../../scripts/toasty.js";


//SEÇÃO DE DEPARTAMENTOS
function checkToken(){
    const loginToken = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("admin");

    (loginToken && (isAdmin == 'true')) ? "" : window.location.replace('../login/index.html')
}
checkToken()


async function renderDepartments(departmentList) {
    let dpmtsContainer = document.querySelector('#dpmtsList')
    dpmtsContainer.innerText = ""

    departmentList.forEach(department => {
        dpmtsContainer.insertAdjacentHTML('beforeend', `
            <div id="dpmtCard">
                <p class="font-20-700">${department.name}</p>
                <p class="font-18-400">${department.description}</p>
                <p class="font-18-400">${department.companies.name}</p>
                <div id="cardBtns">
                    <button class="btn-eye" value="${department.uuid}"></button>
                    <button class="btn-pen" value="${department.uuid}"></button>
                    <button class="btn-bin" value="${department.uuid}"></button>
                </div>
            </div>
        `)
    })

    openViewDpModal()
    openEditDpModal()
    openDeleteDpModal()

}


async function renderAllDepartments(){
    let currentToken = localStorage.getItem('token')
    
    let allDpmts = await APIGetAllDepartments(currentToken)

    renderDepartments(allDpmts)
}
renderAllDepartments()


async function renderCompaniesForFilter(){
    let companies = await APIGetAllCompanies()

    let selectFilter = document.querySelector('#selectCompany')

    companies.forEach(({name, uuid}) => {
        selectFilter.insertAdjacentHTML('beforeend', `
        <option value="${uuid}">${name}</option>
        `)
    })

    selectFilter.addEventListener('change', async (e) => {
        let admToken = localStorage.getItem('token')
        let selectedID = e.target.value

        let departments = await APIGetDepartmentsFromCompany(admToken, selectedID)

        renderDepartments(departments)
    })
}
renderCompaniesForFilter()


function btnCloseModal(){
    let btnCloseModal = document.querySelector('.btn-close')
    btnCloseModal.addEventListener('click', () => {
        let dialog = document.querySelector('dialog')
        dialog.close()
        dialog.classList.toggle('hide')
    })
}


function openNewDpModal() {
    let newDpBtn = document.querySelector('#newDpBtn')
    newDpBtn.addEventListener('click', async () => {
        let dialog = document.querySelector('dialog')
        dialog.innerHTML = `<button class="btn-close"></button>`

        dialog.showModal()
        dialog.classList.toggle('hide')

        let companies = await APIGetAllCompanies()

        dialog.insertAdjacentHTML('beforeend', `
            <h2 class="font-32-700">Criar Departamento</h2>
            <input type="text" class="input-default" id="newDpName" placeholder="Nome do departamento">
            <input type="text" class="input-default" id="newDpDescription" placeholder="Descrição">
            <select name="" id="newDpCompany" class="input-default">
                <option value="">Selecionar Empresa</option>
            </select>
            <button class="btn-primary-2" id="CreateNewDpBtn">Criar o departamento</button>
        `)

        let companySelect = document.querySelector('#newDpCompany')

        companies.forEach(company => {
            companySelect.insertAdjacentHTML('beforeend', `
                <option value="${company.uuid}">${company.name}</option>
            `)
        })

        createNewDP()
        btnCloseModal()
    })
}
openNewDpModal()


function createNewDP(){
    
    let token = localStorage.getItem('token');
    
    let btnCreteNewDp = document.querySelector('#CreateNewDpBtn');
    
    btnCreteNewDp.addEventListener('click', async () => {
        let newDpName = document.querySelector('#newDpName').value
        let newDpDescription = document.querySelector('#newDpDescription').value
        let newDpCompany = document.querySelector('#newDpCompany').value
    
        let newDp = {
            name: newDpName,
            description: newDpDescription,
            company_uuid: newDpCompany
        }

        try{
            let response = await APICreateNewDp(token, newDp);
            if(response.uuid){
                toast('Sucesso!', 'Departamento Criado')

                let modal = document.querySelector('dialog')
                modal.close()
                modal.classList.toggle('hide')

                renderAllDepartments()
            } else {
                toast('Erro!', response.error)
            }
        } catch {
            toast('Erro!', 'Encontramos alguma dificudlade na sua requisição, tente novamente mais tarde.')
        }
    })
} 


function openViewDpModal(){
let viewDpBtns = document.querySelectorAll('.btn-eye')
viewDpBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
        let selectedDpId = e.target.value
        
        let dialog = document.querySelector('dialog')
        dialog.innerHTML = `<button class="btn-close"></button>`
        
        let token = localStorage.getItem('token')
        let AllDP = await APIGetAllDepartments(token)
        let selectedDP = AllDP.find(dp => dp.uuid === selectedDpId)
        

        dialog.showModal()
        dialog.classList.toggle('hide')

        dialog.insertAdjacentHTML('beforeend', `
        <h2 class="font-32-700">${selectedDP.name}</h2>
        <div id="modalEditTop">
            <div id="modalEditCompanyInfo">
                <p class="font-20-700">${selectedDP.description}</p>
                <p class="font-18-400">${selectedDP.companies.name}</p>
            </div>
            <div id="ModalEditUserSelect">
                <select name="" id="employeeSelect" class="input-default">
                    <option value="">Selecione um usuário</option>
                </select>
                <button class="btn-green" id="btnHire">Contratar</button>
            </div>
        </div>
        <div id="modalEditUsersContainer">

        </div> 
        `)

        // RENDERIZAR FUNCIONÁRIOS SEM DPTO NA LISTA SUSPENSA
        async function renderEmployeesSelectList(){
            let employeeSelect = document.querySelector('#employeeSelect')
            let employeeOutOfWork = await APIGetOutOfWork(token)
            
            employeeSelect.innerHTML = '<option value="">Selecione um usuário</option>'
            employeeOutOfWork.forEach(employee => {
                employeeSelect.insertAdjacentHTML('beforeend', `
                    <option value="${employee.uuid}">${employee.username}</option>
                `)
            })
        }
        renderEmployeesSelectList()

        // RENDERIZAR FUNCIONÁRIOS DO DPTO NO CONTAINER
        async function renderEmployeesOfDp(){
            let usersContainer = document.querySelector('#modalEditUsersContainer')
            let allEmployees = await APIGetAllEmployees(token)
            let selectedDpEmployees = allEmployees.filter(employee => employee.department_uuid === selectedDpId)
    
            usersContainer.innerText = ""
            selectedDpEmployees.forEach(employee => {
                usersContainer.insertAdjacentHTML('beforeend', `
                    <div id="modalEditUserCard">
                        <p class="font-20-700">${employee.username}</p>
                        <p class="font-18-400">${employee.professional_level}</p>
                        <p class="font-18-400">${employee.kind_of_work || ""}</p>
                        <button class="btn-red" id="${employee.uuid}">Desligar</button>
                    </div>
                `)
            })
            fireEmployee()
        }
        renderEmployeesOfDp()


        // CONTRATAR FUNCIONÁRIO AO DPTO
        let btnHire = document.querySelector('#btnHire')
        btnHire.addEventListener('click', async () => {
            try{
                let employeeToHireID = employeeSelect.value

                let newEmployee = {
                    user_uuid: employeeToHireID,
                    department_uuid: selectedDpId,
                }

                let hireResponse = await APIHireEmployee(token, newEmployee)

                if(hireResponse.department_uuid){
                    toast('Sucesso!', 'Usuário devidamente CADASTRADO.')
                    renderEmployeesOfDp()
                    renderEmployeesSelectList()
                } else {
                    toast('Erro!', 'Algo não saiu como esperado, tente novamente mais tarde.')
                }
                console.log(employeeToHireID)
            } catch {
                toast('Erro!', 'Algo não saiu como esperado, tente novamente mais tarde.')
            }
        })


        // DESLIGAR FUNCIONÁRIO
        function fireEmployee(){
            let btnsFire = document.querySelectorAll('.btn-red')
            btnsFire.forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    let firedId = e.target.id
                    try{
                        let fireResponse = await APIFireEmployee(token, firedId)
                        if(!fireResponse.department_uuid){
                            toast('Sucesso!', 'Usuário devidamente DESLIGADO.')
                            renderEmployeesOfDp()
                            renderEmployeesSelectList()
                        } else {
                            toast('Erro!', fireResponse.error)
                        }
                        
                    } catch {
                        toast('Erro!', 'Algo não saiu como esperado, tente novamente mais tarde.')
                    }

                })
            })
        }

        btnCloseModal()
    })

})
}


function openEditDpModal(){
    let editDpBtns = document.querySelectorAll('.btn-pen')
    editDpBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            let selectedDpId = e.target.value
            let dialog = document.querySelector('dialog')
            dialog.innerHTML = `<button class="btn-close"></button>`
        
            dialog.showModal()
            dialog.classList.toggle('hide')
        
            let token = localStorage.getItem('token')
            let allDpResponse = await APIGetAllDepartments(token)
            let selectedDP = allDpResponse.find(dp => dp.uuid === selectedDpId)
            
            dialog.insertAdjacentHTML('beforeend', `
            <h2 class="font-32-700">Editar Departamento</h2>
            <input type="text" class="input-default" id="editDpName" value="${selectedDP.name}">
            <input type="text" class="input-default" id="editDpDescription" value="${selectedDP.description}">
            <button class="btn-primary-2" id="aplyEditBtn">Aplicar Edições</button>
            `)
            
            let aplyEditBtn = document.querySelector('#aplyEditBtn')
            aplyEditBtn.addEventListener('click', async (e) => {
                let editDpName = document.querySelector('#editDpName').value
                let editDpDescription = document.querySelector('#editDpDescription').value

                let editBody = {
                    name: editDpName,
                    description: editDpDescription
                }

                try{
                    let editResponse = await APIEditDp(token, selectedDpId, editBody)
                    if(editResponse.uuid){
                        toast('Sucesso!', 'Departamente devidamente EDITADO.')
                        renderAllDepartments()
                    } else {
                        toast('Erro!', editResponse.error)
                    }
                } catch {
                    toast('Erro!', 'Algo não saiu como esperado, tente novamente mais tarde.')
                }
            })
            console.log(aplyEditBtn)
            

            btnCloseModal()
        })
    })
}


function openDeleteDpModal() {
    let DelDpBtns = document.querySelectorAll('.btn-bin')
    DelDpBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            let selectedDpId = e.target.value
            let dialog = document.querySelector('dialog')
            dialog.innerHTML = `<button class="btn-close"></button>`
        
            dialog.showModal()
            dialog.classList.toggle('hide')
            
            let token = localStorage.getItem('token')
            let allDpResponse = await APIGetAllDepartments(token)
            let selectedDP = allDpResponse.find(dp => dp.uuid === selectedDpId)
        
            dialog.insertAdjacentHTML('beforeend', `
                <div id="modalConfirmDeletDpmt">
                    <p class="font-28-700">Realmente deseja deletar o Departamento ${selectedDP.name} e demmitir seus funcionários?</p>
                    <button class="btn-green" id="confirmDelDp">Confirmar</button>
                </div>
            `)
            
            let confirmDelBtn = document.querySelector('#confirmDelDp')

            confirmDelBtn.addEventListener('click', async () => {
             
                await APIDeleteDp(token, selectedDpId)
                dialog.close()
                dialog.classList.toggle('hide')
                toast('Sucesso!', 'Departamento devidamente DELETADO.')

                renderAllDepartments()
            })

            
            btnCloseModal()
        })
    })
}


function logout() {
    let logoutBtn = document.querySelector('#btnLogout')
    logoutBtn.addEventListener('click', () => {
        localStorage.setItem('token', '')
        localStorage.setItem('admin', '')

        window.location.replace('../../index.html')
    })
}
logout()


// SEÇÃO DE USUÁRIOS CADASTRADOS
function renderUsers(usersList){
    let usersContainer = document.querySelector('#usersList')
    usersContainer.innerText = ""

    usersList.forEach(user => {
        if(!user.is_admin){
            usersContainer.insertAdjacentHTML('beforeend', `
                <div id="userCard">
                    <p class="font-20-700">${user.username}</p>
                    <p class="font-18-400">${user.professional_level || ""}</p>
                    <p class="font-18-400">${user.kind_of_work || ""}</p>
                    <div id="cardBtns">
                        <button class="btn-pen btn-edt-user" id="${user.uuid}"></button>
                        <button class="btn-bin btn-del-user" id="${user.uuid}"></button>
                    </div>
                </div>
            `)
        }
    })

    editUser()
    deleteUser()
}

async function renderAllUsers() {
    let token = localStorage.getItem('token')
    let allUsers = await APIGetAllEmployees(token)
    renderUsers(allUsers)
}
renderAllUsers()

function editUser() {
    let editUserBtns = document.querySelectorAll('.btn-edt-user')
    editUserBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            let selectedUserId = e.target.id
            let dialog = document.querySelector('dialog')
            dialog.innerHTML = `<button class="btn-close"></button>`
        
            dialog.showModal()
            dialog.classList.toggle('hide')
        
            let token = localStorage.getItem('token')

            
            dialog.insertAdjacentHTML('beforeend', `
                <h2 class="font-32-700">Editar Usuário</h2>
                <select class="input-default" name="" id="selectKindOfWork">
                    <option value="">Selecionar modalidade de Trabalho</option>
                    <option value="home office">Home Office</option>
                    <option value=presencial"">Presencial</option>
                    <option value="hibrido">Híbrido</option>
                </select>
                <select class="input-default" name="" id="selectProfessionalLevel">
                    <option value="">Selecionar Nível Profissional</option>
                    <option value="estágio">Estágio</option>
                    <option value="júnior">Júnior</option>
                    <option value="pleno">Pleno</option>
                    <option value="sênior">Sênior</option>
                </select>
                <button class="btn-primary-2" id="confirmEditUser">Editar</button>
            `)
            
            let confirmEditBtn = document.querySelector('#confirmEditUser')
            confirmEditBtn.addEventListener('click', async () => {

                let newKindOfWork = document.querySelector('#selectKindOfWork').value
                let newProfessionalLevel = document.querySelector('#selectProfessionalLevel').value

                let newUserInfo = {
                    kind_of_work: newKindOfWork,
                    professional_level: newProfessionalLevel,
                }

                try{
                    let editUserResponse = await APIEditUser(token, selectedUserId, newUserInfo)
                    
                    if(editUserResponse.uuid){
                        toast('Sucesso!', 'As informações do usuário foram devidamente editadas')

                        dialog.close()
                        dialog.classList.toggle('hide')

                        renderAllUsers()
                    } else {
                        toast('Erro!', editUserResponse.error)
                    }
                    
                } catch {
                    toast('Erro!', 'Algo deu errado com a requisição, tente novamente mais tarde.')
                }
            })


            btnCloseModal()
        })
    })
}

function deleteUser() {
    let deleteUserBtns = document.querySelectorAll('.btn-del-user')
    deleteUserBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            let selectedUserId = e.target.id
            let dialog = document.querySelector('dialog')
            dialog.innerHTML = `<button class="btn-close"></button>`
        
            dialog.showModal()
            dialog.classList.toggle('hide')
        
            let token = localStorage.getItem('token')
            let allUsersResponse = await APIGetAllEmployees(token)
            let selectedUser = allUsersResponse.find(user => user.uuid === selectedUserId)
            
            dialog.insertAdjacentHTML('beforeend', `
                <div id="modalConfirmDeletDpmt">
                    <p class="font-28-700">Realmente deseja remover o usuário ${selectedUser.username}?</p>
                    <button class="btn-green" id="confirmDeleteUser">Confirmar</button>
                </div>
            `)
            
            let confirmDeleteBtn = document.querySelector('#confirmDeleteUser')
            confirmDeleteBtn.addEventListener('click', async () => {

                await APIDeleteUser(token, selectedUserId)
                toast('Sucesso!', 'Usuário foi devidamente DELETADO.')

                dialog.close()
                dialog.classList.toggle('hide')

                renderAllUsers()
            })


            btnCloseModal()
        })
    })
}