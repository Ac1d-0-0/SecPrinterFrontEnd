module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        "appId": "com.example.app",
        "productName":"printerAgent",
        "copyright":"Copyright © 2022",
        "directories":{
          "output":"./dist"
        },
        "win":{
          "target": [
            {
              "target": "nsis",
              "arch": [
                "x64",
              ]
            }
          ]
        }
      }
    }

  }
}