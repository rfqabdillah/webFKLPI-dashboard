import {createRouter, createWebHashHistory} from "vue-router";
import Body from '../components/body';
import { userLevelUmum } from '@/constants/userLevels';
import { menuItems } from '../data/menu';

import Default from '@/pages/dashboard/defaultPage.vue';
import Login from '@/auth/login.vue';
import Register from '@/auth/register.vue';
import ForgetPassword from '@/auth/forgetpassword.vue';
import ResetPassword from '@/auth/resetpassword.vue';

import IndexEmployments from "@/pages/employment/index.vue";

import IndexEvents from "@/pages/agenda/events/index.vue";
import IndexEventCategories from "@/pages/agenda/eventCategories/index.vue";

import IndexNews from "@/pages/news/news/index.vue";
import IndexNewsCategories from "@/pages/news/newsCategories/index.vue";
import IndexPages from "@/pages/pages/index.vue";
import IndexAnnouncements from "@/pages/announcements/index.vue";
import IndexRelatedLinks from "@/pages/relatedLinks/index.vue";
import IndexMeasurementBooks from "@/pages/measurementBooks/index.vue";
import IndexDocumentTypes from "@/pages/documentTypes/index.vue";
import IndexOrganizationStructure from "@/pages/profiles/organizationStructure/index.vue"
import IndexGallery from "@/pages/gallery/gallery/index.vue";
import IndexPhotoGallery from "@/pages/gallery/photoGallery/index.vue";
import IndexVideos from "@/pages/videos/index.vue";
import IndexBanners from "@/pages/settings/banners/index.vue";
import IndexMenus from "@/pages/settings/menu/index.vue";
import IndexContacts from "@/pages/settings/contacts/index.vue";

// Mulai Referensi
import IndexUsers from "@/pages/general/user/index.vue";
import IndexRegions from "@/pages/general/regions/index.vue";
import IndexUserTypes from "@/pages/general/userTypes/index.vue";

import IndexVocationalFields from "@/pages/personnel/vocationalFields/index.vue";
import IndexVocationalSubfields from "@/pages/personnel/vocationalSubfields/index.vue";
import IndexRanks from "@/pages/personnel/ranks/index.vue";
import IndexScale from "@/pages/personnel/scale/index.vue";
import IndexLevelCategories from "@/pages/personnel/levelCategories/index.vue";
import IndexPositionLevels from "@/pages/personnel/positionLevels/index.vue";
import IndexEducationLevels from "@/pages/personnel/educationLevels/index.vue";
import IndexWorkUnits from "@/pages/personnel/workUnits/index.vue";
import IndexEmployeeStatuses from "@/pages/personnel/employeeStatuses/index.vue";
import IndexEmployeeTypes from "@/pages/personnel/employeeTypes/index.vue";


import IndexUserProfile from "@/pages/generalUser/userProfile/index.vue";
import IndexAgendaPage from "@/pages/generalUser/agendaPage/index.vue";
import IndexAgendaDetailPage from "@/pages/generalUser/agendaPage/agendaDetailIndex.vue";
import IndexMyAgendaPage from "@/pages/generalUser/userAgenda/index.vue";
import IndexTestimoniPage from "@/pages/generalUser/testimoni/index.vue";
import IndexAdminTestimoni from "@/pages/testimoni/index.vue";
import IndexAccount from "@/pages/account/index.vue";

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
        path: '/employments',
        component: Body,
        meta: {
          requiresAuth: true,
        },
        children: [
          {
            path: "",
            name: "Employment",
            component: IndexEmployments,
            meta: {
              title: "Kepegawaian",
            },
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
            path: "events",
            name: "Agenda_events",
            component: IndexEvents,
            meta: {
              title: "Daftar Agenda",
            },
          },
          {
            path: "event-categories",
            name: "Agenda_eventCategories",
            component: IndexEventCategories,
            meta: {
              title: "Kategori Agenda",
            },
          },
        ]
      },
      {
        path: '/website/testimoni',
        component: Body,
        meta: {
          requiresAuth: true,
        },
        children: [
          {
            path: "",
            name: "AdminTestimoni",
            component: IndexAdminTestimoni,
            meta: {
              title: "Kelola Testimoni",
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
            name: "news",
            component: IndexNews,
            meta: {
              title: "Daftar Berita",
            },
          },
          {
            path: "news-categories",
            name: "newsCategories",
            component: IndexNewsCategories,
            meta: {
              title: "Kategori Berita",
            },
          },
          {
            path: "pages",
            name: "Pages",
            component: IndexPages,
            meta: {
              title: "Halaman",
            },
          },
          {
            path: "announcements",
            name: "Announcements",
            component: IndexAnnouncements,
            meta: {
              title: "Pengumuman",
            },
          },
          {
            path: "related-links",
            name: "Related Links",
            component: IndexRelatedLinks,
            meta: {
              title: "Link Terkait",
            },
          },
          {
            path: "documents",
            name: "Measurement books (Dokumen)",
            component: IndexMeasurementBooks,
            meta: {
              title: "Dokumen",
            },
          },
          {
            path: "document-types",
            name: "Document Types",
            component: IndexDocumentTypes,
            meta: {
              title: "Jenis Dokumen",
            },
          }, 
          {
            path: "gallery",
            name: "Gallery",
            component: IndexGallery,
            meta: {
              title: "Galeri",
            },
          },
          {
            path: "photo-gallery",
            name: "Photo Gallery",
            component: IndexPhotoGallery,
            meta: {
              title: "Galeri Foto",
            },
          },
          {
            path: "videos",
            name: "Videos",
            component: IndexVideos,
            meta: {
              title: "Vidio",
            },
          },
          {
            path: "profiles/organization-structure",
            name: "Profile_organization Structure",
            component: IndexOrganizationStructure,
            meta: {
              title: "Struktur Organisasi",
            },
          },
          {
            path: "settings/banners",
            name: "Settings_banners",
            component: IndexBanners,
            meta: {
              title: "Banner",
            },
          },
          {
            path: "settings/menus",
            name: "Settings_menus",
            component: IndexMenus,
            meta: {
              title: "Menu",
            },
          },
          {
            path: "settings/contacts",
            name: "Settings_contacts",
            component: IndexContacts,
            meta: {
              title: "Kontak",
            },
          },
        ]
      },
      {
        path: '/my-profile',
        component: Body,
        meta: {
          requiresAuth: true,
        },
        children: [
          {
            path: "",
            name: "MyProfile",
            component: IndexUserProfile,
            meta: {
              title: "Profil Saya",
            },
          },
        ]
      },
      {
        path: '/account',
        component: Body,
        meta: {
          requiresAuth: true,
        },
        children: [
          {
            path: "",
            name: "Account",
            component: IndexAccount,
            meta: {
              title: "Akun Saya",
            },
          },
        ]
      },
      {
        path: '/list-agenda',
        component: Body,
        meta: {
          requiresAuth: true,
        },
        children: [
          {
            path: "",
            name: "AgendaPage",
            component: IndexAgendaPage,
            meta: {
              title: "Jadwal Agenda",
            },
          },
        ]
      },

      {
        path: '/agenda-detail/:id',
        component: Body,
        meta: {
          requiresAuth: true,
        },
        children: [
          {
            path: "",
            name: "AgendaDetailPage",
            component: IndexAgendaDetailPage,
            meta: {
              title: "Detail Agenda",
            },
          },
        ]
      },

      {
        path: '/my-agenda',
        component: Body,
        meta: {
          requiresAuth: true,
        },
        children: [
          {
            path: "",
            name: "MyAgendaPage",
            component: IndexMyAgendaPage,
            meta: {
              title: "Agenda Saya",
            },
          },
        ]
      },

      {
        path: '/testimoni',
        component: Body,
        meta: {
          requiresAuth: true,
        },
        children: [
          {
            path: "",
            name: "TestimoniPage",
            component: IndexTestimoniPage,
            meta: {
              title: "Testimoni Saya",
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
            name: "General_users",
            component: IndexUsers,
            meta: {
              title: "Pengguna",
            },
          },
          {
            path: "regions",
            name: "General_regions",
            component: IndexRegions,
            meta: {
              title: "Wilayah",
            },
          },
          {
            path: "user-types",
            name: "General_userTypes",
            component: IndexUserTypes,
            meta: {
              title: "Jenis Pengguna",
            },
          },
        ]
      },
      {
        path: '/personnel',
        component: Body,
        meta: {
          requiresAuth: true,
        },
        children: [
          // {
          //   path: 'vocational-fields',
          //   name: 'Personnel_VocationalFields',
          //   component: IndexVocationalFields,
          //   meta: {
          //     title: 'Kejuruan',
          //   }
          // },
          // {
          //   path: 'vocational-subfields',
          //   name: 'Personnel_VocationalSubfields',
          //   component: IndexVocationalSubfields,
          //   meta: {
          //     title: 'Sub Kejuruan',
          //   }
          // },
          {
            path: 'ranks',
            name: 'Personnel_Ranks',
            component: IndexRanks,
            meta: {
              title: 'Pangkat',
            }
          },
          {
            path: 'level-categories',
            name: 'Personnel_LevelCategories',
            component: IndexLevelCategories,
            meta: {
              title: 'Jenjang Kategori',
            }
          },
          {
            path: 'position-levels',
            name: 'Personnel_PositionLevels',
            component: IndexPositionLevels,
            meta: {
              title: 'Jenjang Jabatan',
            }
          },
          {
            path: 'education-levels',
            name: 'Personnel_EducationLevels',
            component: IndexEducationLevels,
            meta: {
              title: 'Jenjang Pendidikan',
            }
          },
          {
            path: 'work-units',
            name: 'Personnel_WorkUnits',
            component: IndexWorkUnits,
            meta: {
              title: 'Unit Kerja',
            }
          },
          {
            path: 'employee-statuses',
            name: 'Personnel_EmployeStatuses',
            component: IndexEmployeeStatuses,
            meta: {
              title: 'Status Pegawai',
            }
          },
          {
            path: 'employee-types',
            name: 'Personnel_EmployeTypes',
            component: IndexEmployeeTypes,
            meta: {
              title: 'Jenis Pegawai',
            }
          },
          {
            path: 'scale',
            name: 'Personnel_Scale',
            component: IndexScale,
            meta: {
              title: 'Skala',
            }
          },
        ]
      },


]
const router=createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
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
    document.title = to.meta.title;
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
          const userLevel = userData?.data?.[0]?.id_level || userData?.data?.[0]?.roles?.id_level;
          
          if (userLevel === userLevelUmum) {
            // User "umum" should not access dashboard, redirect to profile
            next('/my-profile');
            return;
          }
        }
      } catch (error) {
        console.error('Error checking user level in router guard:', error);
      }
    }

    try {
        const userDataString = localStorage.getItem('userData');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          const userLevel = userData?.data?.[0]?.id_level || userData?.data?.[0]?.roles?.id_level;
          
          const accessAllowed = checkMenuAccess(menuItems.data, to.path, userLevel);
          
          if (accessAllowed === false) {
            if (userLevel === userLevelUmum) {
              next('/my-profile');
            } else {
              next('/'); 
            }
            return;
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