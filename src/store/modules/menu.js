import {menuItems} from '../../data/menu.js';
import BonusUI from '../../data/bonusui';
import { userLevelUmum } from '../../constants/userLevels';



const getCurrentUserLevel = () => {
  try {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      if (userData?.data?.[0]?.id_level) {
        return userData.data[0].id_level;
      }
      if (userData?.data?.[0]?.roles?.id_level) {
        return userData.data[0].roles.id_level;
      }
      if (userData?.data?.[0]?.id_peran) {
        return userData.data[0].id_peran;
      }
    }
  } catch (error) {
    console.error('Error getting user level:', error);
  }
  return null;
};

const filterMenuByLevel = (items, userLevel) => {
  if (!items || !Array.isArray(items)) return [];
  
  const isUmumUser = userLevel === userLevelUmum;
  
  return items.filter(item => {
    if (isUmumUser && item.type === 'headtitle') {
      return false;
    }
    
    if (isUmumUser) {
      if (!item.allowedLevels || !Array.isArray(item.allowedLevels)) {
        return false;
      }
      return item.allowedLevels.includes(userLevel);
    } else {
      // if (item.type === 'headtitle') return true;
      
      if (item.allowedLevels && Array.isArray(item.allowedLevels)) {
        if (!userLevel || !item.allowedLevels.includes(userLevel)) {
          return false;
        }
      }
      
      return true;
    }
  }).map(item => {
    if (item.children && Array.isArray(item.children)) {
      return {
        ...item,
        children: filterMenuByLevel(item.children, userLevel)
      };
    }
    return item;
  });
};

const userLevel = getCurrentUserLevel();
const filteredMenuData = filterMenuByLevel(menuItems.data, userLevel);

const state = {
  data: filteredMenuData, 
  originalData: menuItems.data, 
  megamenu: BonusUI.data,
  searchData: [],
  togglesidebar: true,
  activeoverlay : false,
  searchOpen : false,
  customizer: '',
  hideRightArrowRTL: false,
  hideLeftArrowRTL: true,
  hideRightArrow: true,
  hideLeftArrow: true,
  width: 0,
  height: 0,
  margin: 0,
  menuWidth: 0,
};


const getters = {
  isUmumUser: () => {
    const userLevel = getCurrentUserLevel();
    return userLevel === userLevelUmum;
  },
};


const mutations = {
  opensidebar: (state) => {
    state.togglesidebar = !state.togglesidebar;
    if (window.innerWidth < 991) {
      state.activeoverlay = true;
    } else {
      state.activeoverlay = false;
    }
  },
  resizetoggle: (state) => {
    if (window.innerWidth < 992) {
      state.togglesidebar = false;
    } else {
      state.togglesidebar = true;
    }
  },
  searchTerm: (state, term) => {
    let items = [];
    var searchval = term.toLowerCase();
    state.data.filter(menuItems => {
      
      if (menuItems.title) {
        if (menuItems.title.toLowerCase().includes(searchval) && menuItems.type === 'link') {
          items.push(menuItems);
        }
        if (!menuItems.children) return false;
        menuItems.children.filter(subItems => {
          if (subItems.title.toLowerCase().includes(searchval) && subItems.type === 'link') {
            subItems.icon = menuItems.icon;
            items.push(subItems);
          }
          if (!subItems.children) return false;
          subItems.children.filter(suSubItems => {
            if (suSubItems.title.toLowerCase().includes(searchval)) {
              suSubItems.icon = menuItems.icon;
              items.push(suSubItems);
            }
          });
        });
        state.searchData = items;
      }
    });
  },
  setBonusNavActive: (state, item) => {
    if (!item.active) {
      state.megamenu.forEach(a => {
        if (state.megamenu.includes(item))
          a.active = false;
        if (!a.children) return false;
        a.children.forEach(b => {
          if (a.children.includes(item)) {
            b.active = false;
          }
        });
      });
    }
    item.active = !item.active;
  },
  setNavActive: (state, item) => {
    if (!item.active) {
      state.data.forEach(a => {
        if (state.data.includes(item))
          a.active = false;
        if (!a.children) return false;
        a.children.forEach(b => {
          if (a.children.includes(item)) {
            b.active = false;
          }
        });
      });
    }
    item.active = !item.active;
  },
  setActiveRoute: (state, item) => {
    state.data.filter(menuItem => {
      if (menuItem !== item)
        menuItem.active = false;
      if (menuItem.children && menuItem.children.includes(item)){
        item.active = true;
        menuItem.active = true;
      }
      if (menuItem.children) {
        menuItem.children.filter(submenuItems => {
          if (submenuItems.children && submenuItems.children.includes(item)) {
            item.active = true;
            menuItem.active = true;
            submenuItems.active = true;
          }
        });
      }
    });
  },
  
  refreshMenuByUserLevel: (state) => {
    const userLevel = getCurrentUserLevel();
    state.data = filterMenuByLevel(menuItems.data, userLevel);
  }
};

const actions = {
  opensidebar: (context, term) => {
    context.commit('opensidebar', term);
  },
  resizetoggle: (context, term) => {
    context.commit('resizetoggle', term);
  },
  setBonusNavActive: (context, term) => {
    context.commit('setBonusNavActive', term);
  },
  searchTerm: (context, term) => {
    context.commit('searchTerm', term);
  },
  setNavActive: (context, item) => {
    context.commit('setNavActive', item);
  },
  setActiveRoute: (context, item) => {
    context.commit('setActiveRoute', item);
  },
  // Action to refresh menu based on user level after login
  refreshMenuByUserLevel: (context) => {
    context.commit('refreshMenuByUserLevel');
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};