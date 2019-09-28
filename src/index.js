const $app = document.getElementById('app');
const $observe = document.getElementById('observe');
const API = 'https://rickandmortyapi.com/api/character/?page=23';

const renderCharacters = function (characters){
  let output = characters.map(character => {
    return `
  <article class="Card">
    <img src="${character.image}" />
    <h2>${character.name}<span>${character.species}</span></h2>
  </article>
`
  }).join('');
  let newItem = document.createElement('section');
  newItem.classList.add('Items');
  newItem.innerHTML = output;
  $app.appendChild(newItem);
}

class Client{
  constructor(api) {
    this.api = api;
    localStorage.setItem("next_fetch", "")
  }

  getData() {
    return new Promise((resolve,reject) => {
      const api = localStorage.getItem("next_fetch")==="" ? this.api : localStorage.getItem("next_fetch")
      fetch(api)
        .then(response => response.json())
        .then(response => {
          if( response.info.next!="" ){
            localStorage.setItem("next_fetch", response.info.next )          
            resolve({
              characters: response.results,
              last: false
            })
          }
          else{
            resolve({
              characters: response.results,
              last: true
            })
          }          
        })
        .catch(error => reject(error))
    })
  }
}

const client = new Client(API);

const loadData = async function() {
  try{    
    const {characters, last} = await client.getData()
    renderCharacters(characters)
    if(last==true){
      let newItem = document.createElement('p');      
      newItem.innerHTML = "Ya no hay personajes";
      $app.appendChild(newItem);
      intersectionObserver.unobserve($observe)
    }
  }catch(err){
    console.log(err)
  }
}

const intersectionObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    loadData();
  }
}, {
  rootMargin: '0px 0px 100% 0px',
});

intersectionObserver.observe($observe);