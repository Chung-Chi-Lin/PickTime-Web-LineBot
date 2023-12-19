<template>
  <div class="todo-bg pt-1">
    <loading :active="isLoading">
    <!--     樣式包進 loading 元件內     -->
    <div class="loadingio-spinner-bean-eater-iylmkqp50l"><div class="ldio-t0eby9sr4hr">
      <div><div></div><div></div><div></div></div><div><div></div><div></div><div></div></div>
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
      <div class="input-group mb-3" v-if="filteredType === '當月車費'">
        <span class="input-group-text fs-4">$</span>
        <input v-if="userInfo.userType === '司機' || userInfo.userType === 'admin'"
               v-model.number="amount" type="number" onkeyup="value=value.replace(/D+/g, 0)"
               class="form-control border-0 py-2" placeholder="輸入匯款金額" id="numberInput">
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
            >{{item}}</a>
          </nav>
        </div>
        <!-- 搭乘登記 -->
        <div class="card-body" v-if="filteredType === '搭乘登記'">
          <div>
            <h5 class="d-inline mb-3 me-3">搭乘選項:</h5>
            <div class="form-check form-check-inline mb-3">
              <input
                  v-model="reverseType"
                  class="form-check-input"
                  type="radio"
                  name="inlineRadioOptions2"
                  id="inlineRadio3"
                  value="true"
              >
              <label class="form-check-label" for="inlineRadio3">搭乘</label>
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
              <label class="form-check-label" for="inlineRadio4">不搭乘</label>
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
            <button type="button" class="btn btn-info border-0 btn-h p-2 px-3" @click="reserveDate">預約</button>
          </div>
          <ul class="list-group border-top my-4 border-3 border-secondary list-group-flush">
          </ul>
          <h3 class="ms-1 mb-0"><span class="badge bg-success p-2">您的搭乘表</span></h3>
          <ul class="list-group list-group-flush"
              v-for="(item, index) in formattedPassengerData" :key="item.id">
            <li class="list-group-item text-start border-bottom">
              <div class="d-flex justify-content-end m-0 p-0">
                <button class="btn btn" @click="delTakeRide(item.id)" type="button" id="button-addon2">
                  <i class="bi bi-x-square-fill fs-4" style="color: #ff0000;"></i>
                </button>
              </div>
              <div class="mb-3">
                <label class="form-check-label d-block mb-2">
                  <span v-if="index === 0">*本月搭乘日＞ </span>
                  <span v-else>不搭車日＞ </span>
                  備註:{{ item.note ?? '無備註' }}
                </label>
                <label class="text-end d-block">
                  日期:{{item.start_date}} {{ item.end_date ? `～ ${item.end_date}` : ''}}
                </label>
              </div>
            </li>
          </ul>
          <h3 class="mt-4 ms-1 mb-0"><span class="badge bg-primary p-2">司機表</span></h3>
          <ul class="list-group list-group-flush"
              v-for="(item, index) in formattedDriveData" :key="item.id">
            <li class="list-group-item text-start border-bottom">
              <div class="mb-3">
                <label v-if="item.pass_limit" class="text-end d-block mb-3">
                  <h5>{{ item.pass_limit ? `乘客限:${item.pass_limit}位` : '' }}</h5>
                </label>
                <label class="form-check-label d-block mb-2">
                  <span v-if="index === 0 && item.pass_limit">*本月開車日＞ </span>
                  <span v-else>不開車日＞ </span>
                  備註:{{ item.note ?? '無備註' }}
                </label>
                <label class="text-end d-block">
                  日期:{{item.start_date}} {{ item.end_date ? `～ ${item.end_date}` : ''}}
                </label>
              </div>
            </li>
          </ul>
        </div>
        <!-- 開車登記 -->
        <div class="card-body" v-if="filteredType === '開車登記'">
          <div>
            <h5 class="d-inline mb-3 me-3">搭乘選項:</h5>
            <div class="form-check form-check-inline mb-3">
              <input
                  v-model="reverseType"
                  class="form-check-input"
                  type="radio"
                  name="inlineRadioOptions2"
                  id="inlineRadio3"
                  value="true"
              >
              <label class="form-check-label" for="inlineRadio3">搭乘</label>
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
              <label class="form-check-label" for="inlineRadio4">不搭乘</label>
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
            <button type="button" class="btn btn-info border-0 btn-h p-2 px-3" @click="reserveDate">預約</button>
          </div>
          <ul class="list-group border-top my-4 border-3 border-secondary list-group-flush">
          </ul>
          <h3 class="ms-1 mb-0"><span class="badge bg-success p-2">您的搭乘表</span></h3>
          <ul class="list-group list-group-flush"
              v-for="(item, index) in formattedPassengerData" :key="item.id">
            <li class="list-group-item text-start border-bottom">
              <div class="d-flex justify-content-end m-0 p-0">
                <button class="btn btn" @click="delTakeRide(item.id)" type="button" id="button-addon2">
                  <i class="bi bi-x-square-fill fs-4" style="color: #ff0000;"></i>
                </button>
              </div>
              <div class="mb-3">
                <label class="form-check-label d-block mb-2">
                  <span v-if="index === 0">*本月搭乘日＞ </span>
                  <span v-else>不搭車日＞ </span>
                  備註:{{ item.note ?? '無備註' }}
                </label>
                <label class="text-end d-block">
                  日期:{{item.start_date}} {{ item.end_date ? `～ ${item.end_date}` : ''}}
                </label>
              </div>
            </li>
          </ul>
          <h3 class="mt-4 ms-1 mb-0"><span class="badge bg-primary p-2">司機表</span></h3>
          <ul class="list-group list-group-flush"
              v-for="(item, index) in formattedDriveData" :key="item.id">
            <li class="list-group-item text-start border-bottom">
              <div class="mb-3">
                <label v-if="item.pass_limit" class="text-end d-block mb-3">
                  <h5>{{ item.pass_limit ? `乘客限:${item.pass_limit}位` : '' }}</h5>
                </label>
                <label class="form-check-label d-block mb-2">
                  <span v-if="index === 0 && item.pass_limit">*本月開車日＞ </span>
                  <span v-else>不開車日＞ </span>
                  備註:{{ item.note ?? '無備註' }}
                </label>
                <label class="text-end d-block">
                  日期:{{item.start_date}} {{ item.end_date ? `～ ${item.end_date}` : ''}}
                </label>
              </div>
            </li>
          </ul>
        </div>
        <div class="card-body" v-if="filteredType !== '搭乘登記' && filteredType !== '開車登記'">
          <ul class="list-group list-group-flush"
            v-for="(item, index) in formattedFareData" :key="item.id">
            <li class="list-group-item text-start border-bottom">
              <div>
                <label class="form-check-label d-block">
                  <span v-if="index === 0">匯款＞ </span>
                  <span v-else>紀錄＞ </span>
                  費用:{{ item.user_fare ?? item.user_fare_count }}{{item.user_remark ? ` , 原因:${item.user_remark}` : ""}}
                </label>
                <label class="text-end d-block">
                 紀錄日期:{{item.update_time}}
                </label>
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
        <div class="card-footer bg-transparent d-flex justify-content-between pt-3" v-if="filteredType !== '搭乘登記' && filteredType !== '開車登記'">
          <p class="pt-3"><span class="fs-5">{{ formattedFareData.length>0 ? formattedFareData.length-1 : 0 }}</span> 則車費紀錄</p>
          <button type="button" class="btn btn-info my-2 border-0 btn-h" @click="countFareData">當前紀錄計算</button>
        </div>
      </div>
    </main>
  </div>
</template>
<style>
@media (min-width: 768px) {
    .todo-bg {
      min-height: 100vh;
      /* background-image: linear-gradient(174deg, #ffd370 2%, #ffd370 46%,
      #ffffff 46%, #ffffff 100%, #e8e8e8 100%); */
      background: linear-gradient(0deg, rgb(216, 254, 255) 0%, rgba(253,187,45,1) 100%);
    }
  }
</style>
<script>
import Swal from 'sweetalert2';
import { mapGetters } from 'vuex';
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
      fareData: [], // 儲存fare數據
      fareCountData: [], // 儲存fareCount數據
      formattedDriveData: [],
      driveData: [],
      notDriveData: [],
      formattedPassengerData: [],
      takeRideData: [],
      notTakeRideData: [],
      fareCountTotal: '',
      amount: null,
      isLoading: false,
      filteredType: '當月車費',
      category: ['當月車費', '上月車費', '搭乘登記', '開車登記'],
    };
  },
  methods: {
    // ===== 費用處理 =====
    async getFareData() {
      const { userType, email } = this.userInfo;
      const { token } = this.$store.state;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const response = await this.$http.post(`${import.meta.env.VITE_APP_API}/fare/get_fare`, { email }, config);
        const { found, fareData } = response.data;

        if (found) {
          this.fareData = fareData.fare; // fare data
          this.fareCountData = fareData.fareCount; // fareCount data
          this.updateFormattedFareDate(this.filteredType); // 你可能需要傳入當前的 filteredType
          if (userType === '乘客') {
            this.category = ['當月車費', '上月車費', '搭乘登記'];
          }
          if (userType === '司機') {
            this.category = ['當月車費', '上月車費', '開車登記'];
          }
          if (userType === 'admin') {
            this.category = ['當月車費', '上月車費', '搭乘登記', '開車登記'];
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },
    formatFareData(data, filterFunc) {
      return data
          .filter(filterFunc)
          .map(({ id, line_user_id, ...rest }) => ({
            ...rest,
            update_time: this.$moment(rest.update_time).format('YYYY-MM-DD'),
          }));
    },
    updateFormattedFareDate(newValue) {
      const currentMonthStart = this.$moment().startOf('month');
      const previousMonthStart = this.$moment().subtract(1, 'month').startOf('month');
      const previousMonthEnd = this.$moment().subtract(1, 'month').endOf('month');

      let filterFunc;
      if (newValue === '當月車費') {
        filterFunc = (item) => this.$moment(item.update_time).isSameOrAfter(currentMonthStart);
      } else if (newValue === '上月車費') {
        filterFunc = (item) => this.$moment(item.update_time).isBetween(previousMonthStart, previousMonthEnd, null, '[]');
      }

      this.formattedFareData = [
        ...this.formatFareData(this.fareData, filterFunc),
        ...this.formatFareData(this.fareCountData, filterFunc),
      ];
      // 計算總和並更新相關屬性
      this.calculateTotalFareCount();
    },
    calculateTotalFareCount() {
      const total = this.formattedFareData.reduce((acc, item) => (item.user_fare_count ? acc + item.user_fare_count : acc), 0);

      if (total < 0) {
        this.fareCountTotal = `下月扣除 ${Math.abs(total)} 元`;
      } else if (total >= 0) {
        this.fareCountTotal = `下月需補 ${total} 元`;
      } else {
        this.fareCountTotal = '尚無紀錄';
      }
    },
    async countFareData() {
      const { value: fareInput } = await Swal.fire({
        title: '需付搭乘費計算',
        text: '請提供金額進行下月實付計算',
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
        // 進行金額計算
        if (!Number.isNaN(fareInput) && fareInput > 0) {
          const total = this.formattedFareData.reduce((acc, item) => (item.user_fare_count ? acc + item.user_fare_count : acc), 0);
          // 計算新的總費用
          const newTotal = Number(fareInput) + total;
          // 顯示新的總費用
          Swal.fire(`本次需付: ${newTotal} 元`);
        } else {
          // 顯示錯誤訊息
          Swal.fire('錯誤', '請輸入有效的金額', 'error');
        }
      }
    },
    // ===== 日期處理 =====
    // 司機紀錄
    async getDriverData(queryMonth) {
      const { token } = this.$store.state;

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
        const { drive, notDrive } = response.data;

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
              start_date: formattedStartDate,
              end_date: null,
              note: record.note
            });
          } else {
            this.formattedDriveData.push({
              start_date: formattedStartDate,
              end_date: formattedEndDate,
              note: record.note
            });
          }
        });
      }
    },
    // 乘客紀錄
    async getPassengerData(queryMonth) {
      const { token } = this.$store.state;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          month: 'current' // 或 'last'，根據需要設定
        }
      };

      try {
        const response = await this.$http.get(`${import.meta.env.VITE_APP_API}/passenger_dates`, config);
        const { takeRide, notTakeRide } = response.data;

        if (response.data) {
          this.takeRideData = takeRide;
          this.notTakeRideData = notTakeRide;
          await this.formatTakeRideData();
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },
    formatTakeRideData() {
      // 清空 formattedDriveData 數組
      this.formattedPassengerData = [];

      // 處理 drive 數據
      if (!this.takeRideData || this.takeRideData.length === 0) {
        // 如果沒有 drive 數據，則添加一個空的記錄
        this.formattedPassengerData.push({
          id: null,
          start_date: null,
          end_date: null,
          note: '',
        });
      } else {
        // 如果有 drive 數據，則格式化並添加到數組中
        this.takeRideData.forEach(record => {
          const formattedStartDate = this.formatDate(record.start_date);
          const formattedEndDate = this.formatDate(record.end_date);

          this.formattedPassengerData.push({
            id: record.id,
            start_date: formattedStartDate,
            end_date: formattedEndDate,
            note: record.note
          });
        });
      }

      // 繼續處理 notDrive 數據
      this.formatNotTakeRideData();
    },
    formatNotTakeRideData() {
      if (Array.isArray(this.notTakeRideData)) {
        this.notTakeRideData.forEach(record => {
          const formattedStartDate = this.formatDate(record.start_date);
          const formattedEndDate = this.formatDate(record.end_date);

          // 如果 start_date 和 end_date 相同，則只保留 start_date
          if (formattedStartDate === formattedEndDate) {
            this.formattedPassengerData.push({
              id: record.id,
              start_date: formattedStartDate,
              end_date: null,
              note: record.note
            });
          } else {
            this.formattedPassengerData.push({
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
    // 預約日期
    async reserveDate() {
      if (this.$moment(this.startDate).format('YYYY-MM-DD') === this.$moment(this.endDate).format('YYYY-MM-DD')) {
        Swal.fire('錯誤', '同日請選擇單日選項', 'warning');
        return;
      }
      let messageHtml = '';
      if (this.isRange) {
        const formattedStartDate = this.$moment(this.startDate).format('YYYY/MM/DD');
        const formattedEndDate = this.$moment(this.endDate).format('YYYY/MM/DD');
        messageHtml = `您選擇的區間是：<br>${formattedStartDate} 至 ${formattedEndDate}<br>確認預約嗎？`;
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
          const { token } = this.$store.state;
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
            note: note || null // 如果用戶沒有輸入，則為null
          };

          // 發送預約請求到後端
          try {
            const response = await this.$http.post(`${import.meta.env.VITE_APP_API}/reserve`, reserveData, config);
            if (response.data) {
              Swal.fire('預約成功！', '您的預約已成功提交。', 'success');
            }
          } catch (error) {
            console.error('預約錯誤:', error);
            Swal.fire('錯誤', '預約過程中發生錯誤', 'error');
          }
        }
      }
    },
    // 刪除預約
    async delTakeRide(id) {
      // 確認是否要刪除
      const result = await Swal.fire({
        title: '確認刪除',
        text: '您確定要刪除這條預約記錄嗎？',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '刪除！',
        cancelButtonText: '取消'
      });

      // 如果確認刪除
      if (result.isConfirmed) {
        const { token } = this.$store.state;
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // 發送刪除請求到後端
        try {
          const response = await this.$http.delete(`${import.meta.env.VITE_APP_API}/passenger_dates/${id}`, config);
          if (response.data) {
            Swal.fire('已刪除！', '您的預約記錄已被刪除。', 'success');
            this.getPassengerData();
          }
        } catch (error) {
          console.error('刪除錯誤:', error);
          Swal.fire('錯誤', '刪除過程中發生錯誤', 'error');
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
      // 清除 Vuex 和 localStorage 中的令牌
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
    // 新增 todo
    async addAmount() {
      const { userType, email } = this.userInfo;
      const { token } = this.$store.state;
      this.isLoading = true;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (userType === '乘客' && (!this.amount || this.amount <= 0)) {
        this.isLoading = false;
        Swal.fire('錯誤', '請輸入有效的金額', 'error');
        return;
      }

      // 構造發送到後端的資料
      const postData = {
        email,
        userFare: this.amount,
      };

      try {
        const response = await this.$http.post(`${import.meta.env.VITE_APP_API}/fare/add_fare`, postData, config);
        const { message } = response.data;

        if (message) {
          Swal.fire('成功', message, 'success');
          this.getFareData();
        }
      } catch (error) {
        Swal.fire('錯誤', '無法更新匯款紀錄', 'error');
        console.error('Error:', error);
      }
      this.isLoading = false;
    },
  },
  watch: {
    filteredType(newValue) {
      if (newValue && (this.filteredType === '當月車費' || this.filteredType === '上月車費')) {
        this.updateFormattedFareDate(newValue);
      }
    },
  },
  computed: {
    ...mapGetters({
      userInfo: 'getUserInfo',
    }),
    disabledDates() {
      // 創建一個包含所有禁用日期的集合
      const disabledSet = new Set();

      // 將每個不開車的日期範圍添加到集合中
      this.notDriveData.forEach(item => {
        const start = this.$moment(item.start_date);
        const end = this.$moment(item.end_date);

        // 處理區間
        if (start.isBefore(end, 'day')) {
          let current = start;
          while (current.isSameOrBefore(end)) {
            disabledSet.add(current.format('YYYY-MM-DD'));
            current.add(1, 'days');
          }
        } else {
          // 處理單日
          disabledSet.add(start.format('YYYY-MM-DD'));
        }
      });

      // 返回一個函數，DatePicker 將使用它來檢查日期是否應該被禁用
      return (date) => {
        const formattedDate = this.$moment(date).format('YYYY-MM-DD');
        // 檢查日期是否在禁用集合中，並且是否在當月
        return disabledSet.has(formattedDate) || !this.isCurrentMonth(formattedDate);
      };
    },
  },
  mounted() {
    this.getFareData();
    this.getDriverData();
    this.getPassengerData();
  },
};
</script>
