import { ref } from 'vue';
import { speakerService } from '@/services/api';

export function useSpeakers() {
  const speakers = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  const isSubmitting = ref(false);
  const submitSuccess = ref(false);

  /**
   * Mengambil data narasumber dari Dummy API secara asynchronous
   */
  const fetchSpeakers = async (limit = 12) => {
    isLoading.value = true;
    error.value = null;

    try {
      const data = await speakerService.getSpeakers(limit);
      speakers.value = data.users || [];
    } catch (err) {
      console.error('Gagal mengambil data dari API:', err);
      error.value =
        err.response?.data?.message ||
        err.message ||
        'Terjadi kesalahan saat menghubungi server API. Pastikan koneksi internet aktif.';
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Menambahkan narasumber baru via POST request ke Dummy API
   */
  const createSpeaker = async (speakerData) => {
    isSubmitting.value = true;
    error.value = null;
    submitSuccess.value = false;

    try {
      const response = await speakerService.addSpeaker(speakerData);

      // Optimistic UI update: Tambahkan data yang baru di-generate ke daftar lokal
      const newSpeaker = {
        ...response,
        id: response.id || Date.now(),
        image:
          response.image ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(response.firstName)}`,
      };

      speakers.value.unshift(newSpeaker);
      submitSuccess.value = true;
      return newSpeaker;
    } catch (err) {
      console.error('Gagal mengirim data ke API:', err);
      error.value =
        err.response?.data?.message || err.message || 'Gagal menambahkan narasumber ke API.';
      throw err;
    } finally {
      isSubmitting.value = false;
    }
  };

  return {
    speakers,
    isLoading,
    error,
    isSubmitting,
    submitSuccess,
    fetchSpeakers,
    createSpeaker,
  };
}
