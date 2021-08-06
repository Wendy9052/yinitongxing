<template>
    <div class="upload-item">
        <div class="upload-box">
            <div class="upload-one" v-for="(item,index) in checkItem" :key="index">
                <div class="title">{{index+1}}、{{item.name}}</div>
                <div class="reason" v-if="item.result&&item.result.status=='审核不通过'" style="color:red">
                    {{item.result.status}}:
                    <div v-for="(itm,idx) in item.result.reason" :key="idx" style="padding-left:20px;">{{itm}}</div>
                    <div style="padding-left:20px;">{{item.result.other_reason}}</div>
                </div>
                <image-uploader ref=" imgUploader" :title="''" :value="item.images" :num="num(item)"
                    :history="item.attach" :temp="item.image" @deleteCI="deleteCI">
                </image-uploader>
            </div>
        </div>
        <div class="btn">
            <van-button type="default" class="up" @click="submitUpload" :disabled="disabled">提交</van-button>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {
        SubstituteUpload,
        SubstituteAttachDelete,
        GetCheckItem,
        FollowUpload,
        SubstituteQuery

    } from '../../api/api'
    import {
        Toast,
        ImagePreview,
        Dialog,
        Uploader
    } from 'vant'
    import {
        mapGetters,
        mapState
    } from "vuex";
    import ImageUploader from "@/components/ImageUploader";

    Vue.use(Toast)
    Vue.use(ImagePreview)
    Vue.use(Dialog)
    Vue.use(Uploader);

    export default {
        name: "upload-item",
        components: {
            ImageUploader
        },
        data() {
            return {
                papid: '',
                patient_id: '',
                check_item_id: '',
                category: '',
                follow: false,
                images: [],
                checkItem: [],
                disabled: false,
            };
        },
        computed: {
            ...mapState(['userInfo']),
            ...mapGetters(['getPapid']),

        },
        async created() {
            this.patient_id = this.$route.query.substitute_id
            await this.init()
        },
        methods: {
            num(item) {
                if (item.result) {
                    if (item.result.status == '审核通过') {
                        return 0
                    } else {
                        return 9 - item.attach.length
                    }
                } else {
                    return 9 - item.attach.length
                }
            },
            async init(re) {
                console.log('ooooo')
                if (this.$route.query.substitute_id) {
                    this.substitute_id = this.$route.query.substitute_id
                    let data = await SubstituteQuery({
                        papid: this.getPapid,
                        substitute_id: this.$route.query.substitute_id
                    })
                    if (re) {
                        for (let i in this.checkItem) {
                            this.checkItem[i].attach = data.checkItem[i].attach
                        }

                    } else {
                        this.checkItem = data.checkItem
                    }
                    console.log(this.checkItem,'----1----')
                } 
                // else {
                //     let data = await GetCheckItem({
                //         papid: this.getPapid,
                //         category: '代领人审核'
                //     })
                //     if (re) {
                //         for (let i in this.checkItem) {
                //             this.checkItem[i].attach = data[0].data[i].attach
                //         }

                //     } else {
                //         this.checkItem = data[0].data
                //     }
                // }
                if (!re) {
                    for (let i in this.checkItem) {
                        this.checkItem[i].images = []
                    }
                }
                console.log(this.checkItem, 'this.checkItem2')
                Toast.clear()
            },
            submitUpload() {
                for (let i in this.checkItem) {
                    if (!this.checkItem[i].result || this.checkItem[i].result && this.checkItem[i].result.status != '审核通过') {
                        if (this.checkItem[i].images.length == 0) {
                            Toast("材料未上传");
                            return;
                        }
                    }
                }
                Toast.loading({
                    duration: 0, // 持续展示 toast
                    forbidClick: true,
                    overlay: true
                });
                this.disabled = true
                let req = []
                console.log(this.checkItem, 'this.checkItem')
                for (let i in this.checkItem) {
                    let data = []
                    let images = this.checkItem[i].images
                    for (let i in images) {
                        data.push(this.baseUrl + images[i].src)
                    }
                    let ci = {
                        check_item_id: this.checkItem[i].id,
                        images: data
                    }
                    req.push(ci)
                }
                SubstituteUpload({
                    papid: this.getPapid,
                    substitute_id: this.patient_id,
                    checkItems: req,
                    category: '代领人审核'
                }).then((res) => {
                    this.disabled = false
                    Toast.clear()
                    this.$router.replace({
                        path: '/apply/manage'
                    })
                }).catch((err) => {
                    this.disabled = false
                    Toast.clear()
                    Toast(err.response.data.message)
                })
            },
            back() {
                let qdata = {
                    active: this.active
                }
                if (this.category == '后续复核') {
                    qdata.category = this.category
                }
                if (this.follow) {
                    qdata.follow = this.follow
                }
                this.$router.replace({
                    name: "Upload",
                    query: qdata
                })
            },
            deleteCI(val) {
                Dialog.confirm({
                        message: '确定删除？',
                    })
                    .then(() => {
                        SubstituteAttachDelete({
                            papid: this.getPapid,
                            substitute_attach_id: val
                        }).then((res) => {
                            this.init('re')
                            console.log(this.checkItem, 'this.checkItem1')
                            this.$forceUpdate();
                        }).catch((err) => {
                            Toast(err.response.data.message)
                        })
                    })
                    .catch((err) => {
                        // console.log(err);
                    });
            }
        },
    };
</script>

<style lang="scss" scoped>
    .upload-item {
        padding-top: 57px;
        box-sizing: border-box;

        .myuploader {
            background: #fff;
        }

        .upload-box {
            margin: 0 15px;
            width: auto;
            padding: 0 28px;
            box-sizing: border-box;
            box-shadow: 0px 1px 10px 0px rgba(3, 121, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 100);
            background: white;
            padding-bottom: 10px;

            .upload-one {
                width: 100%;
                padding: 21px 0;
                box-sizing: border-box;
                border-bottom: 1px solid rgba(144, 200, 247, 100);

                .title {
                    color: rgba(16, 16, 16, 100);
                    font-size: 14px;
                    margin-bottom: 15px;
                }

            }

            .upload-one:last-child {
                border-bottom: none;
            }
        }

        .upload-status {
            width: 100%;


        }

        .btn {
            margin-bottom: 20px;
        }
    }
</style>