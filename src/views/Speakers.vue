<script setup>
import { ref, computed, onMounted } from 'vue';
import { useSpeakers } from '@/composables/useSpeakers';
import AppCard from '@/components/ui/AppCard.vue';
import AppButton from '@/components/ui/AppButton.vue';
import AppModal from '@/components/ui/AppModal.vue';

// 1. REAKTIF STATE DARI COMPOSABLE API
const {
  speakers,
  isLoading,
  error,
  isSubmitting,
  submitSuccess,
  fetchSpeakers,
  createSpeaker,
} = useSpeakers();

// 2. STATE UNTUK PENCARIAN & FILTER
const searchQuery = ref('');
const selectedDept = ref('All');
const departments = ['All', 'Engineering', 'Marketing', 'Design', 'Sales', 'Support', 'Human Resources'];

// 3. STATE UNTUK MODAL DETAIL & MODAL FORM TAMBAH
const isDetailModalOpen = ref(false);
const selectedSpeaker = ref(null);
const isAddModalOpen = ref(false);

// Form State untuk POST Request
const formSpeaker = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  title: '',
  department: 'Engineering',
});

// Pesan notifikasi toast
const toastMessage = ref('');
const showToast = ref(false);

const triggerToast = (msg) => {
  toastMessage.value = msg;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 4000);
};

// 4. COMPUTED UNTUK FILTERING DATA DARI API
const filteredSpeakers = computed(() => {
  return speakers.value.filter((speaker) => {
    const fullName = `${speaker.firstName || ''} ${speaker.lastName || ''}`.toLowerCase();
    const companyTitle = (speaker.company?.title || speaker.title || '').toLowerCase();
    const query = searchQuery.value.toLowerCase();
    const matchSearch = fullName.includes(query) || companyTitle.includes(query);

    const speakerDept = speaker.company?.department || speaker.department || 'Other';
    const matchDept = selectedDept.value === 'All' || speakerDept === selectedDept.value;

    return matchSearch && matchDept;
  });
});

// 5. LIFECYCLE HOOK: Fetch data API saat komponen dimuat (onMounted)
onMounted(() => {
  fetchSpeakers(12);
});

// 6. ACTION HANDLERS
const openDetail = (speaker) => {
  selectedSpeaker.value = speaker;
  isDetailModalOpen.value = true;
};

const closeDetail = () => {
  isDetailModalOpen.value = false;
  selectedSpeaker.value = null;
};

const openAddModal = () => {
  formSpeaker.value = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    title: '',
    department: 'Engineering',
  };
  isAddModalOpen.value = true;
};

const handleCreateSpeaker = async () => {
  if (!formSpeaker.value.firstName || !formSpeaker.value.title) {
    alert('Nama depan dan Jabatan/Keahlian wajib diisi!');
    return;
  }

  try {
    const payload = {
      firstName: formSpeaker.value.firstName,
      lastName: formSpeaker.value.lastName,
      email: formSpeaker.value.email || `${formSpeaker.value.firstName.toLowerCase()}@gatherly.org`,
      phone: formSpeaker.value.phone || '+62 812-3456-7890',
      company: {
        title: formSpeaker.value.title,
        department: formSpeaker.value.department,
        name: 'Gatherly Community Partner',
      },
    };

    const result = await createSpeaker(payload);
    isAddModalOpen.value = false;
    triggerToast(`🎉 Berhasil mengirim data ke API! Narasumber "${result.firstName}" terdaftar.`);
  } catch (err) {
    // Error ditangani di composable
  }
};
</script>

<template>
  <div class="speakers-page">
    <!-- TOAST NOTIFICATION -->
    <Transition name="toast-fade">
      <div v-if="showToast" class="toast-notification">
        <span class="toast-icon">✅</span>
        <div class="toast-body">
          <p class="toast-title">API Response Success</p>
          <p class="toast-desc">{{ toastMessage }}</p>
        </div>
        <button class="toast-close" @click="showToast = false">&times;</button>
      </div>
    </Transition>

    <!-- HEADER SECTION -->
    <div class="header-section">
      <div class="header-left">
        <div class="badge-api">
          <span class="status-dot"></span>
          <span>LIVE REST API (DummyJSON Users)</span>
        </div>
        <h1 class="page-title">Guest Speakers & Mentors</h1>
        <p class="page-desc">
          Temukan pembicara, praktisi industri, dan mentor terbaik untuk mengisi sesi workshop atau seminar Anda.
          Data di bawah ini ditarik secara real-time melalui RESTful Dummy API.
        </p>
      </div>

      <div class="header-action">
        <AppButton variant="primary" @click="openAddModal">
          + Ajukan Pembicara Baru
        </AppButton>
      </div>
    </div>

    <!-- FILTER & SEARCH BAR SECTION -->
    <div class="controls-card">
      <div class="search-input-wrapper">
        <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari pembicara berdasarkan nama atau keahlian..."
          class="search-input"
        />
        <button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''">&times;</button>
      </div>

      <div class="filter-pills">
        <button
          v-for="dept in departments"
          :key="dept"
          class="pill-btn"
          :class="{ active: selectedDept === dept }"
          @click="selectedDept = dept"
        >
          {{ dept }}
        </button>
      </div>
    </div>

    <!-- 1. LOADING STATE (SKELETON ANIMATION) -->
    <div v-if="isLoading" class="speakers-grid">
      <div v-for="n in 6" :key="n" class="skeleton-card">
        <div class="skeleton-avatar pulse"></div>
        <div class="skeleton-line title pulse"></div>
        <div class="skeleton-line subtitle pulse"></div>
        <div class="skeleton-line text pulse"></div>
        <div class="skeleton-button pulse"></div>
      </div>
    </div>

    <!-- 2. ERROR STATE -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <h3 class="error-title">Gagal Memuat Data dari API</h3>
      <p class="error-desc">{{ error }}</p>
      <AppButton variant="primary" @click="fetchSpeakers(12)">
        🔄 Coba Muat Ulang
      </AppButton>
    </div>

    <!-- 3. DATA LOADED / SUCCESS STATE -->
    <div v-else-if="filteredSpeakers.length > 0" class="speakers-grid">
      <AppCard v-for="speaker in filteredSpeakers" :key="speaker.id" class="speaker-card">
        <div class="speaker-card-inner">
          <div class="speaker-header">
            <div class="avatar-container">
              <img
                :src="speaker.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${speaker.firstName}`"
                :alt="speaker.firstName"
                class="speaker-avatar"
                loading="lazy"
              />
            </div>
            <span class="dept-badge">
              {{ speaker.company?.department || speaker.department || 'Speaker' }}
            </span>
          </div>

          <div class="speaker-content">
            <h3 class="speaker-name">{{ speaker.firstName }} {{ speaker.lastName }}</h3>
            <p class="speaker-role">{{ speaker.company?.title || speaker.title || 'Industry Expert' }}</p>
            <p class="speaker-company">🏢 {{ speaker.company?.name || 'Gatherly Partner' }}</p>
            <p class="speaker-loc">📍 {{ speaker.address?.city || 'Indonesia' }}</p>
          </div>

          <div class="speaker-footer">
            <button class="view-profile-btn" @click="openDetail(speaker)">
              Lihat Profil Lengkap &rarr;
            </button>
          </div>
        </div>
      </AppCard>
    </div>

    <!-- 4. EMPTY RESULT SEARCH STATE -->
    <div v-else class="empty-state">
      <div class="empty-icon">🔎</div>
      <h3>Tidak Ada Narasumber Ditemukan</h3>
      <p>Tidak ditemukan narasumber dengan kata kunci "{{ searchQuery }}" pada kategori {{ selectedDept }}.</p>
      <AppButton variant="secondary" @click="searchQuery = ''; selectedDept = 'All'">
        Reset Filter
      </AppButton>
    </div>

    <!-- MODAL DETAIL NARASUMBER -->
    <AppModal
      :is-open="isDetailModalOpen"
      :title="selectedSpeaker ? `${selectedSpeaker.firstName} ${selectedSpeaker.lastName}` : 'Detail Narasumber'"
      variant="primary"
      badge-text="Profil Terverifikasi API"
      badge-variant="primary"
      confirm-text="Undang Sebagai Narasumber"
      cancel-text="Tutup"
      @confirm="closeDetail"
      @close="closeDetail"
    >
      <div v-if="selectedSpeaker" class="detail-modal-body">
        <div class="detail-hero">
          <img
            :src="selectedSpeaker.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedSpeaker.firstName}`"
            :alt="selectedSpeaker.firstName"
            class="detail-avatar"
          />
          <div class="detail-hero-info">
            <h4>{{ selectedSpeaker.firstName }} {{ selectedSpeaker.lastName }}</h4>
            <span class="detail-badge-pill">
              {{ selectedSpeaker.company?.department || selectedSpeaker.department || 'Guest Speaker' }}
            </span>
            <p class="detail-role">{{ selectedSpeaker.company?.title || selectedSpeaker.title }}</p>
            <p class="detail-company">🏢 {{ selectedSpeaker.company?.name || 'Gatherly Network' }}</p>
          </div>
        </div>

        <div class="detail-info-grid">
          <div class="info-item">
            <span class="info-label">Email Kontak</span>
            <span class="info-value">✉️ {{ selectedSpeaker.email }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Nomor Telepon</span>
            <span class="info-value">📞 {{ selectedSpeaker.phone || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Lokasi / Kota</span>
            <span class="info-value">📍 {{ selectedSpeaker.address?.city || 'Indonesia' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">ID API</span>
            <span class="info-value">#{{ selectedSpeaker.id }}</span>
          </div>
        </div>

        <div class="detail-bio-box">
          <span class="info-label">Tentang Pembicara</span>
          <p class="bio-text">
            {{ selectedSpeaker.firstName }} berpengalaman di bidang
            {{ selectedSpeaker.company?.department || 'teknologi dan inovasi' }} sebagai
            {{ selectedSpeaker.company?.title || 'profesional' }}. Sering diundang sebagai narasumber dalam
            berbagai seminar nasional dan workshop teknologi.
          </p>
        </div>
      </div>
    </AppModal>

    <!-- MODAL FORM TAMBAH / POST NARASUMBER KE DUMMY API -->
    <AppModal
      :is-open="isAddModalOpen"
      title="Ajukan Narasumber Baru ke API"
      variant="primary"
      badge-text="HTTP POST REQUEST"
      badge-variant="primary"
      :confirm-text="isSubmitting ? 'Mengirim Data...' : 'Kirim ke Server (POST)'"
      cancel-text="Batal"
      @confirm="handleCreateSpeaker"
      @close="isAddModalOpen = false"
    >
      <div class="form-modal-body">
        <p class="form-tip">
          Data ini akan dikirim melalui <code>HTTP POST</code> ke endpoint <code>https://dummyjson.com/users/add</code>.
        </p>

        <div class="form-grid">
          <div class="form-group">
            <label>Nama Depan *</label>
            <input
              v-model="formSpeaker.firstName"
              type="text"
              placeholder="Contoh: Farhan"
              class="form-control"
              required
            />
          </div>
          <div class="form-group">
            <label>Nama Belakang</label>
            <input
              v-model="formSpeaker.lastName"
              type="text"
              placeholder="Contoh: Pratama"
              class="form-control"
            />
          </div>
        </div>

        <div class="form-group">
          <label>Jabatan / Bidang Keahlian *</label>
          <input
            v-model="formSpeaker.title"
            type="text"
            placeholder="Contoh: Senior Frontend Developer"
            class="form-control"
            required
          />
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label>Departemen</label>
            <select v-model="formSpeaker.department" class="form-control">
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="Support">Support</option>
              <option value="Human Resources">Human Resources</option>
            </select>
          </div>
          <div class="form-group">
            <label>Email Kontak</label>
            <input
              v-model="formSpeaker.email"
              type="email"
              placeholder="nama@email.com"
              class="form-control"
            />
          </div>
        </div>
      </div>
    </AppModal>
  </div>
</template>

<style scoped>
.speakers-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

/* TOAST NOTIFICATION */
.toast-notification {
  position: fixed;
  top: 90px;
  right: 24px;
  background: #ffffff;
  border-left: 5px solid #10b981;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  z-index: 1000;
  max-width: 420px;
}
.toast-icon {
  font-size: 1.5rem;
}
.toast-body {
  flex: 1;
}
.toast-title {
  font-weight: 700;
  font-size: 0.95rem;
  margin: 0 0 2px 0;
  color: #10b981;
}
.toast-desc {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0;
}
.toast-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #999;
  cursor: pointer;
}
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* HEADER SECTION */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-6);
  flex-wrap: wrap;
}
.header-left {
  max-width: 720px;
}
.badge-api {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(102, 68, 255, 0.08);
  color: var(--primary);
  font-size: 0.8rem;
  font-weight: 700;
  padding: 6px 14px;
  border-radius: 999px;
  margin-bottom: var(--space-3);
  letter-spacing: 0.5px;
}
.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 8px #10b981;
  animation: pulse-dot 2s infinite;
}
@keyframes pulse-dot {
  0% { transform: scale(0.95); opacity: 0.8; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.8; }
}
.page-title {
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0 0 var(--space-2) 0;
  color: var(--text-main);
}
.page-desc {
  font-size: 1.05rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin: 0;
}

/* CONTROLS CARD */
.controls-card {
  background: var(--bg-light);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
.search-icon {
  position: absolute;
  left: 16px;
  color: var(--text-muted);
}
.search-input {
  width: 100%;
  padding: 14px 44px 14px 46px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: white;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.search-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(102, 68, 255, 0.15);
}
.clear-btn {
  position: absolute;
  right: 14px;
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--text-muted);
  cursor: pointer;
}
.filter-pills {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
}
.pill-btn {
  background: white;
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}
.pill-btn:hover {
  background: var(--bg-gray);
  color: var(--text-main);
}
.pill-btn.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

/* GRID LAYOUT */
.speakers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-6);
}

/* SPEAKER CARD */
.speaker-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.speaker-card-inner {
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: var(--space-4);
}
.speaker-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.avatar-container {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  overflow: hidden;
  background: #f1f3f9;
  border: 3px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
.speaker-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.dept-badge {
  background: rgba(102, 68, 255, 0.1);
  color: var(--primary);
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
  text-transform: uppercase;
}
.speaker-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.speaker-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-main);
  margin: 0;
}
.speaker-role {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--primary);
  margin: 0;
}
.speaker-company {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0;
}
.speaker-loc {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0;
}
.speaker-footer {
  margin-top: auto;
  border-top: 1px solid var(--border-color);
  padding-top: var(--space-3);
}
.view-profile-btn {
  background: none;
  border: none;
  color: var(--primary);
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: gap 0.2s;
}
.view-profile-btn:hover {
  gap: 10px;
}

/* SKELETON LOADING */
.skeleton-card {
  background: white;
  border-radius: 16px;
  border: 1px solid var(--border-color);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.skeleton-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #eaeaea;
}
.skeleton-line {
  height: 14px;
  background: #eaeaea;
  border-radius: 6px;
}
.skeleton-line.title {
  width: 70%;
  height: 20px;
}
.skeleton-line.subtitle {
  width: 50%;
}
.skeleton-line.text {
  width: 40%;
}
.skeleton-button {
  margin-top: 12px;
  height: 36px;
  background: #eaeaea;
  border-radius: 8px;
}
.pulse {
  animation: shimmer 1.5s infinite linear;
  background: linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%);
  background-size: 200% 100%;
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ERROR STATE */
.error-state {
  text-align: center;
  padding: var(--space-12) var(--space-6);
  background: #fff5f5;
  border: 1px dashed #feb2b2;
  border-radius: 16px;
}
.error-icon {
  font-size: 3rem;
  margin-bottom: var(--space-2);
}
.error-title {
  font-size: 1.5rem;
  color: #c53030;
  margin: 0 0 var(--space-2) 0;
}
.error-desc {
  color: #742a2a;
  max-width: 500px;
  margin: 0 auto var(--space-6) auto;
}

/* EMPTY STATE */
.empty-state {
  text-align: center;
  padding: var(--space-12) var(--space-6);
  background: var(--bg-light);
  border-radius: 16px;
  border: 1px dashed var(--border-color);
}
.empty-icon {
  font-size: 2.5rem;
  margin-bottom: var(--space-2);
}

/* MODAL DETAILS */
.detail-modal-body {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}
.detail-hero {
  display: flex;
  align-items: center;
  gap: var(--space-5);
  background: var(--bg-gray);
  padding: var(--space-5);
  border-radius: 12px;
}
.detail-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  object-fit: cover;
}
.detail-hero-info h4 {
  font-size: 1.3rem;
  margin: 0 0 4px 0;
}
.detail-badge-pill {
  display: inline-block;
  background: rgba(102, 68, 255, 0.15);
  color: var(--primary);
  font-size: 0.75rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 6px;
  margin-bottom: 4px;
}
.detail-role {
  font-weight: 600;
  color: var(--primary);
  margin: 0;
  font-size: 0.95rem;
}
.detail-company {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0;
}
.detail-info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
}
.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: white;
  border: 1px solid var(--border-color);
  padding: 12px;
  border-radius: 8px;
}
.info-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
}
.info-value {
  font-size: 0.9rem;
  color: var(--text-main);
  font-weight: 500;
}
.detail-bio-box {
  background: white;
  border: 1px solid var(--border-color);
  padding: var(--space-4);
  border-radius: 8px;
}
.bio-text {
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--text-main);
  margin: 6px 0 0 0;
}

/* FORM MODAL */
.form-modal-body {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.form-tip {
  font-size: 0.85rem;
  color: var(--text-muted);
  background: var(--bg-gray);
  padding: 10px 12px;
  border-radius: 8px;
  margin: 0;
}
.form-tip code {
  color: var(--primary);
  font-weight: 600;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-main);
}
.form-control {
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}
.form-control:focus {
  border-color: var(--primary);
}
</style>
