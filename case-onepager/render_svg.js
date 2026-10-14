const sharp = require("C:/Users/晶晶/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp");
sharp("case-onepager/assets/fangxiu_architecture_infographic.svg").png().toFile("case-onepager/build/fangxiu_architecture_infographic.png").then(()=>console.log("rendered"));
