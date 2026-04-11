import {createRouter, createWebHistory, createWebHashHistory} from "vue-router";
import Body from '../components/body';
import { userLevelUmum } from '@/constants/userLevels';
import { menuItems } from '../data/menu';

import Default from '@/pages/dashboard/defaultPage.vue';
import Login from '@/auth/login.vue';
import Register from '@/auth/register.vue';
import ForgetPassword from '@/auth/forgetpassword.vue';
import ResetPassword from '@/auth/resetpassword.vue';
import authSso from '../auth/auth_sso.vue';

import AgendaIndex from "@/pages/agenda/agenda/index.vue"
import KategoriAgendaIndex from "@/pages/agenda/kategoriAgenda/index.vue"

import MouIndex from "@/pages/dokumen/mou/index.vue";
import LaporanIndex from "@/pages/dokumen/laporan/index.vue";

import TnaTrainingIndex from "@/pages/pelatihan/tnaPelatihan/index.vue";

import FKLPIIndex from "@/pages/organisasi/organisasi/fklpi/index.vue"
import PerusahaanIndex from "@/pages/organisasi/perusahaan/index.vue";
import LembagaIndex from "@/pages/organisasi/lembaga/lembaga/index.vue";
import JenisLembagaIndex from "@/pages/organisasi/lembaga/jenisLembaga/index.vue";

import PembinaanIndex from "@/pages/pembinaan/daftarPembinaan/index.vue";
import JenisPembinaanIndex from "@/pages/pembinaan/jenisPembinaan/index.vue";
import MetodePembinaanIndex from "@/pages/pembinaan/metodePembinaan/index.vue";

import AplikasiIndex from "@/pages/website/settings/aplikasi/index.vue";
import BannerIndex from "@/pages/website/settings/banners/index.vue";
import MenuIndex from "@/pages/website/settings/menu/index.vue";
import DokumenIndex from "@/pages/website/dokumen/index.vue";
import FaqIndex from "@/pages/website/faq/index.vue";
import HalamanIndex from "@/pages/website/halaman/index.vue";
import BeritaIndex from "@/pages/website/berita/berita/index.vue";
import KategoriBeritaIndex from "@/pages/website/berita/kategoriBerita/index.vue";
import LinkTerkaitIndex from "@/pages/website/linkTerkait/index.vue";

// Mulai referensi
import PenggunaIndex from "@/pages/referensi/umum/pengguna/index.vue";
import PeranIndex from "@/pages/referensi/umum/peran/index.vue";
import WilayahIndex from "@/pages/referensi/umum/wilayah/index.vue";
import TestimoniIndex from "@/pages/website/testimoni/index.vue";  

import JabatanIndex from "@/pages/referensi/kepengurusan/jabatan/index.vue";
import StatusPengurusIndex from "@/pages/referensi/kepengurusan/dataKepengurusan/statusPengurus/index.vue";
import ProfesiIndex from "@/pages/referensi/kepengurusan/dataKepengurusan/profesi/index.vue";
import GolonganDarahIndex from "@/pages/referensi/kepengurusan/dataKepengurusan/golonganDarah/index.vue";
import JenisKelaminIndex from "@/pages/referensi/kepengurusan/dataKepengurusan/jenisKelamin/index.vue";
import PeriodeIndex from "@/pages/referensi/kepengurusan/periode/index.vue";
import SkalaIndex from "@/pages/referensi/kepengurusan/skala/index.vue";

import ProgramPelatihanIndex from "@/pages/referensi/programPelatihan/index.vue";



const routes =[
    {
        path: '/auth',
        children: [
          {
            path: '',
            name: 'Login',
            component: Login,
            meta: {
            title: 'Login',
            }
          },
          {
            path: 'auth_sso',
            name: 'AUTH SSO',
            component: authSso,
            meta: {
              title: ' login',
            }
          },
        ]
    },
    {
      path: '/register',
      children: [
        {
          path: '',
          name: 'Register',
          component: Register,
          meta: {
            title: 'Register',
          }
        },
      ]
    },
  {
    path: '/forgetpassword',
    children: [
      {
        path: '',
        name: 'ForgetPassword',
        component: ForgetPassword,
        meta: {
          title: 'Lupa Password',
        }
      },
    ]
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword,
    meta: {
      title: 'Reset Password'
    }
  },
    {
      path: '/',
      component: Body,
      children: [
        {
          path: '',
          name: 'defaultRoot',
          component: Default,
          meta: {
            title: 'Dashboard',
            requiresAuth: true, 
          }
        },
      ]
    },
    {
      path: '/agenda',
      component: Body,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: "",
          name: "agenda",
          component: AgendaIndex,
          meta: {
            title: "Daftar Agenda",
          },
        },
        {
          path: "agenda-categories",
          name: "kategori agenda",
          component: KategoriAgendaIndex,
          meta: {
            title: "Daftar Kategori Agenda",
          },
        },
      ]
    },
    {
      path: '/reports',
      component: Body,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: "",
          name: "laporan",
          component: LaporanIndex,
          meta: {
            title: "Laporan",
          },
        },
      ]
    },
    {
      path: '/organization',
      component: Body,
      meta: {
          requiresAuth: true,
        },
      children: [
        {
          path: "fklpi",
          name: "fklpi",
          component: FKLPIIndex,
          meta: {
            title: "FKLPI P/D",
          },
        },
        {
          path: "uptp-uptd",
          name: "uptp-uptd",
          component: LembagaIndex,
          meta: {
            title: "UPTP/UPTD",
          },
        },
        {
          path: "uptp-uptd-categories",
          name: "uptp-uptd-categories",
          component: JenisLembagaIndex,
          meta: {
            title: "Kategori UPTP/UPTD",
          },
        },
        {
          path: "companies",
          name: "perusahaan",
          component: PerusahaanIndex,
          meta: {
            title: "Perusahaan",
          },
        },
      ]
    },
    {
      path: '/training',
      component: Body,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: "",
          name: "program pelatihan",
          component: ProgramPelatihanIndex,
          meta: {
            title: "Program Pelatihan",
          },
        },
      ]
    },
    {
      path: '/tna',
      component: Body,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: "",
          name: "tna pelatihan",
          component: TnaTrainingIndex,
          meta: {
            title: "TNA",
          },
        },
      ]
    },
    {
      path: '/development',
      component: Body,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: "",
          name: "pembinaan",
          component: PembinaanIndex,
          meta: {
            title: "Daftar Pembinaan",
          },
        },
        {
          path: "development-types",
          name: "jenis pembinaan",
          component: JenisPembinaanIndex,
          meta: {
            title: "Jenis Pembinaan",
          },
        },
        {
          path: "development-methods",
          name: "metode pembinaan",
          component: MetodePembinaanIndex,
          meta: {
            title: "Metode Pembinaan",
          },
        },
      ]
    },
      {
          path: '/website',
          component: Body,
          meta: {
            requiresAuth: true,
          },
          children: [
            {
              path: "news",
              name: "berita",
              component: BeritaIndex,
              meta: {
                title: "Daftar Berita",
              },
            },
            {
              path: "news-categories",
              name: "kategoriBerita",
              component: KategoriBeritaIndex,
              meta: {
                title: "Kategori Berita",
              },
            },
            {
              path: "documents",
              name: "dokumen",
              component: DokumenIndex,
              meta: {
                title: "Dokumen",
              },
            },
            {
              path: "faq",
              name: "faq",
              component: FaqIndex,
              meta: {
                title: "FAQ",
              },
            },
            {
              path: "pages",
              name: "pages",
              component: HalamanIndex,
              meta: {
                title: "Halaman",
              },
            },
            {
              path: "settings/banners",
              name: "banner",
              component: BannerIndex,
              meta: {
                title: "Banner",
              },
            },
            {
              path: "settings/menus",
              name: "menu",
              component: MenuIndex,
              meta: {
                title: "Menu",
              },
            },
            {
              path: "settings/applications",
              name: "aplikasi",
              component: AplikasiIndex,
              meta: {
                title: "Aplikasi",
              },
            },
            {
              path: "testimonials",
              name: "testimoni",
              component: TestimoniIndex,
              meta: {
                title: "Testimoni",
              },
            },
            {
              path: "related-links",
              name: "link terkait",
              component: LinkTerkaitIndex,
              meta: {
                title: "Link Terkait",
              },
            },
          ]
        },
        {
          path: '/general',
          component: Body,
          meta: {
            requiresAuth: true,
          },
          children: [
            {
              path: "users",
              name: "pengguna",
              component: PenggunaIndex,
              meta: {
                title: "Pengguna",
              },
            },
            {
              path: "roles",
              name: "peran",
              component: PeranIndex,
              meta: {
                title: "Peran",
              },
            },
            {
              path: "regions",
              name: "wilayah",
              component: WilayahIndex,
              meta: {
                title: "Wilayah",
              },
            },
          ]
        },
        {
          path: '/management',
          component: Body,
          meta: {
            requiresAuth: true,
          },
          children: [
            {
              path: "positions",
              name: "jabatan",
              component: JabatanIndex,
              meta: {
                title: "Jabatan",
              },
            },
            {
              path: "blood-types",
              name: "golongan darah",
              component: GolonganDarahIndex,
              meta: {
                title: "Golongan Darah",
              },
            },
            {
              path: "genders",
              name: "jenis kelamin",
              component: JenisKelaminIndex,
              meta: {
                title: "Jenis Kelamin",
              },
            },
            {
              path: "professions",
              name: "profesi",
              component: ProfesiIndex,
              meta: {
                title: "Profesi",
              },
            },
            {
              path: "status-positions",
              name: "status Pengurus",
              component: StatusPengurusIndex,
              meta: {
                title: "Status Pengurus",
              },
            },
            {
              path: "periods",
              name: "Periode",
              component: PeriodeIndex,
              meta: {
                title: "Periode",
              },
            },
            {
              path: "scale",
              name: "skala",
              component: SkalaIndex,
              meta: {
                title: "Skala",
              },
            },
          ]
        },

]
const router=createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

const checkMenuAccess = (items, path, userLevel) => {
  for (const item of items) {
    if (item.path === path) {
      if (item.allowedLevels && Array.isArray(item.allowedLevels)) {
        return item.allowedLevels.includes(userLevel);
      }
      return true;
    }

    if (item.children) {
      const childCheck = checkMenuAccess(item.children, path, userLevel);
      
      if (childCheck !== null) {
        if (item.allowedLevels && Array.isArray(item.allowedLevels)) {
            if (!item.allowedLevels.includes(userLevel)) {
                return false;
            }
        }
        return childCheck;
      }
    }
  }
  return null;
};

router.beforeEach((to, from, next) => {
  
  

  if (to.meta.title) {
    document.title = `${to.meta.title} - Forum Komunikasi Lembaga Pelatihan dengan Industri`;
  }

  if (to.matched.some(record => record.meta.requiresAuth)) {
    const token = localStorage.getItem('token');
    
    if (!token) {
      next('/auth');
      return;
    }
    
    if (to.path === '/' || to.name === 'defaultRoot') {
      try {
        const userDataString = localStorage.getItem('userData');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          const userLevel = userData?.data?.[0]?.id_level || userData?.data?.[0]?.roles?.id_level || userData?.data?.[0]?.id_peran;
          
          // if (userLevel === userLevelUmum) {
          //   next('/my-profile');
          //   return;
          // }
        }
      } catch (error) {
        console.error('Error checking user level in router guard:', error);
      }
    }

    try {
        const userDataString = localStorage.getItem('userData');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          const userLevel = userData?.data?.[0]?.id_level || userData?.data?.[0]?.roles?.id_level || userData?.data?.[0]?.id_peran;
          
          const accessAllowed = checkMenuAccess(menuItems.data, to.path, userLevel);
          
          if (accessAllowed === false) {
            // if (userLevel === userLevelUmum) {
            //   next('/my-profile');
            // } else {
            //   next('/'); 
            // }
            // return;
          }
        }
    } catch (e) {
        console.error("Error checking menu access:", e);
    }
    
    next();
  } else {
    next();
  }
});

export default router;