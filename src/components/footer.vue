<template>
  <footer
    :class="[
      'footer',
      footer === 'footer-dark' ? 'footer-dark' : '',
      'footer-custom-bg',
    ]"
  >
    <div class="container-fluid container-padded">
      <div class="row">
        <div class="col-md-12 p-4">
          <div class="row">
            <div class="col-md-12">
              <!-- Logo & Title -->
              <div class="mb-3">
                <img
                  v-if="settings.logo"
                  :src="settings.logo"
                  alt="Logo"
                  class="img-fluid mb-3"
                  style="max-height: 60px"
                />
                <div class="text-white">
                  <p class="mt-2">
                    {{
                      settings.nama_instansi || "Kementerian Ketenagakerjaan"
                    }}
                  </p>
                </div>
              </div>

              <!-- Contact Info -->
              <div class="d-flex mb-3 text-white">
                <i
                  class="fa fa-map-marker mt-1 me-3 text-center"
                  style="width: 20px"
                ></i>
                <span
                  style="white-space: pre-line"
                  v-html="settings.alamat || '-'"
                ></span>
              </div>

              <div class="d-flex mb-3 text-white align-items-center">
                <i class="fa fa-phone me-3 text-center" style="width: 20px"></i>
                <span>{{ settings.telepon || "-" }}</span>
              </div>

              <div class="d-flex mb-4 text-white align-items-center">
                <i
                  class="fa fa-envelope me-3 text-center"
                  style="width: 20px"
                ></i>
                <span>{{ settings.email || "-" }}</span>
              </div>

              <!-- Social Media -->
              <div class="social-icons d-flex gap-2 mb-4">
                <a
                  v-if="settings.email"
                  :href="'mailto:' + settings.email"
                  class="social-link"
                  title="Email"
                >
                  <i class="fa-solid fa-envelope"></i>
                </a>
                <a
                  v-if="settings.whatsapp"
                  :href="
                    formatWhatsappLink(
                      settings.whatsapp,
                      'Halo, saya ingin informasi lebih lanjut mengenai layanan Anda',
                    )
                  "
                  target="_blank"
                  class="social-link"
                >
                  <i class="fa-brands fa-whatsapp"></i>
                </a>
                <a
                  v-if="settings.facebook"
                  :href="settings.facebook"
                  target="_blank"
                  class="social-link"
                >
                  <i class="fa-brands fa-facebook"></i>
                </a>
                <a
                  v-if="settings.instagram"
                  :href="settings.instagram"
                  target="_blank"
                  class="social-link"
                >
                  <i class="fa-brands fa-instagram"></i>
                </a>
                <a
                  v-if="settings.twitter"
                  :href="settings.twitter"
                  target="_blank"
                  class="social-link"
                >
                  <i class="fa-brands fa-x-twitter"></i>
                </a>
                <a
                  v-if="settings.tiktok"
                  :href="settings.tiktok"
                  target="_blank"
                  class="social-link"
                >
                  <i class="fa-brands fa-tiktok"></i>
                </a>
                <a
                  v-if="settings.youtube"
                  :href="settings.youtube"
                  target="_blank"
                  class="social-link"
                >
                  <i class="fa-brands fa-youtube"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
        <!-- Copyright -->
        <div class="col-md-12">
          <div class="border-top border-secondary pt-3 pb-3">
            <p class="mb-0 text-white opacity-75 text-start">
              {{ settings.nama_instansi }} © {{ currentYear }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { getAplikasi } from "@/services/public/aplikasiPublic";

const store = useStore();
const settings = ref({});
const currentYear = new Date().getFullYear();

const footer = computed(() => store.getters["layout/footer"]);

onMounted(async () => {
  try {
    const response = await getAplikasi();
    let sourceData = null;

    if (response.data && Array.isArray(response.data)) {
      if (response.data[0] && response.data[0].data) {
        const innerArray = response.data[0].data;
        if (Array.isArray(innerArray) && innerArray.length > 0) {
          sourceData = innerArray[0];
        }
      }
    }

    if (sourceData) {
      settings.value = sourceData;
    }
  } catch (error) {
    console.error("Failed to fetch footer settings:", error);
  }
});

const formatWhatsappLink = (phone, message) => {
  if (!phone) return "#";
  let cleanPhone = phone.replace(/\D/g, "");
  if (cleanPhone.startsWith("0")) {
    cleanPhone = "62" + cleanPhone.slice(1);
  }

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};
</script>

<style scoped>
.footer-custom-bg {
  background-color: #102c4e !important;
}

.container-padded {
  padding-left: 125px !important;
  padding-right: 125px !important;
}

@media (max-width: 768px) {
  .container-padded {
    padding-left: 15px !important;
    padding-right: 15px !important;
  }
}

.social-link {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 6px;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-link:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: white;
  color: white;
}

.social-link i {
  font-size: 1.1rem;
}
</style>

<style>
.page-wrapper.compact-wrapper .page-body-wrapper .footer {
  margin-left: 265px;
  width: auto;
  transition: all 0.5s ease;
}

.page-wrapper.compact-wrapper
  .page-body-wrapper
  div.sidebar-wrapper.close_icon
  ~ .footer {
  margin-left: 90px;
  width: auto;
}

@media (max-width: 991px) {
  .page-wrapper.compact-wrapper .page-body-wrapper .footer {
    margin-left: 0;
  }
}
.page-wrapper.compact-wrapper .footer .container-padded {
  padding-left: 30px !important;
  padding-right: 30px !important;
}
</style>
