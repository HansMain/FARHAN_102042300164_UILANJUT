import axios from 'axios';

/**
 * REST API Client Configuration
 * Menggunakan DummyJSON API (https://dummyjson.com) & fallback ke JSONPlaceholder
 * untuk mensimulasikan komunikasi backend yang realistis.
 */
const apiClient = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * SERVICE API UNTUK NARASUMBER / SPEAKERS (Dummy Users)
 */
export const speakerService = {
  // 1. GET: Mengambil daftar narasumber (dengan limit)
  async getSpeakers(limit = 12, skip = 0) {
    const response = await apiClient.get(`/users?limit=${limit}&skip=${skip}`);
    return response.data;
  },

  // 2. GET: Mencari narasumber berdasarkan query nama
  async searchSpeakers(query) {
    const response = await apiClient.get(`/users/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // 3. GET: Mengambil detail satu narasumber berdasarkan ID
  async getSpeakerById(id) {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  // 4. POST: Mensimulasikan penambahan narasumber baru ke server
  async addSpeaker(speakerData) {
    const response = await apiClient.post('/users/add', speakerData);
    return response.data;
  },
};

/**
 * SERVICE API UNTUK MENGIMPOR SAMPLE EVENT DARI DUMMY API (Dummy Posts)
 * Mengambil artikel/post dummy dan mengubahnya (mapping) menjadi data Event Gatherly
 */
export const dummyEventService = {
  async fetchSampleEvents(limit = 6) {
    const response = await apiClient.get(`/posts?limit=${limit}`);
    const categories = ['Workshop', 'Meetup', 'Seminar', 'Conference', 'Competition'];
    const cities = ['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Bali'];

    // Transformasi data API eksternal agar sesuai dengan skema Event Gatherly
    return response.data.posts.map((post, index) => {
      const randomCat = categories[index % categories.length];
      const randomCity = cities[index % cities.length];
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + (index + 2) * 5);

      return {
        id: Date.now() + index,
        title: post.title.charAt(0).toUpperCase() + post.title.slice(1),
        date: futureDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        loc: `📍 ${randomCity} Convention Center`,
        cat: randomCat,
        quota: (index + 1) * 25 + 50,
        price: index % 2 === 0 ? 'Free' : `Rp ${(index + 1) * 75}.000`,
        desc: post.body,
        done: false,
      };
    });
  },
};

export default apiClient;
