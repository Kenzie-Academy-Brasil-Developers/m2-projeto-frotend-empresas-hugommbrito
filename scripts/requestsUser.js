const baseURL = "http://localhost:6278"

async function APIGetDpEmployees(token){
    let options = {
        "method": "GET",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    }

    let responseJSON = await fetch(`${baseURL}/users/departments/coworkers`, options)
    let response = await responseJSON.json()

    return response
}

async function APIGetLogedEmployeeInfo(token){
    let options = {
        "method": "GET",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    }

    let responseJSON = await fetch(`${baseURL}/users/profile`, options)
    let response = await responseJSON.json()

    return response
}

async function APIGetLogedDpList(token){
    let options = {
        "method": "GET",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    }

    let responseJSON = await fetch(`${baseURL}/users/departments`, options)
    let response = await responseJSON.json()

    return response
}

async function APIEditLogedEmployee(token, body){
    let options = {
        "method": "PATCH",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        "body": JSON.stringify(body)
    }

    let responseJSON = await fetch(`${baseURL}/users`, options)
    let response = await responseJSON.json()

    return response
}

export { APIGetDpEmployees, APIGetLogedEmployeeInfo, APIGetLogedDpList, APIEditLogedEmployee }