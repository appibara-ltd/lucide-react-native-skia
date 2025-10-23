const fs = require("fs");
const v = require("./node_modules/lucide-react-native/package.json").version;
const pkg = JSON.parse(fs.readFileSync("./package.json"));
pkg.version = v;
fs.writeFileSync("./package.json", JSON.stringify(pkg, null, 2) + "\n");
console.log("✅ Set version to", v);
