<template>
    <div class="replace" v-wechat-title="this.text">
        <template v-if="show&&load">
            <div class="form-cell">
                <van-cell-group :border="false">
                    <van-field v-model="formData.name" label="姓名" input-align="right" readonly />
                    <!-- <van-cell title="性别" :value="formData.gender" is-link arrow-direction="down"
                        @click="showGender = true"  /> -->
                    <van-field v-model="formData.gender" label="性别" input-align="right" readonly />

                    <van-field v-model="formData.mobile" type="tel" label="手机号码" input-align="right" maxlength="11" />
                    <van-field v-model="formData.idsn" label="身份证号码" input-align="right" readonly />
                    <van-cell title="与患者关系" :value="formData.relation" is-link arrow-direction="down"
                        @click="showRelation = true" />
                </van-cell-group>
            </div>
            <div class="btn">
                <van-button :disabled="disabled" @click="next" class="up"> 下一步</van-button>
            </div>

            <van-popup v-model="showRelation" round position="bottom">
                <van-picker show-toolbar :columns="relationArr" @cancel="showRelation = false" @confirm="onProvince" />
            </van-popup>
            <van-popup v-model="showGender" round position="bottom">
                <van-picker show-toolbar :columns="genderArr" @cancel="showGender = false" @confirm="onGender" />
            </van-popup>
        </template>
        <template v-if="!show&&load">
            <div class="msg">

                <div class="msg-png">
                    <img :src="msgImg" alt="">
                </div>
                <div class="msg-bd">
                    <div class="title">{{msg.title}}</div>
                    <div class="desc" :style="{color:status =='审核不通过'?'red':''}">{{msg.content}}</div>
                </div>
                <div class="btn">
                    <van-button class="up w-harf" @click="replace" v-if="status =='审核不通过'">重新上传代领人材料</van-button>
                    <van-button class="up w-harf" @click="back" v-else>返回首页</van-button>
                    <van-button class="up w-harf" @click="revoke" v-if="status =='等待审核'">撤销审核</van-button>
                </div>
            </div>
        </template>

        <van-popup v-model="showUploadIdcard" style="width: 100%; height: 100%; padding: 0 10px; box-sizing: border-box;">
            <div class="canvas-title">请上传真实的代领药人身份证照片</div>
            <div class="idcardupload">
                <div class="upload-box">
                <div class="upload-img" @click="chooseImage('front')">
                    <div class="upload-img-b" :style="{backgroundImage: 'url('+idcard_front+')'}"></div>
                </div>
                <div class="upload-title">点击上图拍摄代领药人身份证人像面</div>
                </div>
                <div class="upload-box">
                <div class="upload-img" @click="chooseImage('back')">
                    <div class="upload-img-b" :style="{backgroundImage: 'url('+idcard_back+')'}"></div>
                </div>
                <div class="upload-title">点击上图拍摄代领药人身份证国徽面</div><br />
                <!-- <div class="upload-notes">注意事项：请将身份证放置于桌面，无杂乱背景，水平或者垂直放置均可，保证卡面无反光，对焦清晰；请勿使用复印件翻拍。</div> -->
                </div>
            </div>
            <div class="page-ft idcard-btn">
                <van-button block round type="info" :disabled="idcardBtnDisabled" @click.native="nextStep">下一步</van-button>
            </div>
        </van-popup>
    </div>
</template>

<script>
    import msg_upload from '@/assets/msg_upload.png';
    import msg_error from '@/assets/msg_error.png';
    import idcard_front from "@/assets/idcard_front.png";
    import idcard_back from "@/assets/idcard_back.png";
    import {
        mapState,
        mapGetters
    } from "vuex";
    import {
        Substitute,
        SubstituteQuery,
        DownloadImage,
        AgentIdcardOcr,
        SubstituteDel
    } from "@/api/api";
    import {
        checkCellphone,
        isIdCardNo
    } from "@/utils/utils";
    import Vue from "vue";
    import {
        Toast
    } from "vant";

    Vue.use(Toast);
    export default {
        data() {
            return {
                formData: {
                    name: '',
                    idsn: '',
                    mobile: '',
                    gender: '',
                    relation: ''
                },
                relationArr: ['配偶', '父母', '子女', '亲戚', '同事', '其他'],
                provinceName: '请选择省份',
                showRelation: false,
                disabled: false,
                load: false,
                msgImg: '',
                msg: {
                    title: '',
                    content: ''
                },
                status: '',
                show: false,
                substitute_id: '',
                text: '',
                showGender: false,
                genderArr: ['男', '女'],
                showUploadIdcard: true,
                idcard_front,
                idcard_back,
                idcardBtnDisabled: false,
                idcards: [{
                    image: "",
                    type: "人像面"
                },
                {
                    image: "",
                    type: "国徽面"
                }],
                patient_id: "",
                is_show: false
            };
        },
        created() {
            if (this.$route.query.substitute) {
                this.showUploadIdcard = false
            }
        },
        async mounted() {
            if (this.$route.query.substitute) {
                this.show = false
                let {
                    mobile,
                    idsn,
                    relation,
                    name,
                    gender,
                    status,
                    checkItem
                } = await SubstituteQuery({
                    papid: this.getPapid,
                    substitute_id: this.$route.query.substitute
                })
                // let {
                //     mobile,
                //     idsn,
                //     relation,
                //     name,
                //     gender
                // } = data
                this.formData = {
                    mobile,
                    idsn,
                    relation,
                    name,
                    gender
                }
                this.substitute_id = this.$route.query.substitute
                this.status = status
                if (this.status == '审核不通过') {
                    this.text = '审核不通过'
                    this.msgImg = msg_error
                    let reason = ''
                    for (var i in checkItem) {
                        reason += checkItem[i].result.other_reason + ''
                        for(var j in checkItem[i].result.reason) {
                            reason += checkItem[i].result.reason[j] + ''
                        }
                    }
                    this.msg = {
                        title: '审核驳回重新上传',
                        content: reason
                    }
                } else {
                    this.text = '等待审核'
                    this.msgImg = msg_upload
                    this.msg = {
                        title: '等待审核',
                        content: '请耐心等待项目办工作人员审核，审核工作将在3个工作日内完成'
                    }
                    this.is_show = true
                }
            } else {
                this.text = '添加代领药人信息'
                this.show = true
            }
            this.load = true
        },
        computed: {
            ...mapGetters(['getPapid']),
            ...mapState(['userInfo']),
        },
        methods: {
            back() {
                this.$router.replace({
                    path: '/apply/manage',
                })
            },
            next() {
                if (!this.formData.name || !this.formData.idsn || !this.formData.mobile || !this.formData.gender || !
                    this.formData.relation) {
                    Toast('请完善资料')
                } else {
                    if (!checkCellphone(this.formData.mobile)) {
                        Toast('请输入正确的手机号')
                    } else if (!isIdCardNo(this.formData.idsn)) {
                        Toast('请输入正确的身份证号码')
                    } else {
                        this.disabled = true
                        let data = {
                            ...this.formData,
                            papid: this.getPapid,
                            substitute_id: this.substitute_id,
                            idcards: this.idcards
                        }
                        Substitute(data).then((res) => {
                            console.log(res, 'res')
                            this.disabled = false
                            this.$router.replace({
                                path: '/apply/upload_replace',
                                query: {
                                    // patient: res.id,
                                    substitute_id: res.id
                                }
                            })

                        }).catch((err) => {
                            this.disabled = false
                            Toast(err.response.data.message);
                        })
                    }
                }

            },
            replace() {
                this.show = true
                this.text = '添加代领药人信息'
                this.showUploadIdcard = false
            },
            onGender(value) {
                this.formData.gender = value
                this.showGender = false
            },
            onProvince(value) {
                this.formData.relation = value
                this.showRelation = false
            },
            chooseImage(side) {
                this.wx.chooseImage({
                count: 1,
                sizeType: ["compressed"], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
                success: async res => {
                    try {
                    const serverId = res.localIds[0];
                    await this.uploadImage(serverId, side);
                    } catch (err) {
                    Toast(err.response.data.message);
                    }
                },
                fail: function () {
                    Toast("选图失败");
                }
                });
            },
            uploadImage(serverId, side) {
                return new Promise((resolve, reject) => {
                this.wx.uploadImage({
                    localId: serverId,
                    isShowProgressTips: 1,
                    success: res => {
                    var serverId = res.serverId; // 返回图片的服务器端ID
                    Toast.loading({
                        duration: 0, // 持续展示 toast
                        forbidClick: true
                    });
                    DownloadImage({
                        params: {
                            serverId: serverId
                        }
                        })
                        .then(res => {
                        if (side === "front") {
                            this.idcard_front = `${this.baseUrl}${res}`;
                            this.idcards[0].image = `${this.baseUrl}${res}`;
                            // this.idcard_front = 'https://papkmbzayyc.ilvzhou.com/statics/upload/attachment/202012/09/1b24cf1c51385e74d3437cfd277dbf37.jpg'
                            // this.idcards[0].image = 'https://papkmbzayyc.ilvzhou.com/statics/upload/attachment/202012/09/1b24cf1c51385e74d3437cfd277dbf37.jpg'
                        } else {
                            this.idcard_back = `${this.baseUrl}${res}`;
                            this.idcards[1].image = `${this.baseUrl}${res}`;
                            // this.idcard_back = 'https://papkmbzayyc.ilvzhou.com/statics/upload/attachment/202003/09/fa5377b02b239d5b17b3c4975d841d05.jpg'
                            // this.idcards[1].image = 'https://papkmbzayyc.ilvzhou.com/statics/upload/attachment/202003/09/fa5377b02b239d5b17b3c4975d841d05.jpg'
                        }
                        // console.log('uploadImage', this.idcards)
                        Toast.clear();
                        resolve();
                        })
                        .catch(err => {
                        Toast.clear();
                        reject(err.response.data.message);
                        });
                    },
                    fail: function () {
                        Toast("图片上传失败");
                    }
                });
                });
            },
            nextStep() {
                if (
                    this.idcard_front === idcard_front ||
                    this.idcard_back === idcard_back
                ) {
                Toast("请上传图片");
                    return false;
                }
                Toast.loading({
                    duration: 0, // 持续展示 toast
                    forbidClick: true
                });
                this.idcardBtnDisabled = true;
                const reqData = {};
                reqData.patient_id = this.userInfo.patient.id;
                reqData.idcards = this.idcards;
                // console.log(reqData, this.idcards)
                AgentIdcardOcr(reqData)
                .then(res => {
                    // let agentInfo = []
                    // agentInfo.push(res.data)
                    // this.userInfo.agentInfo = agentInfo
                    // this.$store.commit("setUserInfo", this.userInfo);
                    this.formData = res.data
                    Toast.clear();
                    this.showUploadIdcard = false
                })
                .catch(err => {
                    this.idcardBtnDisabled = false;
                    Toast.clear();
                    Toast(err.response.data.message);
                });
            },
            revoke() {
                SubstituteDel({
                    papid: this.getPapid,
                    substitute_id: this.substitute_id
                }).then(res => {
                    this.$router.replace({
                        path: '/apply/manage'
                    });
                }).catch(err => {

                })
            }
        }
    };
</script>

<style lang="less" scoped>
    .replace {
        height: 100%;
        width: 100%;
        // padding-top: 45px;
        box-sizing: border-box;
        .canvas-title {
            height: 48px;
            line-height: 48px;
            font-size: 1.6rem;
            position: relative;

            &::after {
                .b-line;
            }
        }
        .idcard-btn {
            padding: 15px;
            background: #fff;
            z-index: 3003;
        }

        .form {
            width: 92%;
            // height: 379px;
            line-height: 20px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0px 1px 10px 0px rgba(3, 121, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0);
            padding: 20px 0;
            margin: 10px auto;
            background: white;

            .inputone {
                width: 310px;
                height: 46px;
                border-radius: 5px;
                color: rgba(136, 136, 136, 1);
                font-size: 14px;
                text-align: left;
                border: 1px solid rgba(232, 232, 232, 1);
                margin: 0 auto;
                margin-bottom: 18px;
            }

            .inputone:last-child {
                margin-bottom: 0;
            }
        }

        .form-cell {
            width: 92%;
            line-height: 20px;
            border-radius: 10px;
            box-shadow: 0px 1px 10px 0px rgba(3, 121, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0);
            margin: 10px auto;
            background: white;
            overflow: hidden;
            margin-bottom: 60px;
        }
    }

    .msg {
        height: 100%;
        width: 100%;
        padding-top: 40px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        flex-direction: column;

        .msg-png {
            width: 264px;
            height: 183px;
            margin-bottom: 30px;

            img {
                height: 100%;
                width: 100%;
            }
        }

        .msg-bd {
            width: 100%;
            padding: 0 70px;
            box-sizing: border-box;
            text-align: center;
            margin-bottom: 20px;

            .title {
                color: rgba(16, 16, 16, 100);
                font-size: 18px;
                font-family: PingFangSC-bold;
                margin-bottom: 15px;
            }

            .desc {
                color: rgba(160, 162, 162, 100);
                font-size: 14px;
                font-family: PingFangSC-regular;
            }
        }
    }
    .btn {
        .w-harf {
            width: 50%;
        }
    }
</style>