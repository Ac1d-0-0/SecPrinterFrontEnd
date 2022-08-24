module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        "appId": "SecPrinterClient",
        "productName":"printerClient",
        "copyright":"Copyright © 2022",
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
      },
      nodeIntegration: true,

    }

  }
}