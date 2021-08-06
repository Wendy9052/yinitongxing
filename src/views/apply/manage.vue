<template>
    <div class="manage">
        <div class="top_btn">
            <van-button @click="add" class="add" size="small" color="#F8C82C">添加</van-button>
            <van-button @click="del" class="del" size="small" color="#F8C82C" :disabled="delDisabled">删除</van-button>
        </div>
        <van-radio-group class="list" v-model="result">
            <div class="none" v-if="assistantList.length==0"> 您当前暂无代领药人，
                请点击右上角进行添加。</div>
            <div class="one" @click="next(0)">
                <div class="mine">
                    {{name}}(本人)
                </div>
                　 <div class="click">
                    <van-radio icon-size="20px" :name="0">
                    </van-radio>
                </div>

            </div>
            <div class="one" v-for="(item,index) in assistantList" :key="index" @click="next(item,index)">
                <div class="content">
                    <div class="person">
                        <span class="name">{{item.name}}</span>
                        <span class="idsn">{{item.idsn.replace(/^(.{3})(?:\d+)(.{4})$/,"$1*******$2")}}</span>
                    </div>
                    <div class="add_time">
                        <span class="time">添加时间：{{(item.created_at).replace(/\s[\x00-\xff]*/g,'')}}</span>
                        <span class="status"
                            :class="item.status=='审核不通过'?'warn':(item.status=='审核通过'?'success':(item.status=='等待审核'?'loading':''))">{{item.status}}</span>
                    </div>
                </div>

                　 <div class="click" v-if="item.status=='审核通过'">
                    <van-radio icon-size="20px" :name="item.id">
                    </van-radio>
                </div>
                <div class="click" v-else><img src="/static/right.png" /></div>
            </div>
        </van-radio-group>
        <div class="button" v-if="assistantList.length>0">
            <van-button type="default" class="change" @click="gochange" :disabled="disabled">确定更换</van-button>
            <!-- <van-button v-if="active != 0" type="default" class="back" @click="toPrev()">上一步</van-button> -->
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {
        Toast
    } from 'vant';

    Vue.use(Toast);
    import {
        SubstituteQuery,
        SetUpSubstitube,
        SubstituteDel,
        GetPatient
    } from '@/api/api';
    import {
        mapGetters,
        mapState,
        mapActions,
        mapMutations
    } from 'vuex'
    export default {
        name: '',
        data() {
            return {
                idsn: '420101100704037524',
                checked: false,
                assistantList: [],
                disabled: false,
                result: '',
                delDisabled: false,
                name: ''
            }
        },
        computed: {
            ...mapGetters(['getPapid'])
        },
        mounted() {
            this.patient()
            this.init()
        },
        methods: {
            async patient() {
                let {
                    patient
                } = await GetPatient({
                    papid: this.getPapid
                })
                this.name = patient.name
            },
            async init() {
                this.assistantList = await SubstituteQuery({
                    papid: this.getPapid,
                })
            },
            add() {
                if (this.assistantList.length >= 5) {
                    Toast('最多允许添加5个代领药人')
                    return false
                }
                this.$router.replace({
                    path: '/apply/add_replace'
                });
            },
            del() {
                this.delDisabled = true
                SubstituteDel({
                    substitute_id: this.result,
                    papid: this.getPapid,
                }).then((res) => {
                    this.delDisabled = false
                    this.init()
                    this.$forceUpdate()
                }).catch((err) => {
                    this.delDisabled = false
                    Toast(err.response.data.message)
                })

            },
            gochange() {
                this.disabled = true
                SetUpSubstitube({
                    papid: this.getPapid,
                    substitute_id: this.result
                }).then(() => {
                    this.disabled = false
                    this.$router.replace({
                        path: '/apply/query'
                    });

                }).catch((err) => {
                    this.disabled = false
                    Toast(err.response.data.message)
                })
            },
            next(item, index) {
                if (item.status == '审核通过' || item == 0) {
                    this.result = item.id ? item.id : item
                } else {
                    if(item.status == '申请中') {
                        this.$router.replace({
                            path: '/apply/upload_replace',
                            query: {
                                substitute_id: item.id
                            }
                        });
                    } else {
                        this.$router.replace({
                            path: '/apply/add_replace',
                            query: {
                                substitute: item.id
                            }
                        });
                    }
                }

            }
        }
    }
</script>

<style lang="scss" scoped>
    .manage {
        width: 100%;
        height: 100%;
        padding-top: 13px;
        box-sizing: border-box;

        .warn {
            color: red;
        }

        .success {
            color: #6CF025;
        }

        .loading {
            color: #F89900;
        }

        .top_btn {
            padding: 0 28px;
            display: flex;
            justify-content: flex-end;
            margin-bottom: 24px;

            .add {
                margin-right: 5px;
            }

            .add,
            .del {
                height: 30px;
                width: 80px;
                border-radius: 4px;
                border: 1px solid rgba(255, 255, 255, 100);
            }
        }

        .none {
            width: 80%;
            margin: 0 auto;
            text-align: center;
            color: rgba(125, 118, 118, 100);
            font-size: 16px;
            margin-bottom: 10px;
            ;
        }

        .list {
            width: 100%;
            padding: 0 25px;
            box-sizing: border-box;
            margin-bottom: 30px;

            .one {
                width: 100%;
                height: 100px;
                padding: 21px 25px;
                box-sizing: border-box;
                box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.06);
                border: 1px solid rgba(255, 255, 255, 100);
                background: white;
                display: flex;
                justify-content: space-between;
                margin-bottom: 20px;

                .mine {
                    color: rgba(87, 87, 86, 100);
                    font-size: 16px;
                    font-family: PingFangSC-bold;
                    margin-right: 19px;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                }

                .content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;

                    .person {
                        margin-bottom: 19px;

                        .name {
                            color: rgba(87, 87, 86, 100);
                            font-size: 16px;
                            font-family: PingFangSC-bold;
                            margin-right: 19px;
                        }

                        .idsn {
                            color: rgba(168, 168, 168, 100);
                            font-size: 14px;
                        }

                    }
                }

                .add_time {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    font-size: 14px;

                    .time {
                        color: rgba(168, 168, 168, 100);

                    }
                }

                .click {
                    height: 100%;
                    display: flex;
                    align-items: center;
                    margin-left: 15px;

                    img {
                        height: 24px;
                        width: 24px;
                    }
                }

            }
        }

        .button {
            min-height: 50px;
            width: 100%;
            text-align: center;

            .change {
                width: 223px;
                height: 50px;
                border-radius: 4px;
                background-color: rgba(72, 129, 232, 100);
                color: rgba(253, 250, 250, 100);
                font-size: 16px;
            }

        }
    }
</style>