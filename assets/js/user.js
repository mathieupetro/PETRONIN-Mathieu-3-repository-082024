const form = { //Déclaration de l'objet//
    email: document.getElementById("email"),
    password: document.getElementById("password"),
    submit: document.getElementById('submit'),
};

let button = form.submit.addEventListener("click", (e) => { //Ajout d'un écouteur d'événement sur le bouton de soumission//
    e.preventDefault();

    const errorMessageDiv = document.getElementById("error-message");
    errorMessageDiv.textContent = ""; // Réinitialise le message d'erreur à chaque soumission

    if (!form.email.value || !form.password.value) {
        errorMessageDiv.textContent = "Veuillez remplir les champs email et mot de passe.";
        return; // Arrête l'exécution si les champs sont vides
    }

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
            const errorMessageDiv = document.getElementById("error-message"); // Sélectionne l'élément pour afficher l'erreur
            if (data.error) {
                if (data.error === "mot de passe incorrect") {
                    errorMessageDiv.textContent = "Mot de passe incorrect. Veuillez réessayer.";
                } else {
                    errorMessageDiv.textContent = "Erreur dans l’identifiant ou le mot de passe.";
                }
            }
            else {
                const token = data.token;
                const isLoggedIn = true;
                sessionStorage.setItem("isLoggedIn", isLoggedIn);
                sessionStorage.setItem("token", token);
                location.assign("index.html");
            }
        })


        .catch((err) => { //Gestion des erreurs//
            console.log(err);
        });
});