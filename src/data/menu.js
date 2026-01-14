import { userLevelUmum, userLevelAdministrator } from '../constants/userLevels';

export var menuItems = {
  "data": [
    {
      "headTitle1": "General",
      "type": "headtitle"
    },
    {
      "title": "Beranda",
      "icon": "stroke-home",
      "iconf": "fill-home",
      "type": "link",
      "path": "/",
      "active": false
    },
    {
      "title": "Kepegawaian",
      "icon": "stroke-user",
      "iconf": "fill-user",
      "type": "link",
      "path": "/employments",
      "active": false
    },
    {
      "title": "Program",
      "icon": "stroke-calendar",
      "iconf":"settings-hex",
      "type": "sub",
      "active": false,
      "children": [
        {
          "path": "/programs",
          "title": "Daftar Program",
          "type": "link",
          "active":false
        },
        {
          "path": "/program-categories",
          "title": "Kategori Program",
          "type": "link",
          "active":false
        },
      ]
    },
    {
    "title": "Website",
    "icon": "stroke-internationalization",
    "iconf": "fill-internationalization",
    "type": "sub",
    "active": false,
    "children": [
      {
        "title": "Berita",
        "type": "sub",
        "active": false,
        "children": [
          {
            "path": "/website/news",
            "title": "Daftar Berita",
            "type": "link",
            "active": false
          },
          {
            "path": "/website/news-categories",
            "title": "Kategori Berita",
            "type": "link",
            "active": false
          }
        ]
      },
      {
        "path": "/website/pages",
        "title": "Halaman",
        "type": "link",
        "active":false
      },
      {
        "path": "/website/announcements",
        "title": "Pengumuman",
        "type": "link",
        "active":false
      },
      {
        "path": "/website/related-links",
        "title": "Link Terkait",
        "type": "link",
        "active":false
      },
      {
        "path": "/website/documents",
        "title": "Dokumen",
        "type": "link",
        "active":false
      },
      
      {
        "path": "/website/document-types",
        "title": "Jenis Dokumen",
        "type": "link",
        "active":false
      },
      {
        "path": "/website/testimoni",
        "title": "Testimoni",
        "type": "link",
        "active":false
      },
      {
        "title": "Galeri",
        "type": "sub",
        "active": false,
        "children": [
          {
            "path": "/website/gallery",
            "title": "Galeri",
            "type": "link",
            "active":false
          },
          {
            "path": "/website/photo-gallery",
            "title": "Galeri Foto",
            "type": "link",
            "active":false
          },
        ]
      },
      {
        "path": "/website/videos",
        "title": "Video",
        "type": "link",
        "active":false
      },
      {
        "title": "Profil",
        "type": "sub",
        "active": false,
        "children": [
          {
            "path": "/website/profiles/organization-structure",
            "title": "Struktur Organisasi",
            "type": "link",
            "active":false
          },
        ]
      },
      {
        "title": "Pengaturan",
        "type": "sub",
        "active": false,
        "children": [
          {
            "path": "/website/settings/banners",
            "title": "Banner",
            "type": "link",
            "active":false
          },
          {
            "path": "/website/settings/menus",
            "title": "Menu",
            "type": "link",
            "active":false
          },
          {
            "path": "/website/settings/contacts",
            "title": "Kontak",
            "type": "link",
            "active":false
          },
        ]
      },
    ]
    },
    {
      "title": "Profil Saya",
      "icon": "stroke-user",
      "iconf": "fill-user",
      "type": "link",
      "path": "/my-profile",
      "active": false,
      "allowedLevels": [userLevelUmum]
    },
    {
      "title": "Program Saya",
      "icon": "stroke-big-checklist",
      "iconf": "fill-big-checklist",
      "type": "link",
      "path": "/my-program",
      "active": false,
      "allowedLevels": [userLevelUmum]
    },
    {
      "title": "Jadwal Program",
      "icon": "stroke-calendar",
      "iconf": "fill-calendar",
      "type": "link",
      "path": "/list-program",
      "active": false,
      "allowedLevels": [userLevelUmum]
    },
    {
      "title": "Testimoni",
      "icon": "message-box",
      "iconf": "message-box",
      "type": "link",
      "path": "/testimoni",
      "active": false,
      "allowedLevels": [userLevelUmum]
    },
  
    {
      "headTitle1": "Referensi",
      "type": "headtitle",
      "allowedLevels": [userLevelAdministrator]
    },
    {
      "title": "Umum",
      "icon": "stroke-starter-kit",
      "iconf":"fill-starter-kit",
      "type": "sub",
      "active": false,
      "allowedLevels": [userLevelAdministrator],
      "children": [
        {
          "path": "/general/users",
          "title": "Pengguna",
          "type": "link",
          "active":false
        },
        {
          "path": "/general/regions",
          "title": "Wilayah",
          "type": "link",
          "active":false
        },
        {
          "path": "/general/user-types",
          "title": "Jenis Pengguna",
          "type": "link",
          "active":false
        },
      ]
    },
    {
      "title": "Kepegawaian",
      "icon": "stroke-social",
      "iconf":"fill-social",
      "type": "sub",
      "active": false,
      "allowedLevels": [userLevelAdministrator],
      "children": [
        {
          "title": "Data Kepegawaian",
          "type": "sub",
          "active": false,
          "children": [
            {
              "path": "/personnel/professions",
              "title": "Profesi",
              "type": "link",
              "active": false
            },
            {
              "path": "/personnel/employee-statuses",
              "title": "Status Pegawai",
              "type": "link",
              "active": false
            }
          ]
        },
        // {
        //   "path": "/personnel/vocational-fields",
        //   "title": "Kejuruan",
        //   "type": "link",
        //   "active":false
        // },
        // {
        //   "path": "/personnel/vocational-subfields",
        //   "title": "Sub Kejuaraan",
        //   "type": "link",
        //   "active":false
        // },
        {
          "path": "/personnel/ranks",
          "title": "Pangkat",
          "type": "link",
          "active":false
        },
        {
          "path": "/personnel/level-categories",
          "title": "Jenjang Kategori",
          "type": "link",
          "active":false
        },
        {
          "path": "/personnel/position-levels",
          "title": "Jenjang jabatan",
          "type": "link",
          "active":false
        },
        {
          "path": "/personnel/education-levels",
          "title": "Jenjang Pendidikan",
          "type": "link",
          "active":false
        },
        {
          "path": "/personnel/work-units",
          "title": "Unit Kerja",
          "type": "link",
          "active":false
        },
        {
          "path": "/personnel/scale",
          "title": "Skala",
          "type": "link",
          "active":false
        },
      ]
    },

  ]
}
