async function logout(req, res){
    res.clearCookie('coderCookieToken');
    res.redirect('/api')

}

export {logout}