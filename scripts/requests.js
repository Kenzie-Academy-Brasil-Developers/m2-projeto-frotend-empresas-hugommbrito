const baseURL = "http://localhost:6278"

async function APIGetAllCompanies(){
    const responseJSON = await fetch(`${baseURL}/companies`)
    const response = await responseJSON.json()

    return response
}

async function APIGetAllSectors(){
    const responseJSON = await fetch(`${baseURL}/sectors`)
    const response = await responseJSON.json()

    return response
}

async function APIRegisterUser(body){

    
    let options = {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        },
        "body": JSON.stringify(body)
    }

    let responseJSON = await fetch(`${baseURL}/auth/register`, options)
    let response = await responseJSON.json()

    return response
}

async function APILogin(body){
    let options = {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        },
        "body": JSON.stringify(body)
    }

    let responseJSON = await fetch(`${baseURL}/auth/login`, options)
    let response = await responseJSON.json()

    return response
}

async function APICheckAdmin(token){
    let options = {
        "method": "GET",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    }

    let responseJSON = await fetch(`${baseURL}/auth/validate_user`, options)
    let response = await responseJSON.json()

    return response
}

export {APIGetAllCompanies, APIGetAllSectors, APIRegisterUser, APILogin, APICheckAdmin}