<template>
  <div>
    <div class="row g-4">
      <!-- Nama Lengkap -->
      <div class="col-md-6">
        <div class="d-flex align-items-start">
          <div class="flex-shrink-0 me-3">
            <div
              class="icon-box bg-light text-primary rounded-3 d-flex align-items-center justify-content-center"
              style="width: 50px; height: 50px"
            >
              <i class="fa fa-user fa-lg"></i>
            </div>
          </div>
          <div class="flex-grow-1">
            <label class="text-muted small fw-medium mb-1">{{
              $t("Full Name")
            }}</label>
            <div class="fw-medium text-dark">
              {{ unescapeHtml(formattedName) }}
            </div>
          </div>
        </div>
        <hr class="my-3 text-muted opacity-25" />
      </div>

      <!-- Email -->
      <div class="col-md-6">
        <div class="d-flex align-items-start">
          <div class="flex-shrink-0 me-3">
            <div
              class="icon-box bg-light text-primary rounded-3 d-flex align-items-center justify-content-center"
              style="width: 50px; height: 50px"
            >
              <i class="fa fa-envelope fa-lg"></i>
            </div>
          </div>
          <div class="flex-grow-1">
            <label class="text-muted small fw-medium mb-1">{{
              $t("Email")
            }}</label>
            <div class="fw-medium text-dark">{{ user.email || "-" }}</div>
          </div>
        </div>
        <hr class="my-3 text-muted opacity-25" />
      </div>

      <!-- NIK -->
      <div class="col-md-6">
        <div class="d-flex align-items-start">
          <div class="flex-shrink-0 me-3">
            <div
              class="icon-box bg-light text-primary rounded-3 d-flex align-items-center justify-content-center"
              style="width: 50px; height: 50px"
            >
              <i class="fa fa-id-card fa-lg"></i>
            </div>
          </div>
          <div class="flex-grow-1">
            <label class="text-muted small fw-medium mb-1">{{
              $t("NIK")
            }}</label>
            <div class="fw-medium text-dark">{{ user.nik || "-" }}</div>
          </div>
        </div>
        <hr class="my-3 text-muted opacity-25" />
      </div>

      <!-- No. Telepon -->
      <div class="col-md-6">
        <div class="d-flex align-items-start">
          <div class="flex-shrink-0 me-3">
            <div
              class="icon-box bg-light text-primary rounded-3 d-flex align-items-center justify-content-center"
              style="width: 50px; height: 50px"
            >
              <i class="fa fa-phone fa-lg"></i>
            </div>
          </div>
          <div class="flex-grow-1">
            <label class="text-muted small fw-medium mb-1">{{
              $t("Phone Number")
            }}</label>
            <div class="fw-medium text-dark">{{ user.telp || "-" }}</div>
          </div>
        </div>
        <hr class="my-3 text-muted opacity-25" />
      </div>

      <!-- Tempat, Tanggal Lahir -->
      <div class="col-md-6">
        <div class="d-flex align-items-start">
          <div class="flex-shrink-0 me-3">
            <div
              class="icon-box bg-light text-primary rounded-3 d-flex align-items-center justify-content-center"
              style="width: 50px; height: 50px"
            >
              <i class="fa fa-calendar-alt fa-lg"></i>
            </div>
          </div>
          <div class="flex-grow-1">
            <label class="text-muted small fw-medium mb-1">{{
              $t("Place Date of Birth")
            }}</label>
            <div class="fw-medium text-dark">
              {{ user.tempatlahir || "-" }},
              {{ formatDate(user.tanggallahir, locale) || "-" }}
            </div>
          </div>
        </div>
        <hr class="my-3 text-muted opacity-25" />
      </div>

      <!-- Alamat -->
      <div class="col-md-6">
        <div class="d-flex align-items-start">
          <div class="flex-shrink-0 me-3">
            <div
              class="icon-box bg-light text-primary rounded-3 d-flex align-items-center justify-content-center"
              style="width: 50px; height: 50px"
            >
              <i class="fa fa-map-pin fa-lg"></i>
            </div>
          </div>
          <div class="flex-grow-1">
            <label class="text-muted small fw-medium mb-1">{{
              $t("Address")
            }}</label>
            <div class="fw-medium text-dark">{{ user.alamat || "-" }}</div>
          </div>
        </div>
        <hr class="my-3 text-muted opacity-25" />
      </div>

      <!-- Kode Kabupaten -->
      <div class="col-md-6">
        <div class="d-flex align-items-start">
          <div class="flex-shrink-0 me-3">
            <div
              class="icon-box bg-light text-primary rounded-3 d-flex align-items-center justify-content-center"
              style="width: 50px; height: 50px"
            >
              <i class="fa fa-map fa-lg"></i>
            </div>
          </div>
          <div class="flex-grow-1">
            <label class="text-muted small fw-medium mb-1">{{
              $t("District Code")
            }}</label>
            <div class="fw-medium text-dark">
              {{ user.kodekabupaten || "-" }}
            </div>
          </div>
        </div>
        <hr class="my-3 text-muted opacity-25" />
      </div>

      <!-- NIP (ASN Only) -->
      <div v-if="!isNonAsn" class="col-md-6">
        <div class="d-flex align-items-start">
          <div class="flex-shrink-0 me-3">
            <div
              class="icon-box bg-light text-primary rounded-3 d-flex align-items-center justify-content-center"
              style="width: 50px; height: 50px"
            >
              <i class="fa fa-id-badge fa-lg"></i>
            </div>
          </div>
          <div class="flex-grow-1">
            <label class="text-muted small fw-medium mb-1">{{
              $t("NIP")
            }}</label>
            <div class="fw-medium text-dark">{{ user.nip || "-" }}</div>
          </div>
        </div>
        <hr class="my-3 text-muted opacity-25" />
      </div>

      <!-- No. Karpeg (ASN Only) -->
      <div v-if="!isNonAsn" class="col-md-6">
        <div class="d-flex align-items-start">
          <div class="flex-shrink-0 me-3">
            <div
              class="icon-box bg-light text-primary rounded-3 d-flex align-items-center justify-content-center"
              style="width: 50px; height: 50px"
            >
              <i class="fa fa-address-card fa-lg"></i>
            </div>
          </div>
          <div class="flex-grow-1">
            <label class="text-muted small fw-medium mb-1">{{
              $t("Employee ID Card Number")
            }}</label>
            <div class="fw-medium text-dark">{{ user.no_karpeg || "-" }}</div>
          </div>
        </div>
        <hr class="my-3 text-muted opacity-25" />
      </div>

      <!-- Jenis Kelamin -->
      <div class="col-md-6">
        <div class="d-flex align-items-start">
          <div class="flex-shrink-0 me-3">
            <div
              class="icon-box bg-light text-primary rounded-3 d-flex align-items-center justify-content-center"
              style="width: 50px; height: 50px"
            >
              <i class="fa fa-venus-mars fa-lg"></i>
            </div>
          </div>
          <div class="flex-grow-1">
            <label class="text-muted small fw-medium mb-1">{{
              $t("Gender")
            }}</label>
            <div class="fw-medium text-dark">
              {{ user.genders?.[0]?.namajeniskelamin || "-" }}
            </div>
          </div>
        </div>
        <hr class="my-3 text-muted opacity-25" />
      </div>

      <!-- Jenis Pengguna -->
      <div class="col-md-6">
        <div class="d-flex align-items-start">
          <div class="flex-shrink-0 me-3">
            <div
              class="icon-box bg-light text-primary rounded-3 d-flex align-items-center justify-content-center"
              style="width: 50px; height: 50px"
            >
              <i class="fa fa-user-tag fa-lg"></i>
            </div>
          </div>
          <div class="flex-grow-1">
            <label class="text-muted small fw-medium mb-1">{{
              $t("User Type")
            }}</label>
            <div class="fw-medium text-dark">
              {{ user["user-types"]?.[0]?.namajenispengguna || "-" }}
            </div>
          </div>
        </div>
        <hr class="my-3 text-muted opacity-25" />
      </div>

      <!-- Jenis Pegawai -->
      <div class="col-md-6">
        <div class="d-flex align-items-start">
          <div class="flex-shrink-0 me-3">
            <div
              class="icon-box bg-light text-primary rounded-3 d-flex align-items-center justify-content-center"
              style="width: 50px; height: 50px"
            >
              <i class="fa fa-user-tie fa-lg"></i>
            </div>
          </div>
          <div class="flex-grow-1">
            <label class="text-muted small fw-medium mb-1">{{
              $t("Employee Type")
            }}</label>
            <div class="fw-medium text-dark">
              {{ user["employee-types"]?.[0]?.namajenispegawai || "-" }}
            </div>
          </div>
        </div>
        <hr class="my-3 text-muted opacity-25" />
      </div>

      <!-- Minat -->
      <div v-if="user.minat" class="col-12">
        <div class="d-flex align-items-start">
          <div class="flex-shrink-0 me-3">
            <div
              class="icon-box bg-light text-primary rounded-3 d-flex align-items-center justify-content-center"
              style="width: 50px; height: 50px"
            >
              <i class="fa fa-heart fa-lg"></i>
            </div>
          </div>
          <div class="flex-grow-1">
            <label class="text-muted small fw-medium mb-1">{{
              $t("Interests")
            }}</label>
            <div class="d-flex flex-wrap gap-2 mt-1">
              <span
                v-for="(interest, index) in parseBubble(user.minat)"
                :key="index"
                class="badge bg-light text-primary border border-primary px-3 py-2"
              >
                {{ interest }}
              </span>
            </div>
          </div>
        </div>
        <hr class="my-3 text-muted opacity-25" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from "vue";
import { useI18n } from "vue-i18n";
import { formatDate } from "@/utils/formatDate";
import { parseBubble } from "@/utils/parseBubble";

const { locale } = useI18n();

const props = defineProps({
  user: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  isNonAsn: {
    type: Boolean,
    default: false,
  },
});

const formattedName = computed(() => {
  const parts = [props.user.gelardepan, props.user.nama].filter(Boolean);

  let name = parts.join(" ");

  const gelarBelakang = props.user.gelarbelakang;
  if (gelarBelakang) {
    name += `, ${gelarBelakang}`;
  }

  return name || "-";
});

function unescapeHtml(safe) {
  if (!safe) return "";
  return safe
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
}
</script>
