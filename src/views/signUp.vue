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
      <div class="col-6 me-5 d-none d-md-block align-self-center">
        <h1 class="f-Baloo fw-bold h2 ps-3">
          <img src="../assets/check.png" alt="checkbox" style="height:55px">
          LineBot Pick Time
        </h1>
        <img src="../assets/img.png" class="img-fluid" alt="todoMan">
      </div>
      <div class="col">
        <h2 class="mt-5 h3 d-none d-md-block ps-2">註冊帳號</h2>
        <div class="text-center d-inline d-md-none">
          <h1 class="f-Baloo fw-bold">
            <img src="../assets/check.png" alt="checkbox">
            ONLINE TODO LIST
          </h1>
          <h2 class="h5">註冊帳號</h2>
        </div>
        <div class="text-end">
          <button class="btn btn-primary me-3" type="button" @click="checkUserSwal">用戶驗證
          </button>
        </div>
        <v-form v-slot="{ errors }" class="container">
          <div class="form-group">
            <label for="Email">Email</label>
            <v-field id="Email" name="Email欄位" type="text" class="form-control"
                     :class="{ 'is-invalid': errors['Email欄位'] }"
                     placeholder="請輸入Email" rules="email|required"
                     v-model="user.email"
                     style="height:70px"></v-field>
            <ErrorMessage name="Email欄位" class="invalid-feedback"></ErrorMessage>
          </div>
          <div class="form-group mt-3">
            <label for="name">您的暱稱</label>
            <v-field id="name" name="暱稱" type="name" class="form-control"
                     :class="{ 'is-invalid': errors['暱稱'] }"
                     placeholder="請輸入您的暱稱" rules="required"
                     v-model="user.userName"
                     style="height:70px"></v-field>
            <ErrorMessage name="暱稱" class="invalid-feedback"></ErrorMessage>
          </div>
          <div class="form-group mt-3">
            <label for="pwd">密碼</label>
            <v-field id="pwd" name="密碼" type="password" class="form-control"
                     :class="{ 'is-invalid': errors['密碼'] }"
                     placeholder="請輸入密碼" rules="required|min:6"
                     v-model="user.password"
                     style="height:70px"></v-field>
            <ErrorMessage name="密碼" class="invalid-feedback"></ErrorMessage>
          </div>
          <div class="form-group my-3">
            <label for="confirmPwd">再次輸入密碼</label>
            <v-field id="confirmPwd" name="此密碼欄位" type="password" class="form-control"
                     :class="{ 'is-invalid': errors['此密碼欄位'] }"
                     placeholder="請再次輸入密碼" rules="required|min:6|confirmed:@密碼"
                     v-model="user.confirmPwd"
                     style="height:70px"></v-field>
            <ErrorMessage name="此密碼欄位" class="invalid-feedback"></ErrorMessage>
          </div>
          <div class="form-group mt-3">
            <label for="lineId">Line ID</label>
            <v-field id="lineId" name="lineId" type="name" class="form-control"
                     :class="{ 'is-invalid': errors['lineId'] }"
                     placeholder="請輸入您的LineID" rules="required"
                     v-model="user.lineId"
                     style="height:70px"></v-field>
            <ErrorMessage name="lineId" class="invalid-feedback"></ErrorMessage>
          </div>
          <div class="d-grid gap-4 col-4 mx-auto pt-4">
            <button class="btn btn-dark py-md-3"
                    type="button"
                    @click="signUp"
                    :disabled="!isFormValid">
              註冊帳號
            </button>
            <button class="btn btn-h" type="button" @click="goLogin">登入</button>
          </div>
        </v-form>
      </div>
    </div>
  </main>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  mounted() {
    this.checkUserSwal();
  },
  data() {
    return {
      user: {
        userName: '',
        email: '',
        password: '',
        confirmPwd: '',
        userType: '',
        lineId: '',
        confirmLineId: '',
      },
      isLoading: false,
      hasUser: false,
    };
  },
  methods: {
    checkUserSwal() {
      // 請求輸入 Line ID
      Swal.fire({
        title: '請輸入您的Line Id',
        input: 'text',
        inputLabel: '注意: 非名稱而是ID驗證碼',
        inputAttributes: {
          autocomplete: 'new-password', // 防止自動填充
        },
        showCancelButton: true,
        confirmButtonText: '確認',
        cancelButtonText: '取消',
        inputValidator: (value) => {
          if (!value) {
            return '您需要輸入一些文字！';
          }
          return null;
        },
      }).then((result) => {
        if (!result.isConfirmed) {
          return; // 如果用戶取消，則不進行任何操作
        }

        // 發送請求到後端 API
        this.$http.get(`${import.meta.env.VITE_APP_API}/check-line-id?lineId=${result.value}`)
          .then((response) => {
            const { userInfo } = response.data;
            if (!response.data.found) {
              Swal.fire('Line ID 不存在', '請先於 line 官方帳號註冊用戶', 'error');
              this.user.userType = ''; // 清除用戶類型
              return;
            }

            // 與用戶確認查找結果
            Swal.fire({
              title: `請問您是用戶 ${userInfo.lineUserName} 嗎?`,
              confirmButtonText: '確認',
              cancelButtonText: '取消',
              showCancelButton: true,
            }).then((res) => {
              if (!res.isConfirmed) {
                return; // 如果用戶取消，則不進行任何操作
              }
              this.user.confirmLineId = result.value;
              // 處理用戶確認後的動作
              this.user.lineId = result.value; // 儲存 Line ID
              this.hasUser = true;
              this.user.userType = userInfo.lineUserType; // 儲存用戶類型
              Swal.fire(`歡迎您! ${userInfo.lineUserName}，請開始註冊帳號`);
            });
          })
          .catch((error) => {
            console.error('錯誤:', error);
            this.user.userType = ''; // 出錯時清除用戶類型
          });
      });
    },
    signUp() {
      if (!this.hasUser) {
        Swal.fire({
          title: '請先進行用戶驗證',
          text: '請確認是否為 Line 綁定用戶，已有帳號密碼請按登入鈕',
          icon: 'error',
          confirmButtonText: '了解',
        });
        return;
      }
      if (this.user.confirmLineId !== this.user.lineId) {
        Swal.fire({
          title: '請重新點擊用戶驗證',
          text: 'LineID 與 用戶驗證ID需一致，請重新進行用戶驗證',
          icon: 'error',
          confirmButtonText: '了解',
        });
        return;
      }
      const url = `${import.meta.env.VITE_APP_API}/users/register`;
      const data = {
        email: this.user.email,
        name: this.user.userName,
        userType: this.user.userType,
        password: this.user.password,
        lineId: this.user.lineId,
      };

      this.isLoading = true;
      if (this.user.password === this.user.confirmPwd) {
        this.$http.post(url, data)
          .then((response) => {
            this.isLoading = false;
            Swal.fire({
              title: response.data.message,
              text: '歡迎您 ! 請輸入帳號密碼開始使用待辦清單功能 !',
              icon: 'success',
              confirmButtonText: '了解',
            }).then(this.$router.push('/'));
          })
          .catch((err) => {
            this.isLoading = false;
            Swal.fire({
              title: err.response.data.message,
              text: '請確認是否已重複註冊帳號，已有帳號密碼請按登入鈕',
              icon: 'error',
              confirmButtonText: '了解',
            });
          });
      } else {
        this.isLoading = false;
        Swal.fire({
          title: '失敗',
          text: '請再次輸入密碼',
          icon: 'error',
          confirmButtonText: '了解',
        });
      }
    },
    goLogin() {
      this.$router.push('/');
    },
  },
  computed: {
    isFormValid() {
      // 在這裡，我們檢查表單的驗證狀態
      return this.user.confirmPwd === this.user.password && this.user.userName && this.user.userType
        && this.user.email;
    },
  },
};
</script>
