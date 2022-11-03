function checkToken(){
    const loginToken = localStorage.getItem("token");

    (!loginToken) ? window.location.replace('../login/index.html') : ""
}
checkToken()