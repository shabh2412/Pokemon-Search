import Navbar from '../components/NavBar';
import axios from 'axios';

document.getElementById('navbarHolder').innerHTML = Navbar();

const url = 'https://pokeapi.co/api/v2/pokemon';

let get = async (query) => {
  let data = await axios.get(query);
  return data;
}

let input = document.getElementById('pokemonSearchInput');
let search = async () => {
  let name = input.value.toLowerCase();
  let query = `${url}/${name}`;
  // console.log(query);
  try {
    let data = await get(query);
    showResult(data);
    console.log(data.data);
  }
  catch({response:{status}}) {
    // console.log('hahah Error',err);
    if(status === 404) {
      let output = document.getElementById('results');
      output.innerHTML = null;
      let obj = {
        name:`Sorry :/ The pokemon doesn't exist`,
        sprites: {
          other: {
            home: {
              front_default: `https://www.maxpixel.net/static/photo/1x/Funny-Pug-Pet-Dog-Canine-Animal-Cute-Sad-Puppy-5222518.png`
            }
          }
        }
      }
      output.append(createCard(obj));
    }
  }
}

let showResult = async ({data}) => {
  let container = document.getElementById('results');
  container.innerHTML = null;
  if(data.results) {
    // alert('So many results!');
    for(let item of data.results) {
      // container.append(createCard(item));
      // console.log(item);
      let res = await get(item.url);
      let info = res.data;
      console.log(info);
      container.append(createCard(info));
    }
  }
  else {
    container.append(createCard(data));
    // console.log(data);
  }
}

let createCard = ({name,base_experience,moves,sprites:{other:{home:{front_default}}}})=>{
  // console.log(front_default);
  let col = document.createElement('div');
  col.classList = 'col-lg-3 col-md-4 col-sm-6 col-xs-12 mx-auto';
  // card div
  let card = document.createElement('div');
  card.classList = 'card';
  card.style.width = '18rem';
  // card image
  let img = document.createElement('img');
  img.classList = 'card-img-top';
  img.src = `${front_default}`;
  // card body - title, experience, attacks
  let cardBody = document.createElement('div');
  cardBody.classList = 'card-body';
  let title = document.createElement('h5');
  title.classList = 'card-title text-capitalize';
  title.innerText = `${name}`;
  let experience = document.createElement('p');
  experience.classList = 'card-text';
  experience.innerText = `Experience: ${base_experience}`;
  // let total_moves = document.createElement('p');
  // total_moves.classList = 'small';
  // total_moves.innerText = `Total Moves: ${moves.length}`;
  cardBody.append(title, experience);
  card.append(img,cardBody);
  col.append(card);
  return col;
}

let id;
let debounceSearchFunction = (func, delay)=>{
  if(id) {
    clearTimeout(id);
  }
  id = setTimeout(()=>{
    func();
  }, delay);
}


input.addEventListener('input',()=>{
  debounceSearchFunction(search, 1000);
});

let showRandom = async () => {
  let query = `${url}/?limit=50`;
  let data = await get(query);
  console.log(data);
  showResult(data);
  // console.log(results);
}

showRandom();