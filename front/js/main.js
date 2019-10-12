var mojVue = new Vue({
    el: "#app",
    data: function(){
        return {
            ime: "",
            lozinka: "",
            loggedInUser: null,
            level: null,
            msg: "",
            trenStranica: "login",
            noviUser: {
                username: '',
                password: ''
            },
            komentar:"",
            utisci: [],
            artikli: [],
            usr_id: null,
            komentatori: []

        }
    },
    methods: {
        pokusajLogin(){
            axios.post("http://localhost:3000/login",
                {
                    username: this.ime,
                    password: this.lozinka
                }
            ).then((response) => {
                if(response.data.result == "ERR"){
                    this.msg = "Unesite ispravan username i password";
                    return;
                }
                this.loggedInUser = response.data.data;
                localStorage.sid = response.data.data.usr_id;
                this.level = response.data.data.usr_level;
            })
        },
        logOut(){
            this.loggedInUser = null;
            localStorage.removeItem('sid')
            localStorage.removeItem('level')
        },
        registruj(){
            axios.post("http://localhost:3000/register",
                {
                    username: this.noviUser.username,
                    password: this.noviUser.password
                }
            ).then((response) => {
                if(response.data.result == "ERR"){
                    this.msg = "Unesite podatke u prazna polja";
                    return;
                }

                this.trenStranica = "login";
                this.msg = "Uspesno registrovan. Ulogujte se slobodno";
                
            });
        },
        prikaziArtikle(){
            axios.get("http://localhost:3000/artikli").then((response) => {
                console.log(response)
                this.artikli = response.data.data
                this.loggedInUser = localStorage.sid;
            }).catch((err) => {
                console.log(err);
            })
        },
        posaljiKomentar(){
            axios.post("http://localhost:3000/comments",
                {
                    comment: this.komentar,
                    usr_id: localStorage.sid
                }
            ).then((response) => {
                this.loggedInUser = localStorage.sid;
                

                this.komentar = response.data.data;
            })
        },
        prikaziUtiske() {
            axios.get("http://localhost:3000/utisci").then((response) => {
                console.log(localStorage.sid);
                console.log(response);
                this.utisci = response.data.data;
                this.komentatori = response.data.data;
                this.loggedInUser = localStorage.sid;

            }).catch((err) => {
                console.log(err);
            })
        },
        obrisiKom(index, id) {
            console.log('dadada')
            axios.post("http://localhost:3000/utisci", {
                kom_id: id
            }).then(response => {
                if(response.data.result === 'OK') {
                    this.utisci.splice(index, 1)
                }                
            })
        }

    }
})