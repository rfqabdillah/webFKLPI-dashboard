<template>
  <div class="card">
    <div class="card-header pb-0 card-no-border">
      <div class="header-top">
        <h5>Log Pengguna Online (< 1 Jam)</h5>
      </div>
    </div>
    <div class="card-body pt-0">
      <div
        class="table-responsive"
        style="max-height: 700px; overflow-y: auto; overflow-x: hidden"
      >
        <table class="table table-user-log">
          <tbody>
            <tr v-for="user in onlineUsers" :key="user.idpengguna">
              <td class="d-flex align-items-center">
                <img
                  v-if="user.foto"
                  class="rounded-circle img-40 me-3"
                  :src="user.foto"
                  alt="user"
                />
                <div
                  v-else
                  class="rounded-circle img-40 me-3 d-flex align-items-center justify-content-center text-white"
                  :style="{ backgroundColor: getAvatarColor(user.nama) }"
                >
                  {{ getUserInitials(user.nama) }}
                </div>
                <div class="flex-grow-1">
                  <h6 class="mb-0 f-w-600">{{ user.nama }}</h6>
                  <span class="text-muted f-12">{{
                    formatLastLogin(user.lastlogin)
                  }}</span>
                </div>
              </td>
              <td class="text-end">
                <span :class="getStatusBadgeClass(user.status)">{{
                  getStatusText(user.status)
                }}</span>
              </td>
            </tr>
            <tr v-if="onlineUsers.length === 0">
              <td colspan="2" class="text-center text-muted">
                Tidak ada pengguna online saat ini.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { getUsers } from "@/services/referensi/users";
import { getInitials, getRandomColor } from "@/utils/avatarUtils";

export default {
  name: "OnlineLogCard",
  data() {
    return {
      allUsers: [],
      onlineUsers: [],
    };
  },
  async mounted() {
    await this.fetchUsers();
  },
  methods: {
    getUserInitials(name) {
      return getInitials(name);
    },
    getAvatarColor(name) {
      return getRandomColor(name);
    },
    getStatusBadgeClass(userStatus) {
      return userStatus === "Aktif"
        ? "badge badge-light-success"
        : "badge badge-light-secondary";
    },
    getStatusText(userStatus) {
      return userStatus === "Aktif" ? "Online" : "Offline";
    },
    filterUsers() {
      if (!this.allUsers.length) {
        this.onlineUsers = [];
        return;
      }

      const now = new Date();
      const oneHour = 60 * 60 * 1000;

      // Filter users who logged in within the last 1 hour
      let filtered = this.allUsers.filter((u) => {
        const d = new Date(u.lastlogin);
        return now - d <= oneHour;
      });

      filtered.sort((a, b) => new Date(b.lastlogin) - new Date(a.lastlogin));

      this.onlineUsers = filtered.slice(0, 50);
    },
    async fetchUsers() {
      try {
        const response = await getUsers();
        if (response && response.data) {
          let usersData = [];
          if (Array.isArray(response.data)) {
            if (
              response.data.length > 0 &&
              response.data[0].data &&
              Array.isArray(response.data[0].data)
            ) {
              usersData = response.data[0].data;
            } else {
              usersData = response.data;
            }
          } else if (response.data.data && Array.isArray(response.data.data)) {
            usersData = response.data.data;
          }

          this.allUsers = usersData.filter((u) => u.lastlogin);

          this.filterUsers();
        }
      } catch (error) {
        console.error("Error fetching users for online log:", error);
      }
    },
    formatLastLogin(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
};
</script>

<style scoped>
.table-user-log tbody tr td {
  padding-bottom: 20px;
  padding-top: 20px;
  border-bottom: 1px solid #f2f4ff;
  vertical-align: middle;
}

.table-user-log tbody tr:last-child td {
  padding-bottom: 0;
  border-bottom: none;
}

.img-40 {
  width: 40px;
  height: 40px;
  object-fit: cover;
}

.f-12 {
  font-size: 12px;
}

.f-w-600 {
  font-weight: 600;
}

.badge-light-success {
  background-color: rgba(84, 186, 74, 0.1);
  color: #54ba4a;
}
.badge-light-secondary {
  background-color: rgba(108, 117, 125, 0.1);
  color: #6c757d;
}
</style>
