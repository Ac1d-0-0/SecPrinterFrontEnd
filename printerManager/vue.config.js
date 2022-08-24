module.exports = {
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                "appId": "SecPrinterAgent",
                "productName":"AgentManager",
                "copyright":"Copyright © 2022 Ac1d",
                "directories":{
                    "output":"./dist"
                },
                "win":{
                    "icon":"./icon.jpg",
                    "target": [
                        {
                            "target": "nsis",
                            "arch": [
                                "x64",
                            ]
                        }
                    ]
                },
                "extraResources":{
                    "from":"resources/icons/",
                    "to":"icons/"
                }
            }
        }
    }
}

