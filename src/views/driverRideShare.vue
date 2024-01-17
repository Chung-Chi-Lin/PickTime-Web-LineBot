<template>
  <div class="todo-bg pt-1">
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
    <div class="d-none d-md-block">
      <header class="m-4 d-flex justify-content-between">
        <h1 class="fw-bold h2 ps-3">
          <img src="../assets/check.png" alt="checkbox" style="height:55px">
          {{ (userInfo?.userName ?? "") + " 共乘服務" }}
        </h1>
        <div class="d-flex align-items-center">
          <h2 class="h3 pe-3">{{ userInfo?.userName ?? "" }}</h2>
          <button class="btn btn-lg btn-h" @click="signOut">登出</button>
        </div>
      </header>
    </div>
    <!-- responsive -->
    <header class="m-3 d-flex justify-content-between d-md-none">
      <h1 class="f-Baloo fw-bold pt-2 h5">
        <img src="../assets/check-s.png" alt="checkbox">
        {{ (userInfo?.userName ?? "") + " 共乘服務" }}
      </h1>
      <div class="d-flex align-items-center">
        <button class=" btn btn-sm btn-h" @click="signOut">登出</button>
      </div>
    </header>
    <main class="container pb-5">
      <div class="input-group mb-3" v-if="filteredType === '當月車費' || filteredType === '上月車費'">
        <span class="input-group-text fs-4">$</span>
        <input v-model.number="amount" type="number"
               class="form-control border-0 py-2" placeholder="輸入扣除金額" id="numberInput">
        <label class="input-group-text px-1 py-1 bg-white border-0" for="todo">
          <button class="btn btn-sm" @click="addAmount" type="button" id="button-addon2">
            <i class="bi bi-plus-square-fill fs-5"></i>
          </button>
        </label>
      </div>
      <div v-if="!userInfo.userName" class="row row-cols-1 d-flex justify-content-center my-5">
        <h3 class="col text-center">目前尚無待辦資料</h3>
        <img class="img-fluid col-4 " src="../assets/empty.png" alt="">
      </div>
      <!-- todo card -->
      <div class="card">
        <div class="card-header bg-transparent text-center">
          <nav class="nav row mt-2">
            <a class="text-sm-center text-decoration-none col-4 py-2"
               v-for="(item, key) in category" :key="'category' + key"
               :class="{ 'tab': filteredType === item }"
               aria-current="page" href="#"
               @click.prevent="handleChangeCategory(item)"
            >{{ item }}</a>
          </nav>
        </div>
        <!-- 開車登記 -->
        <div class="card-body" v-if="filteredType === '開車登記'">
          <div>
            <h5 class="d-inline mb-3 me-3">開車選項:</h5>
            <div class="form-check form-check-inline mb-3">
              <input
                  v-model="reverseType"
                  class="form-check-input"
                  type="radio"
                  name="inlineRadioOptions2"
                  id="inlineRadio3"
                  value="true"
              >
              <label class="form-check-label" for="inlineRadio3">開車</label>
            </div>
            <div class="form-check form-check-inline mb-3">
              <input
                  v-model="reverseType"
                  class="form-check-input"
                  type="radio"
                  name="inlineRadioOptions2"
                  id="inlineRadio4"
                  :value="false"
              >
              <label class="form-check-label" for="inlineRadio4">不開車</label>
            </div>
          </div>
          <div>
            <h5 class="d-inline mb-3 me-3">日期範圍:</h5>
            <div class="form-check form-check-inline mb-3">
              <input
                  v-model="isRange"
                  class="form-check-input"
                  type="radio"
                  name="inlineRadioOptions"
                  id="inlineRadio2"
                  :value="false"
              >
              <label class="form-check-label" for="inlineRadio2">單日</label>
            </div>
            <div class="form-check form-check-inline mb-3">
              <input
                  v-model="isRange"
                  class="form-check-input"
                  type="radio"
                  name="inlineRadioOptions"
                  id="inlineRadio1"
                  value="true"
              >
              <label class="form-check-label" for="inlineRadio1">日期區間</label>
            </div>
          </div>
          <div v-if="!isRange">
            <h5 class="mb-3">選擇單日</h5>
            <DatePicker
                name="singleDate"
                type="day"
                format="YYYY/MM/DD"
                v-model:value="selectedDate"
                :disabled-date="disabledDates"
            />
          </div>
          <div v-else>
            <h5 class="mb-3">選擇搭乘區間</h5>
            <div class="d-flex">
              <DatePicker
                  name="startDate"
                  type="day"
                  format="YYYY/MM/DD"
                  v-model:value="startDate"
                  :disabled-date="disabledDates"
              />
              <div class="px-3">～</div>
              <DatePicker
                  name="endDate"
                  type="day"
                  format="YYYY/MM/DD"
                  v-model:value="endDate"
                  :disabled-date="disabledDates"
              />
            </div>
          </div>
          <div class="bg-transparent d-flex justify-content-end mt-3">
            <button type="button" class="btn btn-info border-0 btn-h p-2 px-3" @click="reserveDate">登記</button>
          </div>
          <h3 class="mt-4 ms-1 mb-0"><span
              class="badge bg-primary p-2">{{ driveData ? '司機表' : '司機尚無開放預約' }}</span></h3>
          <div v-if="driveData">
            <ul class="list-group list-group-flush"
                v-for="(item, index) in formattedDriveData" :key="item.id">
              <li class="list-group-item text-start border-bottom">
                <div class="mb-3">
                  <label v-if="item.pass_limit" class="text-end d-block mb-3">
                    <h5>{{ item.pass_limit ? `乘客限:${item.pass_limit}位` : '' }}</h5>
                  </label>
                  <div class="d-flex justify-content-end m-0 p-0">
                    <button class="btn btn" @click="delTakeRide(item.id)" type="button" id="button-addon2">
                      <i class="bi bi-x-square-fill fs-4" style="color: #ff0000;"></i>
                    </button>
                  </div>
                  <label class="form-check-label d-block mb-2">
                    <h5 v-if="index === 0 && item.pass_limit">*本月開車日＞ </h5>
                    <h5 v-else>不開車日＞ </h5>
                    備註:{{ item.note ?? '無備註' }}
                  </label>
                  <label class="text-end d-block">
                    <span v-if="index === 0">開車</span>
                    <span v-else>不開車</span>日期:{{ item.start_date }} {{ item.end_date ? `～ ${item.end_date}` : '' }}
                  </label>
                </div>
              </li>
            </ul>
          </div>
          <ul v-if="!takeRideData" class="list-group border-top my-4 border-3 border-secondary list-group-flush">
          </ul>
          <ul class="list-group border-top my-4 border-3 border-secondary list-group-flush">
          </ul>
          <div>
            <h3 class="mb-3">
              <span class="badge bg-success p-2">{{ formattedPassengerData.length > 0 ? '乘客搭乘表' : '尚無預約' }}</span>
            </h3>
            <div v-for="(passenger, index) in formattedPassengerData" :key="index">
              <h5 class="my-2">
                <span class="badge bg-secondary p-2">乘客: {{ passenger.name }}</span>
              </h5>
              <div v-if="passenger.takeRide && passenger.takeRide.length > 0">
                <h5>搭乘日＞</h5>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item text-start border-bottom" v-for="ride in passenger.takeRide" :key="ride.id">
                    備註: {{ ride.note ?? '無備註' }}
                  <div class="text-end">
                    日期: {{ ride.start_date }} ~ {{ ride.end_date }}
                  </div>
                  </li>
                </ul>
              </div>
              <div class="mt-3" v-else>
                <h5>搭乘日＞尚無資訊</h5>
              </div>
              <div class="my-2" v-if="passenger.notTakeRide && passenger.notTakeRide.length > 0">
                <h5>不搭乘日＞</h5>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item text-start border-bottom" v-for="ride in passenger.notTakeRide" :key="ride.id">
                    備註: {{ ride.note ?? '無備註' }}
                  <div class="text-end">
                    日期: {{ ride.start_date }} ~ {{ ride.end_date }}
                  </div>
                  </li>
                </ul>
              </div>
              <div class="mt-3" v-else>
                <h5>不搭乘日＞尚無資訊</h5>
              </div>
              <ul class="list-group border-top my-4 border-3 border-secondary list-group-flush">
              </ul>
            </div>
          </div>
        </div>
        <!-- 當月、上月車費 -->
        <div class="card-body" v-if="filteredType !== '搭乘登記' && filteredType !== '開車登記'">
          <ul class="list-group list-group-flush"
              v-for="(item, index) in formattedFareData" :key="item.id">
            <li class="list-group-item text-start border-bottom border-danger">
              <div class="py-2">
                <label class="form-check-label d-block text-primary">
                  {{ filteredType === '當月車費' ? '本月匯款＞ ' : '上月匯款＞ ' }}
                </label>
                <label class="form-check-label d-block ps-4 py-2">乘客:{{ item.name }} 費用:{{ item.fare }}</label>
                <label class="text-end d-block" v-if="item.date !== 'Invalid date'">
                  紀錄日期:{{ item.date }}
                </label>
                <!-- 費用紀錄 -->
                <div class="py-2" v-for="(fareCount, fareIndex) in item.fareCount" :key="fareIndex">
                  <div class="d-flex justify-content-between align-items-center">
                    <label>費用紀錄＞</label>
                    <button class="btn btn" @click="delFareLog(fareCount.id)" type="button" id="button-addon2">
                      <i class="bi bi-x-square-fill fs-4" style="color: #ff0000;"></i>
                    </button>
                  </div>
                  <label class="form-check-label d-block ps-4 py-2">
                    NT${{ fareCount.userFareCount }}，原因: {{ fareCount.userRemark }}
                  </label>
                  <label class="text-end d-block" v-if="fareCount.date">
                    紀錄日期:{{ this.$moment(fareCount.date).format('YYYY-MM-DD') }}
                  </label>
                </div>
              </div>
            </li>
          </ul>
          <ul class="list-group border-top border-3 border-secondary list-group-flush">
            <li class="list-group-item fs-5 d-flex justify-content-between mt-2">
              <label class="form-check-label ms-auto mt-2">
                {{ fareCountTotal }}
              </label>
            </li>
          </ul>
        </div>
        <div class="card-footer bg-transparent d-flex justify-content-between pt-3"
             v-if="filteredType !== '搭乘登記' && filteredType !== '開車登記'">
          <p v-if="formattedFareData" class="pt-3"><span class="fs-5">{{ formattedFareData.length }}</span> 則乘客車費紀錄</p>
          <button type="button" class="btn btn-info my-2 border-0 btn-h" @click="countFareData">當前紀錄計算</button>
        </div>
      </div>
    </main>
  </div>
</template>
<script>
import Swal from 'sweetalert2';
import {mapGetters} from 'vuex';
import DatePicker from "vue-datepicker-next";
import "vue-datepicker-next/index.css";
import "vue-datepicker-next/locale/zh-cn.es";

export default {
  components: {
    DatePicker,
  },
  data() {
    return {
      selectedDate: this.$moment().toDate(), // 單選日期
      startDate: this.$moment().toDate(), // 日期起始
      endDate: this.$moment().add(1, 'days').toDate(), // 日期結束
      isRange: false, // radio是否為區間
      reverseType: true, // 搭乘、不搭
      formattedFareData: [], // 組合後的車費數據
      passengerFareData: [],
      fareCountData: [],
      formattedDriveData: [], // 組合後的司機數據
      driveData: [],
      notDriveData: [],
      formattedPassengerData: [], // 組合後的乘客數據
      takeRideData: [],
      notTakeRideData: [],
      fareCountTotal: '', // 搭乘紀錄總計算
      amount: null, // 匯款費
      isLoading: false,
      filteredType: '當月車費',
      category: ['當月車費', '上月車費', '開車登記'],
    };
  },
  methods: {
    // ===== 費用處理 =====
    // 取得名下乘客當前費用紀錄
    async getFareData() {
      const {email} = this.userInfo;
      const {token} = this.$store.state;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const response = await this.$http.post(`${import.meta.env.VITE_APP_API}/fare/get_driver_passenger_fares`, {email}, config);
        const {found, currentMonthFares, previousMonthFares, passengersResult} = response.data;

        if (found) {
          this.passengerFareData.currentMonthFares = this.formatPassengerFares(currentMonthFares);
          this.passengerFareData.previousMonthFares = this.formatPassengerFares(previousMonthFares);
          this.passengerFareData.passengersResult = passengersResult;
          if (this.filteredType === '上月車費') {
            this.formattedFareData = this.passengerFareData.previousMonthFares;
          } else if (this.filteredType === '當月車費') {
            this.formattedFareData = this.passengerFareData.currentMonthFares;
          }
          this.calculateTotalFareCount(); // 計算匯款收入
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },
    formatPassengerFares(fares) {
      return fares.map(fare => ({
        ...fare,
        date: this.$moment(fare.date).format('YYYY-MM-DD'),
        fareCount: fare.fareCount.map(fc => ({
          ...fc,
          date: this.$moment(fc.date).format('YYYY-MM-DD')
        }))
      }));
    },
    // 計算匯款收入
    calculateTotalFareCount() {
      let totalFare = 0;
      if (this.formattedFareData) {
        this.formattedFareData.forEach(item => {
          totalFare += item.fare; // 加總基本費用
        });
      }

      if (totalFare > 0) {
        this.fareCountTotal = `匯款收入${totalFare}元`;
      } else {
        this.fareCountTotal = '尚無紀錄';
      }
    },
    // 刪除費用紀錄
    async delFareLog(id) {
      const result = await Swal.fire({
        title: '確認刪除',
        text: '您確定要刪除這條費用調整記錄嗎？',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#808080',
        confirmButtonText: '刪除',
        cancelButtonText: '取消'
      });

      if (result.isConfirmed) {
        const {token} = this.$store.state;
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        try {
          const response = await this.$http.delete(`${import.meta.env.VITE_APP_API}/fare_count/${id}`, config);
          if (response.data) {
            Swal.fire('已刪除！', '您的費用調整記錄已被刪除。', 'success');
            // 更新相關數據
            // 比如重新獲取當前頁面的數據
          }
        } catch (error) {
          console.error('刪除錯誤:', error);
          Swal.fire('錯誤', '刪除過程中發生錯誤', 'error');
        }
      }
      this.getFareData();
    },
    // 觸發用戶輸入總額計算下月實付
    async countFareData() {
      const {value: fareInput} = await Swal.fire({
        title: '下月需付搭乘費計算',
        text: '請提供下月乘客需實付金額進行扣款計算',
        input: 'number',
        inputPlaceholder: '輸入您的金額',
        inputAttributes: {
          min: 1,
        },
        showCancelButton: true,
        confirmButtonText: '確認',
        cancelButtonText: '取消',
      });

      if (fareInput) {
        let formatPassengerFare = '';

        this.formattedFareData.forEach(passenger => {
          // 從初始 fare 開始計算
          let totalFare = parseInt(fareInput);

          // 加上 fareCount 中的 userFareCount
          if (passenger.fareCount.length > 0) {
            passenger.fareCount.forEach(fareCountItem => {
              totalFare += fareCountItem.userFareCount;
            });
          }

          // 顯示計算後的總費用
          formatPassengerFare += `乘客:${passenger.name}，下月需付:NT$ ${totalFare}<br>`;
        });
        Swal.fire('乘客下月應付額試算', formatPassengerFare, 'warning');
      } else {
        // 顯示錯誤訊息
        Swal.fire('錯誤', '請輸入有效的金額', 'error');
      }
    },
    // 新增對應乘客搭乘費用計算
    async addAmount() {
      if (parseInt(this.amount) === NaN || this.amount === null) {
        Swal.fire('錯誤', '請輸入正數或負數金額', 'error');
        return
      }
      const {token} = this.$store.state;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const passengerSelectHtml = this.passengerFareData.passengersResult.map(passenger =>
          `<option value="${passenger.line_user_id}">${passenger.line_user_name}</option>`
      ).join('');

      const getLastMonthDates = () => {
        const now = new Date();
        const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        return {
          minDate: firstDayLastMonth.toISOString().split('T')[0],
          maxDate: lastDayLastMonth.toISOString().split('T')[0]
        };
      };

      const { minDate, maxDate } = getLastMonthDates();

      const inputOptions = {
        title: '新增搭乘費用紀錄',
        html: `
          <select id="swal-input1" class="swal2-input">${passengerSelectHtml}</select>
          <input id="swal-input2" class="swal2-input" placeholder="備註">
          ${this.filteredType === '上月車費' ? `<input id="swal-input3" type="date" class="swal2-input" min="${minDate}" max="${maxDate}">` : ''}
        `,
        focusConfirm: false,
        preConfirm: () => {
          const selectElement = document.getElementById('swal-input1');
          const userId = selectElement.value;
          const userName = selectElement.options[selectElement.selectedIndex].text; // 获取选中的乘客名字
          const userRemark = document.getElementById('swal-input2').value;
          const selectedDate = this.filteredType === '上月車費' ? document.getElementById('swal-input3').value : null;
          const fareAmount = this.amount;

          if (!userId || !userRemark) {
            if (this.filteredType === '上月車費' && !selectedDate) {
              Swal.showValidationMessage('日期為必要項目不能為空');
            }
            Swal.showValidationMessage('皆為必要項目不能為空');
            return;
          }

          return {userId, userName, userRemark, selectedDate, fareAmount};
        }
      };

      const result = await Swal.fire(inputOptions);

      if (result.isConfirmed) {
        const { userId, userName, userRemark, selectedDate,fareAmount } = result.value;
        Swal.fire({
          title: '確認信息',
          html: `確認將此用戶新增一筆搭乘紀錄?<br>乘客: ${userName}<br>ID前五碼: ${userId.slice(0,5)}<br>備註: ${userRemark}<br>金額: NT${fareAmount}`,
          showCancelButton: true,
          confirmButtonText: '確定',
          cancelButtonText: '取消',
        }).then(async (result) => {
          if (result.isConfirmed) {
            let formattedDate = this.$moment().format('YYYY-MM-DD HH:mm:ss');
            if (this.filteredType === '上月車費') {
              formattedDate = selectedDate
            }

            // 構造發送到後端的資料
            const postData = {
              userId,
              userRemark,
              fareAmount,
              date: formattedDate, // 當前日期和時間
            };

            try {
              this.isLoading = true;
              const response = await this.$http.post(`${import.meta.env.VITE_APP_API}/fare/add_fare_count`, postData, config);
              Swal.fire('成功', response.data.message, 'success');
              this.getFareData();
              this.filteredType === '上月車費';
            } catch (error) {
              Swal.fire('錯誤', error.response.data.message || '無法新增紀錄', 'error');
              console.error('Error:', error);
            }
            this.isLoading = false;
            this.amount = null;
          }
        });
      }
    },
    // ===== 日期處理 =====
    // 司機紀錄
    async getDriverData(queryMonth) {
      const {token} = this.$store.state;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          month: 'current' // 或 'last'，根據需要設定
        }
      };

      try {
        const response = await this.$http.get(`${import.meta.env.VITE_APP_API}/driver_dates`, config);
        const {drive, notDrive} = response.data;

        if (response.data) {
          this.driveData = drive;
          this.notDriveData = notDrive;
          await this.formatDriveData();
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },
    formatDriveData() {
      // 清空 formattedDriveData 數組
      this.formattedDriveData = [];

      // 處理 drive 數據
      if (!this.driveData || this.driveData.length === 0) {
        // 如果沒有 drive 數據，則添加一個空的記錄
        this.formattedDriveData.push({
          id: null,
          start_date: null,
          end_date: null,
          note: '',
          pass_limit: null
        });
      } else {
        // 如果有 drive 數據，則格式化並添加到數組中
        this.driveData.forEach(record => {
          const formattedStartDate = this.formatDate(record.start_date);
          const formattedEndDate = this.formatDate(record.end_date);

          this.formattedDriveData.push({
            id: record.id,
            start_date: formattedStartDate,
            end_date: formattedEndDate,
            note: record.note,
            pass_limit: record.pass_limit
          });
        });
      }

      // 繼續處理 notDrive 數據
      this.formatNotDriveData();
    },
    formatNotDriveData() {
      // 檢查 this.notDriveData 是否存在並且是數組
      if (Array.isArray(this.notDriveData)) {
        this.notDriveData.forEach(record => {
          const formattedStartDate = this.formatDate(record.start_date);
          const formattedEndDate = this.formatDate(record.end_date);

          // 如果 start_date 和 end_date 相同，則只保留 start_date
          if (formattedStartDate === formattedEndDate) {
            this.formattedDriveData.push({
              id: record.id,
              start_date: formattedStartDate,
              end_date: null,
              note: record.note
            });
          } else {
            this.formattedDriveData.push({
              id: record.id,
              start_date: formattedStartDate,
              end_date: formattedEndDate,
              note: record.note
            });
          }
        });
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    // 刪除費用紀錄
    async delTakeRide(id) {
      const result = await Swal.fire({
        title: '確認刪除',
        text: '您確定要刪除這條登記時間記錄嗎？',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#808080',
        confirmButtonText: '刪除',
        cancelButtonText: '取消'
      });

      if (result.isConfirmed) {
        const {token} = this.$store.state;
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        try {
          const response = await this.$http.delete(`${import.meta.env.VITE_APP_API}/driver_dates/${id}`, config);
          if (response.data) {
            Swal.fire('已刪除！', '您的登記時間記錄已被刪除。', 'success');
            this.getDriverData();
          }
        } catch (error) {
          console.error('刪除錯誤:', error);
          Swal.fire('錯誤', '刪除過程中發生錯誤', 'error');
        }
      }
    },
    // 乘客紀錄
    async getPassengerData(queryMonth) {
      const {token} = this.$store.state;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          month: 'current' // 或 'last'，根據需要設定
        }
      };

      try {
        const response = await this.$http.get(`${import.meta.env.VITE_APP_API}/driver_passenger_dates`, config);

        if (response.data && response.data.passengerData) {
          this.formattedPassengerData = response.data.passengerData.map(passenger => {
            const formatDatesArray = (dates) => {
              return dates ? dates.map(date => ({
                ...date,
                start_date: this.$moment(date.start_date).format('YYYY-MM-DD'),
                end_date: this.$moment(date.end_date).format('YYYY-MM-DD')
              })) : null;
            };

            return {
              ...passenger,
              takeRide: formatDatesArray(passenger.takeRide),
              notTakeRide: formatDatesArray(passenger.notTakeRide)
            };
          });
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },
    // 預約日期
    async reserveDate() {
      if (this.$moment(this.startDate).format('YYYY-MM-DD') >= this.$moment(this.endDate).format('YYYY-MM-DD') || this.$moment(this.startDate).format('YYYY-MM') !== this.$moment(this.endDate).format('YYYY-MM')) {
        Swal.fire('錯誤', '區間規則:不允許同日、後區間小於前區間、區間需當月', 'warning');
        return;
      }
      let messageHtml = '';
      let passLimit = null;

      if (this.reverseType) {
        const limitResult = await Swal.fire({
          title: '輸入乘客數量限制',
          input: 'number',
          inputPlaceholder: '請輸入數量',
          inputAttributes: {
            min: 1,
          },
          showCancelButton: true,
          confirmButtonText: '確定',
          cancelButtonText: '取消',
        });
        if (limitResult.isConfirmed) {
          passLimit = limitResult.value;
        } else {
          return;
        }
      }
      if (this.isRange) {
        const formattedStartDate = this.$moment(this.startDate).format('YYYY/MM/DD');
        const formattedEndDate = this.$moment(this.endDate).format('YYYY/MM/DD');
        messageHtml = `您選擇的區間是：<br>${formattedStartDate} 至 ${formattedEndDate}<br>${passLimit ? `乘客數量為${passLimit}` : ''}<br>確認預約嗎？`;
      } else {
        const formattedDate = this.$moment(this.selectedDate).format('YYYY/MM/DD');
        messageHtml = `您選擇的日期是：${formattedDate}。確認預約嗎？`;
      }

      const result = await Swal.fire({
        title: '確認預約',
        html: messageHtml,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '確定',
        cancelButtonText: '取消'
      });

      if (result.isConfirmed) {
        const noteResult = await Swal.fire({
          title: '補充備註',
          input: 'text',
          inputPlaceholder: '如果需要，請在這裡輸入備註...',
          showCancelButton: true,
          confirmButtonText: '確定',
          cancelButtonText: '不用',
        });
        // 檢查是否點擊了確定來提交備註
        if (noteResult.isConfirmed) {
          const {token} = this.$store.state;
          let note = noteResult.value ? noteResult.value : null;
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          // 準備發送到後端的數據
          const startDateFormatted = this.$moment(this.isRange ? this.startDate : this.selectedDate).format('YYYY-MM-DD');
          const endDateFormatted = this.isRange ? this.$moment(this.endDate).format('YYYY-MM-DD') : startDateFormatted;

          const reserveData = {
            start_date: startDateFormatted,
            end_date: endDateFormatted,
            reverse_type: this.reverseType ? 1 : 0,
            note: note || null,
            pass_limit: parseInt(passLimit)
          };

          // 發送預約請求到後端
          try {
            const response = await this.$http.post(`${import.meta.env.VITE_APP_API}/driver_reserve`, reserveData, config);
            if (response.data) {
              Swal.fire('預約成功！', '您的預約已成功提交。', 'success');
              await this.getDriverData();
            }
          } catch (error) {
            console.error('預約錯誤:', error);
            Swal.fire('錯誤', '預約過程中發生錯誤', 'error');
          }
        }
      }
    },
    // 切換類別
    handleChangeCategory(type) {
      this.filteredType = type;
    },
    isCurrentMonth(date) {
      const currentMonth = this.$moment().format('YYYY-MM');
      return date.startsWith(currentMonth);
    },
    // 登出
    signOut() {
      // 清除 Vuex 和 localStorage 中的令牌。
      this.$store.dispatch('clearAuthData');
      localStorage.removeItem('token');

      // 可選：向後端發送登出請求
      // 如果您的後端需要撤銷令牌，請保留以下代碼
      const url = `${import.meta.env.VITE_APP_API}/users/sign_out`;
      this.$http.post(url)
          .then((response) => {
            // 登出成功後的處理
            Swal.fire({
              title: '登出成功',
              text: response.data.message,
              icon: 'success',
              confirmButtonText: '了解',
            });
          })
          .catch((err) => {
            // 登出失敗的處理
            Swal.fire({
              title: '登出失敗',
              text: err.response.data.message,
              icon: 'error',
              confirmButtonText: '了解',
            });
          });

      // 無論後端登出請求是否成功，都導航到登入頁面
      this.$router.push('/');
      this.isLoading = false;
    },
  },
  watch: {
    // 控制切換tab
    filteredType(newValue) {
      if (newValue) {
        if (this.filteredType === '當月車費') {
          this.formattedFareData = this.passengerFareData.currentMonthFares;
        }
        if (this.filteredType === '上月車費') {
          this.formattedFareData = this.passengerFareData.previousMonthFares;
        }
        this.calculateTotalFareCount();
      }
    },
  },
  computed: {
    ...mapGetters({
      userInfo: 'getUserInfo',
    }),
    // 日期禁用
    disabledDates() {
      return (date) => {
        const currentMonthStart = this.$moment().startOf('month');
        const currentMonthEnd = this.$moment().endOf('month');
        const selectedDate = this.$moment(date);

        // 檢查所選日期是否在當月內
        return !(selectedDate.isSameOrAfter(currentMonthStart) && selectedDate.isSameOrBefore(currentMonthEnd));
      };
    }
  },
  mounted() {
    this.getFareData();
    this.getDriverData();
    this.getPassengerData();
  },
};
</script>
<style>
@media (min-width: 768px) {
  .todo-bg {
    min-height: 100vh;
    background: linear-gradient(0deg, rgb(216, 254, 255) 0%, rgba(253, 187, 45, 1) 100%);
  }
}

#swal-input1 {
  width: 70%;
}
#swal-input2 {
  width: 70%;
}
</style>
