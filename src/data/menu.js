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
    "title": "Agenda",
    "icon": "stroke-calendar",
    "iconf": "fill-calendar",
    "type": "sub",
    "active": false,
    "children": [
      {
        "path": "/agenda",
        "title": "Daftar Agenda",
        "type": "link",
        "active": false
      },
      {
        "path": "/agenda/agenda-categories",
        "title": "Kategori Agenda",
        "type": "link",
        "active": false
      }
    ]
    },
    {
      "title": "Laporan",
      "icon": "stroke-file",
      "iconf": "fill-file",
      "type": "link",
      "path": "/reports",
      "active": false
    },
    {
    "title": "Organisasi",
    "icon": "stroke-board",
    "iconf": "fill-board",
    "type": "sub",
    "active": false,
    "children": [
      {
        "path": "/organization/fklpi",
        "title": "FKLPI P/D",
        "type": "link",
        "active": false
      },
      {
        "title": "UPTP/UPTD",
        "type": "sub",
        "active": false,
        "children": [
          {
            "path": "/organization/uptp-uptd",
            "title": "Daftar UPTP/UPTD",
            "type": "link",
            "active": false
          },
          {
            "path": "/organization/uptp-uptd-categories",
            "title": "Kategori UPTP/UPTD",
            "type": "link",
            "active": false
          }
        ]
      },
      {
        "path": "/organization/companies",
        "title": "Perusahaan",
        "type": "link",
        "active": false
      },
    ]
    },
    {
      "title": "TNA",
      "icon": "stroke-search",
      "iconf": "fill-search",
      "type": "link",
      "path": "/tna",
      "active": false
    },
    {
    "title": "Pembinaan",
    "icon": "stroke-task",
    "iconf": "fill-task",
    "type": "sub",
    "active": false,
    "children": [
      {
        "path": "/development",
        "title": "Daftar Pembinaan",
        "type": "link",
        "active":false
      },
      {
        "path": "/development/development-types",
        "title": "Jenis Pembinaan",
        "type": "link",
        "active":false
      },
      {
        "path": "/development/development-methods",
        "title": "Metode Pembinaan",
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
        "path": "/website/documents",
        "title": "Dokumen Lainnya",
        "type": "link",
        "active": false
      },
      {
        "path": "/website/faq",
        "title": "FAQ",
        "type": "link",
        "active": false
      },
      {
        "path": "/website/pages",
        "title": "Halaman",
        "type": "link",
        "active": false
      },
      {
        "title": "Pengaturan",
        "type": "sub",
        "active": false,
        "children": [
          {
            "path": "/website/settings/applications",
            "title": "Aplikasi",
            "type": "link",
            "active":false
          },
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
        ]
      },
      {
        "path": "/website/related-links",
        "title": "Link Terkait",
        "type": "link",
        "active": false
      },
      {
        "path": "/website/testimonials",
        "title": "Testimoni",
        "type": "link",
        "active":false
      },
    ]
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
          "path": "/general/roles",
          "title": "Peran",
          "type": "link",
          "active":false
        },
        {
          "path": "/general/regions",
          "title": "Wilayah",
          "type": "link",
          "active":false
        },
      ]
    },
    {
      "title": "Kepengurusan",
      "icon": "stroke-social",
      "iconf":"fill-social",
      "type": "sub",
      "active": false,
      "allowedLevels": [userLevelAdministrator],
      "children": [
        {
          "path": "/management/positions",
          "title": "Jabatan",
          "type": "link",
          "active":false
        },
        {
        "title": "Data Kepengurusan",
        "type": "sub",
        "active": false,
        "children": [
          {
            "path": "/management/blood-types",
            "title": "Golongan Darah",
            "type": "link",
            "active":false
          },
          {
            "path": "/management/genders",
            "title": "Jenis Kelamin",
            "type": "link",
            "active":false
          },
          {
            "path": "/management/professions",
            "title": "Profesi",
            "type": "link",
            "active":false
          },
          {
            "path": "/management/status-positions",
            "title": "Status Pengurus",
            "type": "link",
            "active":false
          },
        ]
      },
      {
        "path": "/management/periods",
        "title": "Periode",
        "type": "link",
        "active": false
      },
      {
        "path": "/management/scale",
        "title": "Skala",
        "type": "link",
        "active": false
      },
      ]
    },
    {
      "title": "Program Pelatihan",
      "icon": "stroke-learning",
      "iconf": "fill-learning",
      "type": "link",
      "path": "/training",
      "active": false
    },
  ]
}
