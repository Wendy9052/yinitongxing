<template>
  <div class="map">
    <baidu-map class="mapDemo" :scroll-wheel-zoom="true" :center="center" @ready="handler">
      <div class="map-field">
        <van-field class="map-picker" readonly clickable label="城市" :value="value" placeholder="选择城市"
          @click="showPicker = true" right-icon="arrow" />
      </div>
      <van-popup v-model="showPicker" round position="bottom">
        <van-picker show-toolbar :columns="columns" @cancel="showPicker = false" @confirm="onConfirm"
          @change="Changecity" />
      </van-popup>
      <div class="result-box">
        <van-tabs @click="change()" v-model="active" background="#1E86F0" color="#1E86F0">
          <van-tab v-for="(item, index) in list2" :key="index" :title="item.title" :name="index"
            :class="{'singel':list2.length==1}"></van-tab>
        </van-tabs>
        <van-swipe class="my-swipe" :style="{ 'height': !reShow ? '100px' : '200px'}" @change="onChange" ref="swiper"
          :show-indicators='false'>
          <van-swipe-item v-for="(item, index) in list2" :key="index" :style="{ 'height': !reShow ? '100px' : '200px'}">
            <div class="tab-swiper">
              <div class="result-list">
                <div class="itemchange" v-if="showmessage"></div>
                <div class="chose" v-if="showmessage">请选择省份城市</div>
                <div @click="setCenter(reitem,index)" class="item" v-for="reitem in item.itemlist" :key="reitem.index">
                  {{reitem.name}}
                  <br />
                  {{reitem.address ? '地址：'+reitem.address : reitem.address}}
                  <br />
                  {{reitem.doctors ? '医生：'+reitem.doctors : ''}}
                  <br v-if="reitem.doctors" />
                  {{reitem.handle_time ? '领药时间：'+reitem.handle_time : ''}}
                </div>
              </div>
            </div>
          </van-swipe-item>
        </van-swipe> 
        <div class="result-ft" @click="toggleResult">
          <span v-if="reShow">收起
            <van-icon name="arrow-down" class="result-icon" /></span>
          <span v-else>展开
            <van-icon name="arrow-up" class="result-icon" /></span>
        </div>
      </div>
    </baidu-map>
  </div>
</template>

<script>
  import {
    GetProvince,
    GetCity,
    GetHospital,
    GetDrugstore
  } from "../../api/api";
  import {
    CouponList
  } from 'vant';
  export default {
    data() {
      return {
        map: null,
        BMap: null,
        point: null,
        ProvinceArr: [],
        CityArr: [],
        center: "北京",
        value: "",
        showPicker: false,
        showmessage: true,
        columns: [{
            values: []
          },
          // 第二列
          {
            values: []
          }
        ],
        list2: [{
            title: "项目医院",
            itemlist: []
          },
          // {
          //   title: "项目药房",
          //   itemlist: []
          // }
        ],
        index: 0,
        reHeight: "100",
        reShow: false,
        active: "",
        province: '',
        city: ''
      };
    },
    mounted() {
      this.getProvince();
    },
    methods: {
      async getProvince() {
        let pres = await GetProvince()
        const parr = pres
        this.ProvinceArr = []
        this.ProvinceArr = Object.values(parr)
        this.province = this.ProvinceArr[0]
        this.getCity();
        this.columns[0].values = this.ProvinceArr;
      },
      async getCity() {
        let cres = await GetCity({
          province: this.province
        })
        const carr = cres
        this.CityArr = []
        this.CityArr = Object.values(carr)
        this.columns[1].values = this.CityArr;
      },
      async gethospital(province, city) {
        this.list2[0].itemlist = []
        await GetHospital({
          province: province,
          city: city
        }).then((res) => {
          for (let i = 0; i < res.length; i++) {
            this.list2[0].itemlist.push(res[i])
            this.hospitalMark(res[i].adress);
          }
          // console.log(this.list2[0].itemlist,'this.HospitalArr')
        })
      },

      // async getDrugstore(province, city) {
      //   this.list2[1].itemlist = []
      //   await GetDrugstore({
      //     province: province,
      //     city: city
      //   }).then((res) => {
      //     for (let i = 0; i < res.length; i++) {
      //       this.list2[1].itemlist.push(res[i])
      //       this.drugstoreMark(res[i].address);
      //     }
      //     // console.log(this.list2[1].itemlist)

      //   })
      // },

      onCancel() {
        this.gethospital();
        // this.getDrugstore();
      },
      Changecity(picker, values) {
        this.province = values[0]
        this.getCity()
      },
      toggleResult: function () {
        this.reShow = !this.reShow;
      },
      handler({
        BMap,
        map
      }) {
        this.BMap = BMap;
        this.map = map;
      },
      hospitalMark(address) {
        var myGeo = new this.BMap.Geocoder();
        // 将地址解析结果显示在地图上，并调整地图视野
        myGeo.getPoint(
          address,
          point => {
            if (point) {
              this.map.addOverlay(new this.BMap.Marker(point));
            }
          },
          this.center
        );
      },
      drugstoreMark(address) {
        var myGeo = new this.BMap.Geocoder();
        // 将地址解析结果显示在地图上，并调整地图视野
        myGeo.getPoint(
          address,
          point => {
            if (point) {
              // this.map.centerAndZoom(point, 16);
              var myIcon = new BMap.Icon(
                "http://api.map.baidu.com/img/markers.png",
                new BMap.Size(23, 25), {
                  offset: new BMap.Size(10, 25), // 指定定位位置
                  imageOffset: new BMap.Size(0, 0 - 10 * 25) // 设置图片偏移
                }
              );
              this.map.addOverlay(new this.BMap.Marker(point, {
                icon: myIcon
              }));
            }
          },
          this.center
        );
      },
      onConfirm(value) {
        if (value) {
          this.showmessage = false
        }
        this.province = value[0]
        this.city = value[1]
        this.value = value[0] + ',' + value[1]
        this.showPicker = false;
        this.gethospital(value[0], value[1])
        // this.getDrugstore(value[0], value[1])
        this.center = value[1]
      },
      onChange(index) {
        this.active = index;
      },
      change() {
        this.$refs.swiper.swipeTo(this.active);
      },
      setCenter(val, index) {
        var opts = {
          width: 50, // 信息窗口宽度
          height: 40, // 信息窗口高度
          title: val.name // 信息窗口标题
        };
        var infoWindow = new BMap.InfoWindow(val.address, opts); // 创建信息窗口对象
        var mark = new this.BMap.Geocoder();
        // 将地址解析结果显示在地图上，并调整地图视野
        mark.getPoint(
          val.address,
          point => {
            if (point) {
              this.point = point;
            }
            this.map.centerAndZoom(this.point, 16);
            this.map.openInfoWindow(infoWindow, this.point);
          },
          this.center
        );
      }
    },
  };
</script>


<style lang="scss" scoped>
  .map {
    height: 100%;
    width: 100%;

    .mapDemo {
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;

      .map-field {
        position: absolute !important;
        top: 20px;
        left: 0;
        width: 100%;

        .map-picker {
          width: 90%;
          margin: 0 auto;
          border-radius: 50px;
        }
      }

      .result-box {
        position: absolute !important;
        bottom: 10px;
        left: 10px;
        right: 10px;
        background: #fff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.07);
        border-radius: 5px;
        color: #555;

        .van-tab--active {
          color: #fff;
        }

        .result-list {
          padding: 10px 15px;

          .itemchange {
            height: 50px;
            width: 80%;
            margin: 0 auto;
            border-bottom: 1px solid #c3c3c3;
          }

          .chose {
            color: rgba(170, 168, 168, 1);
            font-size: 14px;
            width: 120px;
            margin: 0 auto;
            text-align: center;
            padding: 0 10px;
            position: relative;
            top: -10px;
            background: white;
          }

          .item {
            position: relative;
            padding: 8px 0;
            font-size: 14px;
            border-bottom: 1px solid #c3c3c3;
          }
        }

        .result-ft {
          position: relative;
          padding: 10px;
          text-align: center;
          color: #999;
          font-size: 14px;

          span {
            padding: 0 10px;
            display: inline-block;
          }

          .result-icon {
            vertical-align: middle;
          }
        }
      }
    }
  }

  .van-swipe__indicator {
    height: 0;
    width: 0;
  }

  .van-swipe-item {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
</style>
<style lang="less">
  .map {
    .result-box {
      overflow: hidden;

      .van-tab--active {
        color: #fff;
      }
    }
  }
</style>