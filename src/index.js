import NewsApiService from './api.js';
import LoadMoreBtn from './LoadMore.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const Gallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');

const newsApiService = new NewsApiService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  isHidden: true,
});

let allGallery = '';

form.addEventListener('submit', onSubmit);
loadMoreBtn.button.addEventListener('click', fetchArticles);

let totalHits = 0;
function onSubmit(e) {
  e.preventDefault();

  const form = e.currentTarget;
  const value = form.elements.searchQuery.value.trim();
  newsApiService.searchQuery = value;

  newsApiService.resetPage();
  clearNewsList();
  loadMoreBtn.hide();

  if (!value) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  } else {
    fetchArticles();
  }
}

async function fetchArticles() {
  try {
    const articles = await newsApiService.getNews();
    const hits = articles.data.hits;
    const data = articles.data;
    if (!hits.length) throw new Error('No data');
    else if (totalHits >= data.totalHits) {
      Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
      loadMoreBtn.hide();
      return;
    } else {
      loadMoreBtn.show();
      totalHits += hits.length;
      Notify.success(`Hooray! We found ${totalHits} images.`);
      loadMoreBtn.disable();
      const markup = hits.reduce(
        (markup, article) => createMarkup(article) + markup,
        ''
      );
      allGallery += markup;
      loadMoreBtn.enable();
      appendNewsToList(markup);
      Gallery.refresh();
    }
  } catch (error) {
    onError(error);
    return;
  } finally {
    form.reset();
  }
}
function appendNewsToList(markup) {
  gallery.insertAdjacentHTML('beforeend', markup);
}
function clearNewsList() {
  gallery.innerHTML = '';
}
function onError() {
  loadMoreBtn.hide();

  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function createMarkup({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `
  <div class="photo-card">
  <a class="gallery__link" href="${largeImageURL}" >
  <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
  </a>
  <div class="info">
    <div class="info-item">
      <b>Likes</b>
      <p>${likes}</p>
    </div>
    <div class="info-item">
      <b>Views</b>
      <p>${views}</p>
    </div>
    <div class="info-item">
      <b>Comments</b>
      <p>${comments}</p>
    </div>
    <div class="info-item">
      <b>Downloads</b>
      <p>${downloads}</p>
    </div>
  </div>
</div>
    `;
}
