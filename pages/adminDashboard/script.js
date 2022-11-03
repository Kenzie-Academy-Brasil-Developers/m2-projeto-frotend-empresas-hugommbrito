function checkToken(){
    const loginToken = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("admin");

    (loginToken && (isAdmin == 'true')) ? "" : window.location.replace('../login/index.html')
}
checkToken()