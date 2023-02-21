const axios = require('axios').default;

const ENDPOINT = 'https://pixabay.com/api/';
const KEY = '33004205-a7e5fb4dda889a489baf2d40c';

export default class NewsApiService {
  constructor() {
    this.page = 1;
    this.searchQuery = '';
  }
  async getNews() {
    const URL = `${ENDPOINT}?key=${KEY}&q=${this.searchQuery}&per_page=40&page=${this.page}&image_type=photo&orientation=horizontal&safesearch=true`;

    return axios.get(URL).then(response => {
      this.nextPage();
      return response.data;
    });
  }
  nextPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }
}
