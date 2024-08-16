const form = { //Déclaration de l'objet//
    email: document.getElementById("email"),
    password: document.getElementById("password"),
    submit: document.getElementById('submit'),
};

let button = form.submit.addEventListener("click", (e) => { //Ajout d'un écouteur d'événement sur le bouton de soumission//
    e.preventDefault();
    const login = "http://localhost:5678/api/users/login"; //Définition de l'URL de l'API//

    fetch(login, { //Envoi de la requête POST à l'API//
        method: "POST",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: form.email.value,
            password: form.password.value,
        }),
    })
        .then((response) => response.json()) //Traitement de la réponse de l'API//
        .then((data) => {
            var token = data.token;
            var isLoggedIn = true;
            if (data.message === "user not found") {
                alert("Erreur dans l’identifiant ou le mot de passe");
            }
            else {
                sessionStorage.setItem("isLoggedIn", isLoggedIn);
                sessionStorage.setItem("token", token);
                location.assign("index.html");
            }
            console.log(token, isLoggedIn);
        })
        .catch((err) => { //Gestion des erreurs//
            console.log(err);
        });
});