const axios = require('axios').default;

const ENDPOINT = 'https://pixabay.com/api/';
const KEY = '33004205-a7e5fb4dda889a489baf2d40c';

export default class NewsApiService {
  constructor() {
    this.page = 1;
    this.searchQuery = '';
  }
  async getNews() {
    const searchUrl = new URLSearchParams({
      key: KEY,
      q: this.searchQuery,
      page: this.page,
      per_page: 40,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    });
    const URL = `${ENDPOINT}?${searchUrl.toString()}`;

    return await axios.get(URL);
  }
  nextPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }
}
