// vue.config.js
module.exports = {
    devServer:{
        disableHostCheck:true
    },
    lintOnSave:false,//取消严格模式
    // chainWebpack: config => {
    //     config.resolve.alias.set('static',resolve('public/static'))
    //    }
    css: {
        loaderOptions: {
            less: {
                // 若 less-loader 版本小于 6.0，请移除 lessOptions 这一级，直接配置选项。
                lessOptions: {
                    modifyVars: {
                        // 直接覆盖变量
                        'text-color': '#333',
                        'border-color': '#eee',
                        'toast-background-color': 'fade(#fff, 70%)',
                        // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
                        hack: `true; @import "./src/style/theme.less";`,
                    },
                },
            },
        },
    }, 
}