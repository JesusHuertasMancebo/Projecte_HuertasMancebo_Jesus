class Login{

    constructor(username, password) {
        this.username = username;
        this.password = password;
    }

    //Getters
    get get_username() {
        return this.username;
    }

    get get_password() {
        return this.password;
    }

    //Setters

    set set_username(username) {
        this.username = username;
    }

    set set_password(password) {
        this.password = password;
    }

    toString() {
        var to_String = console.log("Username: " + this.username + " Password: " + this.password);
        return to_String;
    }
}

module.exports={
    Login:Login
}
