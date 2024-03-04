<template>
  <main class="container pt-5">
    <loading :active="isLoading">
      <!--     樣式包進 loading 元件內     -->
      <div class="loadingio-spinner-bean-eater-iylmkqp50l">
        <div class="ldio-t0eby9sr4hr">
          <div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
      <!--     樣式包進 loading 元件內     -->
    </loading>
    <div class="row p-md-5">
      <div class="col-6 me-5 d-none d-md-block">
        <h1 class="f-Baloo fw-bold h2 ps-3">
          <img src="../assets/check.png" alt="checkbox" style="height:55px">
          LineBot Pick Time
        </h1>
        <img src="../assets/img.png" class="img-fluid " alt="todoMan">
      </div>
      <div class="col">
        <h2 class="mt-5 h3 d-none d-md-block ps-2">提供共乘時間選擇服務</h2>
        <div class="text-center d-inline d-md-none">
          <h1 class="f-Baloo fw-bold">
            <img src="../assets/check.png" alt="checkbox">
            ONLINE TODO LIST
          </h1>
          <h2 class="h5">最實用的線上待辦事項服務</h2>
        </div>
        <v-form v-slot="{ errors }" class="container">
          <div class="form-group pt-4">
            <label for="Email">Email</label>
            <v-field id="Email" name="email" label="Email欄位" type="text" class="form-control"
                     :class="{ 'is-invalid': errors['email'] }"
                     placeholder="請輸入Email" rules="email|required"
                     v-model="user.email"
                     style="height:70px;"></v-field>
            <ErrorMessage name="email" class="invalid-feedback"></ErrorMessage>
          </div>
          <div class="form-group pt-4">
            <div class="d-flex justify-content-between align-items-center">
              <label for="pwd">密碼</label>
              <i
                :class="showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'"
                class="me-1 fs-3 bi"
                style="cursor: pointer;"
                @click="showPassword = !showPassword"
              ></i>
            </div>
            <v-field
              id="pwd"
              name="password"
              :type="showPassword ? 'text' : 'password'"
              class="form-control"
              :class="{ 'is-invalid': errors['password'] }"
              placeholder="請輸入密碼"
              rules="required|min:6"
              v-model="user.password"
              style="height:70px"
            ></v-field>
            <ErrorMessage name="password" class="invalid-feedback"></ErrorMessage>
          </div>
          <div class="d-grid gap-4 col-4 mx-auto pt-5">
            <button class="btn btn-dark py-md-3" type="button" @keyup.enter="logIn" @click="logIn" :disabled="user.password.length < 6">登入</button>
            <button class="btn btn-h" type="button" @click="goSignUp">註冊帳號</button>
          </div>
        </v-form>
      </div>
    </div>
  </main>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      user: {
        email: '',
        password: '',
      },
      isLoading: false,
      showPassword: false,
    };
  },
  methods: {
    logIn() {
      const url = `${import.meta.env.VITE_APP_API}/users/login`;
      const data = {
        email: this.user.email,
        password: this.user.password,
      };
      this.isLoading = true;
      this.$http.post(url, data)
        .then((response) => {
          const {token} = response.data;
          // 將 token 儲存到 Vuex 和 localStorage
          this.$store.dispatch('saveToken', token);
          this.$store.dispatch('saveUserInfo', response.data.userInfo);
          localStorage.setItem('token', token);
          localStorage.setItem('userInfo', JSON.stringify(response.data.userInfo));

          // 設置 axios 的默認授權頭部
          this.$http.defaults.headers.common.Authorization = `Bearer ${token}`;
          this.isLoading = false;
          // 導航到對應 rideShare 頁面
          if (response.data.userInfo.userType === '乘客') {
            this.$router.push('/passengerRideShare');
          } else {
            this.$router.push('/driverRideShare');
          }
        })
        .catch((err) => {
          this.isLoading = false;
          let errStr = '';
          if (err.response.status === 500) {
            errStr = '伺服器重啟中，3分鐘後重試。';
          }
          if(err.response.data === 'operation timed out for an unknown reason') {
            errStr = '連線逾時伺服器重啟，請重新登入。';
          }
          Swal.fire({
            title: '登入失敗',
            text: err.response.data || errStr,
            icon: 'error',
            confirmButtonText: '了解',
          });
        });
    },
    goSignUp() {
      this.$router.push('/signUp');
    },
  },
};
</script>
