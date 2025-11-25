const API_KEY = '12e81b75a42fc726c14e543495e45043';
const BASE = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

const el = id => document.getElementById(id);
const searchInput = el('searchInput');
const searchBtn = el('searchBtn');
const trendingBtn = el('trendingBtn');
const randomBtn = el('randomBtn');
const moviesEl = el('movies');
const toast = el('toast');

searchBtn.addEventListener('click', () => {
  const q = searchInput.value.trim();
  if (!q) return showToast('Type something to search ✨');
  searchMovies(q);
});

searchInput.addEventListener('keydown', (e) => { 
  if (e.key === 'Enter') searchBtn.click(); 
});

trendingBtn.addEventListener('click', () => getTrending());
randomBtn.addEventListener('click', () => suggestRandom());

document.getElementById('watchlistBtn').addEventListener('click', () => {
  window.location.href = "watchlist.html";
});


// Toast message
function showToast(msg, t = 2200){
  toast.textContent = msg; 
  toast.classList.remove('hidden');
  setTimeout(()=> toast.classList.add('hidden'), t);
}

// Fetch helper
async function fetchJSON(url){
  try {
    const res = await fetch(url);
    if(!res.ok) throw new Error('Network error');
    return await res.json();
  } catch(err){
    console.error(err);
    showToast('Network error 😢');
    return null;
  }
}

// Search movies
async function searchMovies(query){
  const url = `${BASE}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;
  const data = await fetchJSON(url);
  if(!data) return;
  if(data.results.length === 0) return showToast('No results found 💔');
  renderMovies(data.results);
}

// Trending
async function getTrending(){
  const url = `${BASE}/trending/movie/day?api_key=${API_KEY}`;
  const data = await fetchJSON(url);
  if(!data) return;
  renderMovies(data.results);
}

// Random suggestion
async function suggestRandom(){
  const url = `${BASE}/trending/movie/week?api_key=${API_KEY}`;
  const data = await fetchJSON(url);
  if(!data) return;
  const pick = data.results[Math.floor(Math.random() * data.results.length)];
  renderMovies([pick]);
}

// Render movie cards
function renderMovies(list){
  moviesEl.innerHTML = '';
  list.forEach(m => {
    const card = document.createElement('article');
    card.className = 'card';

    const poster = m.poster_path 
      ? IMG_BASE + m.poster_path 
      : 'https://via.placeholder.com/500x750?text=No+Image';

    card.innerHTML = `
      <img src="${poster}" alt="${escapeHtml(m.title)} poster" loading="lazy">
      <div class="info">
        <div class="title">${escapeHtml(m.title)}</div>
        <div class="meta">${m.release_date || '—'} • ⭐ ${m.vote_average || 'N/A'}</div>
        <div style="display:flex;gap:8px;margin-top:6px">
          <button class="btn-small" onclick='showDetails(${JSON.stringify(m).replace(/'/g, "\\'")})'>Details</button>
          <button class="btn-small" onclick='saveToWatchlist(${m.id})'>Save</button>
        </div>
      </div>
    `;

    moviesEl.appendChild(card);
  });
}

// Movie details (simple alert)
function showDetails(movie){
  const text = `${movie.title}
  
Release: ${movie.release_date || '—'}
Rating: ${movie.vote_average || 'N/A'}

Overview:
${movie.overview || 'No overview available.'}`;
  
  alert(text);
}

// Save to localStorage watchlist
function saveToWatchlist(id){
  const key = 'cinepick_watchlist_v1';
  const cur = JSON.parse(localStorage.getItem(key) || '[]');
  if(cur.includes(id)) return showToast('Already in watchlist ❤️');
  cur.push(id);
  localStorage.setItem(key, JSON.stringify(cur));
  showToast('Saved to watchlist ✨');
}

// Escape HTML to prevent bugs
function escapeHtml(str = ''){
  return String(str).replace(/[&<>\"']/g, s => (
    {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]
  ));
}

// Load trending on start
window.addEventListener('load', () => getTrending());
