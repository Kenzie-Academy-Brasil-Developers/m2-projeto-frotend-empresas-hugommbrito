import { APIGetAllCompanies, APIGetAllSectors } from "../../scripts/requests.js";

function activateMenuMobile(){
    let btnMenu = document.querySelector('.btn-menu')
    let dropMenu = document.querySelector('.drop-menu')

    btnMenu.addEventListener('click', () => {
        dropMenu.classList.toggle('hide')
    })
}
activateMenuMobile()


async function renderCompanies(companyList){
    let cardsContainer = document.querySelector('.cardsContainer')
    cardsContainer.innerText = ""
    companyList.forEach(company => {
        cardsContainer.insertAdjacentHTML('beforeend', `
            <div class="card flex-col spc-btwn">
                <h3 class="font-20-700">${company.name}</h3>
                <div class="flex-col gap-5">
                    <p class="font-16-400">${company.opening_hours[0]
                    }${company.opening_hours[1]} horas</p>
                    <div class="tag-primary-1">${company.sectors.description}</div>
                </div>
            </div>
        `)
    })
}
// renderCompanies()


async function renderAllSectors(){
    let sectorsList = await APIGetAllSectors()
    
    let sectorSelect = document.querySelector('#categorySelect')
    console.log(sectorsList);
    
    sectorsList.forEach(sector => {
        sectorSelect.insertAdjacentHTML('beforeend', `
            <option value="${sector.uuid}">${sector.description}</option>
            `)
    })
}
renderAllSectors()


async function filterCompaniesBySector(){
    let sectorSelect = document.querySelector('#categorySelect')
    let companies = await APIGetAllCompanies()
    
    renderCompanies(companies)

    sectorSelect.addEventListener('change', (e) =>  {
        let sectorID = e.target.value
        console.log(sectorID);

        if(sectorID == ""){
            renderCompanies(companies)
        } else {
            let filteredCompanies = companies.filter(company => {
                return company.sectors.uuid === sectorID
            })
            renderCompanies(filteredCompanies)
        }
    })
}
filterCompaniesBySector()