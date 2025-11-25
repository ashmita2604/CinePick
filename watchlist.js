const API_KEY = '12e81b75a42fc726c14e543495e45043';
const BASE = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

const moviesEl = document.getElementById('watchlistMovies');

function getWatchlist(){
  const key = 'cinepick_watchlist_v1';
  return JSON.parse(localStorage.getItem(key) || '[]');
}

async function loadWatchlist(){
  const saved = getWatchlist();

  if(saved.length === 0){
    moviesEl.innerHTML = "<p style='color:white;text-align:center;margin-top:40px;font-size:20px;'>Your watchlist is empty 😭💛</p>";
    return;
  }

  moviesEl.innerHTML = "";

  for(const id of saved){
    const url = `${BASE}/movie/${id}?api_key=${API_KEY}`;
    const movie = await fetch(url).then(r => r.json());

    const poster = movie.poster_path
      ? IMG_BASE + movie.poster_path
      : 'https://via.placeholder.com/500x750?text=No+Image';

    const card = document.createElement('article');
    card.className = 'card';

    card.innerHTML = `
      <img src="${poster}">
      <div class="info">
        <div class="title">${movie.title}</div>
        <div class="meta">${movie.release_date} • ⭐ ${movie.vote_average}</div>

        <button class="btn-small" onclick="removeFromWatchlist(${movie.id})">Remove</button>
      </div>
    `;

    moviesEl.appendChild(card);
  }
}

function removeFromWatchlist(id){
  const key = 'cinepick_watchlist_v1';
  let list = JSON.parse(localStorage.getItem(key) || '[]');

  list = list.filter(movieId => movieId !== id);
  localStorage.setItem(key, JSON.stringify(list));

  loadWatchlist();
}

loadWatchlist();
