<template>
  <div class="getMedicine">
    <div class="medicine" v-if="show">
      <div class="getText">领药信息</div>
      <van-cell-group>
        <div class="medicineOne">
          <van-field :value="name" label="患者姓名" rows="1" autosize type="textarea" readonly />
        </div>
        <div class="medicineOne">
          <van-field :value="pre_receive_date" label="领药日期" rows="1" autosize type="textarea" readonly />
        </div>
        <div class="medicineOne">
          <van-field :value="drugstore_name" label="领药药房" rows="1" autosize type="textarea" readonly />
        </div>
        <div class="medicineOne">
          <van-field :value="drugstore_address" label="药房地址" rows="1" autosize type="textarea" readonly />
        </div>
        <div class="medicineOne">
          <van-field :value="drug_name" label="药品名称" rows="1" autosize type="textarea" readonly />
        </div>
        <div class="medicineOne">
          <van-field :value="pre_quantity" label="药品数量" rows="1" autosize type="textarea" readonly />
        </div>
        <div class="medicineOne">
          <van-field :value="get_med_role" label="领药人角色" rows="1" autosize type="textarea" readonly>
            <template #button>
              <van-button size="small" type="primary">更换领药人</van-button>
            </template>
          </van-field>
        </div>
        <div class="medicineOne">
          <van-field :value="get_med_name" label="代领药人姓名" rows="1" autosize type="textarea" readonly />
        </div>
      </van-cell-group>
    </div>
    <div class="notice" v-if="!show">
      <div class="icon">
        <van-icon name="warning" color="#FF8C21" size="80px" />
      </div>
      <p class="text">等待排药中</p>
    </div>
    <div class="btn">
      <van-button @click="back" class="back">返回首页</van-button>
    </div>
  </div>
</template>

<script>
  import {
    GetPredict
  } from '../../api/api'
  export default {
    data() {
      return {
        name: '',
        pre_receive_date: '',
        drugstore_name: '',
        drugstore_address: '',
        drug_name: '',
        pre_quantity: "",
        get_med_role: '',
        get_med_name: '',
        show: true
      }
    },
    async mounted() {
      await this.getpredict()
    },
    methods: {
      back() {
        this.$router.replace({
          path: '/apply/result',
          query: {
            success: true
          }
        })
      },
      async getpredict() {
        let res = await GetPredict({
          papid: this.$route.query.papid
        })
        if (res.pre_receive_date || res.drugstore_name || res.drugstore_address || res
          .predictDrug[0].drug.name + res.predictDrug[0].drug.specifications || res.predictDrug[0]
          .pre_quantity) {
          this.show = true
        }
        this.name = res.name || ""
        this.pre_receive_date = res.pre_receive_date || ""
        this.drugstore_name = res.drugstore_name || ""
        this.drugstore_address = res.drugstore_address || ""
        this.drug_name = res.predictDrug[0].drug.name + res.predictDrug[0].drug.specifications || ""
        this.pre_quantity = res.predictDrug[0].pre_quantity || ""
      }
    }
  }
</script>

<style lang="scss" scoped>
  .getMedicine {
    height: 100%;
    width: 100%;
    padding-top: 20px;
    box-sizing: border-box;

    .medicine {
      width: 92%;
      margin: 0 auto;
      margin-bottom: 20px;
      background: white;
      border-radius: 10px;
      color: rgba(16, 16, 16, 1);
      box-shadow: 0px 1px 10px 0px rgba(3, 121, 255, 0.1);

      .getText {
        height: 50px;
        width: 94%;
        box-sizing: border-box;
        font-size: 20px;
        line-height: 50px;
        margin: 0 auto;
        padding-left: 15px;
        border-bottom: 1px solid #C3C3C3;
      }

      .medicineOne {
        width: 100%;
        margin: 0 auto;
      }

      .medicineOne:last-child {
        border: none;
      }
    }

    .notice {
      height: 127px;
      width: 92%;
      margin: 0 auto;
      margin-top: 10px;
      border-radius: 6px;
      padding-top: 20px;
      box-sizing: border-box;
      box-shadow: #C3C3C3 0px 0px 10px;
      background: white;

      .icon {
        float: left;
        margin-left: 20px;
        margin-right: 15px;
      }

      .text {
        line-height: 87px;
        color: rgba(16, 16, 16, 1);
        font-size: 26px;
      }

    }
  }

  .van-cell {
    background: transparent;
  }
</style>