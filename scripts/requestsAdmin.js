const baseURL = "http://localhost:6278"

async function APIGetAllDepartments(token){
    let options = {
        "method": "GET",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    }

    let responseJSON = await fetch(`${baseURL}/departments`, options)
    let response = await responseJSON.json()

    return response
}

async function APIGetDepartmentsFromCompany(token,companyID){
    let options = {
        "method": "GET",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    }

    let responseJSON = await fetch(`${baseURL}/departments/${companyID}`, options)
    let response = await responseJSON.json()

    return response
}

async function APICreateNewDp(token, body){
    let options = {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        "body": JSON.stringify(body)
    }

    let responseJSON = await fetch(`${baseURL}/departments`, options)
    let response = await responseJSON.json()

    return response
}

async function APIGetOutOfWork(token){
    let options = {
        "method": "GET",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    }

    let responseJSON = await fetch(`${baseURL}/admin/out_of_work`, options)
    let response = await responseJSON.json()

    return response
}

async function APIGetAllEmployees(token){
    let options = {
        "method": "GET",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    }

    let responseJSON = await fetch(`${baseURL}/users`, options)
    let response = await responseJSON.json()

    return response
}

async function APIHireEmployee(token, body){
    let options = {
        "method": "PATCH",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        "body": JSON.stringify(body)
    }

    let responseJSON = await fetch(`${baseURL}/departments/hire/`, options)
    let response = await responseJSON.json()

    return response
}

async function APIFireEmployee(token, userID){
    let options = {
        "method": "PATCH",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    }

    let responseJSON = await fetch(`${baseURL}/departments/dismiss/${userID}`, options)
    let response = await responseJSON.json()

    return response
}

async function APIEditDp(token, DpId, body){
    let options = {
        "method": "PATCH",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        "body": JSON.stringify(body)
    }

    let responseJSON = await fetch(`${baseURL}/departments/${DpId}`, options)
    let response = await responseJSON.json()

    return response
}

async function APIDeleteDp(token, DpId){
    let options = {
        "method": "DELETE",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    }

    await fetch(`${baseURL}/departments/${DpId}`, options)
}




async function APIEditUser(token, userId, body){
    let options = {
        "method": "PATCH",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        "body": JSON.stringify(body)
    }

    let responseJSON = await fetch(`${baseURL}/admin/update_user/${userId}`, options)
    let response = await responseJSON.json()

    return response
}

async function APIDeleteUser(token, userId){
    let options = {
        "method": "DELETE",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    }

    await fetch(`${baseURL}/admin/delete_user/${userId}`, options)
}

export { APIGetAllDepartments, APIGetDepartmentsFromCompany, APICreateNewDp, APIGetOutOfWork, APIGetAllEmployees, APIHireEmployee, APIFireEmployee, APIEditDp, APIDeleteDp, APIEditUser, APIDeleteUser }
