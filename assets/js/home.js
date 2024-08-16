let categoriesData = [];
let worksData = [];

//code pour les filtres "catégories"//

const fetchcategories = async () => { //Récupère les données des œuvres depuis une API et les stocke dans le tableau categoriesdata//
  await fetch("http://localhost:5678/api/categories")
    .then((res) => res.json())
    .then((promise) => {
      categoriesData = promise;
    });

};

const categoriesDisplay = async () => { //Affiche les œuvres récupérées dans la galerie et la modal en générant du HTML dynamique//
  await fetchcategories();
  const filterBlock = document.querySelector('.button_filters_block')
  filterBlock.innerHTML = categoriesData.map(
    (categories) =>
      //<div id="Tous" class="button_filters">Tous</div><div id="objets" class="button_filters">Objets</div><div id="appartements" class="button_filters">Appartements</div><div id="hotels" class="button_filters">Hotels & restaurants</div>//  
      `
		 <div id="${categories.id}" class="button_filters">${categories.name}</div>`
  )
    .join("");

  const buttonTous = `<div id="0" class="button_filters">Tous</div>`
  filterBlock.insertAdjacentHTML("afterbegin", buttonTous)
};

categoriesDisplay();

const fetchWorks = async () => { //Récupère les données des œuvres depuis une API et les stocke dans le tableau worksData//
  await fetch("http://localhost:5678/api/works")
    .then((res) => res.json())
    .then((promise) => {
      worksData = promise;
    });

};

const worksDisplay = async () => { //Affiche les œuvres récupérées dans la galerie et la modal en générant du HTML dynamique//
  await fetchWorks();


  document.querySelector('.gallery').innerHTML = worksData.map(
    (works) =>
      `<figure id="${works.id}" class="displayOn" data-${works.category.id}>
		 <div id="${works.categoryId}"></div>
		 <div id="${works.category.name}"></div>
		 <div id="${works.userId}"></div>
		 <img src="${works.imageUrl}" crossOrigin="anonymous"/>
		 <figcaption>${works.title}</figcaption>
		 </figure>
		`,
  )
    .join("");
  document.querySelector('.galleryModal').innerHTML = worksData.map(
    (works) =>
      `<figure id=${works.id} class="displayOn figureModal" data-${works.category.id}>
			<i id="arrowSelector" class="arrowsDeletedNone fa-solid fa-arrows-up-down-left-right"></i>
			<i id="${works.id}" class="trashDeleted fa-solid fa-trash-can"></i>
		 <div id="${works.categoryId}"></div>
		 <div id="${works.category.name}"></div>
		 <div id="${works.userId}"></div>
		 <img class="imgModal" src="${works.imageUrl}" crossOrigin="anonymous"/>
		 <p>éditer</p>
		 </figure>
		`,
  )
    .join("");

};
worksDisplay(); //Appelle la fonction worksDisplay pour afficher initialement les œuvres récupérées//

const worksFilter = async () => { //Ajoute des fonctionnalités de filtrage pour afficher ou masquer les œuvres en fonction des filtres sélectionnés//
  await fetchWorks();

  let filters = document.querySelectorAll('.button_filters_block div');
  console.log(filters)
  for (let filter of filters) {
    filter.addEventListener("click", function () {
      let tag = this.id;
      console.log(tag)
      let figures = document.querySelectorAll('.gallery figure');
      for (let figure of figures) {
        figure.classList.replace("displayOn", "displayNone");
        console.log(figure.dataset)
        if (tag in figure.dataset || tag == "0") {
          figure.classList.replace("displayNone", "displayOn");
        };
      };
    });
  }
};
worksFilter(); //Appelle la fonction worksFilter pour configurer la fonctionnalité de filtrage//

//Vérification de l'état de connexion et mise à jour de l'affichage//
let isLoggedIn = sessionStorage.getItem("isLoggedIn");
if (sessionStorage.getItem("isLoggedIn") === null) {
  isLoggedIn = false;
};

function displayContent() {

  if (isLoggedIn) {
    document.querySelector('.loginlink').innerHTML = "logout";
    document.querySelector('.header_admin_none').classList.replace("header_admin_none", "header_admin_visible");
    document.querySelector('.modifierAdd_none').classList.replace("modifierAdd_none", "modifierAdd_visible");
  }

  else {
    document.querySelector('.loginlink').innerHTML = "login";
    document.querySelector('.loginlink').href = "./login.html"; //Redirection vers la page de connexion si l'utilisateur n'est pas connecté//
  };
};
displayContent();

//Gestion de la déconnexion//
const element = document.getElementById("loginId");
element.addEventListener("click", myFunctionLogout);

function myFunctionLogout() {
  sessionStorage.clear();
};

//Modale d'images//
const modalContainer = document.querySelector(".modal-container"); //sélectionne l'élément du DOM ayant la classe modal-container. Cet élément représente la conteneur de la modale//
const modalTriggers = document.querySelectorAll(".modal-trigger"); //sélectionne tous les éléments du DOM ayant la classe modal-trigger. Ces éléments sont les déclencheurs qui, lorsqu'ils sont cliqués, afficheront ou masqueront la modale//
modalTriggers.forEach(trigger => trigger.addEventListener("click", toggleModal)); //Pour chaque élément de modalTriggers, ajoute un gestionnaire d'événement click qui appelle la fonction toggleModal//

function toggleModal() {
  modalContainer.classList.toggle("active") //ajoute ou supprime la classe active à l'élément modalContainer. Cela permet de montrer ou cacher la modale//

  const token = sessionStorage.getItem("token"); //récupère un jeton de session (probablement utilisé pour l'authentification) depuis le sessionStorage//
  let idIcons = document.querySelectorAll('.displayOn i'); //sélectionne tous les éléments i (icônes) qui sont enfants d'un élément avec la classe displayOn//
  for (let idIcon of idIcons) { //Pour chaque idIcon, ajoute un gestionnaire d'événement click qui déclenche une requête fetch //
    idIcon.addEventListener("click", function () {
      fetch(`http://localhost:5678/api/works/${idIcon.id}`, {
        method: 'DELETE',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${token}`,
        },
      }).then(data => worksDisplay()) //après la requête réussie, appelle la fonction worksDisplay pour mettre à jour l'affichage des travaux//
        .catch(err => console.log(err)); //en cas d'erreur, log l'erreur dans la console//
    })
  };
};

const buttonNext = document.getElementById("bouttonValiderNext");
buttonNext.addEventListener("click", myFunctionNext);
function myFunctionNext() {
  let modalElements = document.querySelectorAll('.modal div');
  let modalElementsForms = document.querySelectorAll('.modal form');
  for (let modalElement of modalElements) {
    modalElement.classList.replace("modal1_visible", "modal1_none");
    modalElement.classList.replace("modal2_none", "modal2_visible");
  };
  for (let modalElementsForm of modalElementsForms) {
    modalElementsForm.classList.replace("modal2_none", "modal2_visible");
  };
};

const buttonBack = document.getElementById("bouttonValiderBack");
buttonBack.addEventListener("click", myFunctionBack);
function myFunctionBack() {
  let modalElements = document.querySelectorAll('.modal div');
  for (let modalElement of modalElements) {
    modalElement.classList.replace("modal1_none", "modal1_visible");
    modalElement.classList.replace("modal2_visible", "modal2_none");
  };
};

function valideContent() {
  let imageInput = document.getElementById('upload-button').value;
  let titreAddValidation = document.getElementById('titreAdd').value;
  let categorieAddValidation = document.getElementById('categoriesAdd').value;
  if (imageInput) {
    imageInput = true;
    console.log("Image OK");
  }
  if (titreAddValidation) {
    titreAddValidation = true;
    console.log("Titre OK");
  }
  if (categorieAddValidation > 1) {
    categorieAddValidation = true;
    console.log("Catégorie OK");
  }
  if (categorieAddValidation && imageInput && titreAddValidation === true) {
    document.querySelector('.buttonValider').classList.replace("buttonValider", "buttonValiderOk");
  }
  else {
    document.querySelector('.buttonValider').classList.replace("buttonValiderOk", "buttonValider");
  }
};

let uploadButton = document.getElementById("upload-button");
let chosenImage = document.getElementById("chosen-image");
let fileName = document.getElementById("file-name");
let imageLoadDisplay = document.querySelector('.imageLoadVisible');
uploadButton.onchange = () => {
  let reader = new FileReader();
  reader.readAsDataURL(uploadButton.files[0]);
  reader.onload = () => {
    chosenImage.setAttribute("src", reader.result);
    imageLoadDisplay.classList.replace("imageLoadVisible", "imageLoadNone");
  }
  fileName.textContent = uploadButton.files[0].name;

}

const form = document.getElementById('form');
form.addEventListener('submit', function (e) {
  e.preventDefault();
  const form = new FormData();
  const token = sessionStorage.getItem("token");
  const fileInput = document.getElementById('upload-button');
  const imageFile = fileInput.files[0];
  const titreAdd = document.getElementById('titreAdd').value;
  const categorieAdd = document.getElementById('categoriesAdd').value;
  form.append('image', imageFile);
  form.append('title', titreAdd);
  form.append('category', categorieAdd);
  fetch('http://localhost:5678/api/works', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: form
  })
    .then(res => res.json())
    .then(data => worksDisplay())
    .then(data => location.reload())
    .catch(err => console.log(err));
}); 