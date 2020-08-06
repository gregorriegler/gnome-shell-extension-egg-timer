const fs = require('fs');
const path = require('path');
const gulp = require("gulp");

const metadata = JSON.parse(fs.readFileSync("metadata.json"));

const installDir = path.join(process.env.HOME, ".local/share/gnome-shell/extensions/") + metadata.uuid;

var config = {
    srcDir: path.join(__dirname, "src"),
    installDir: installDir,
};

gulp.task("install", function () {
    return gulp.src(["metadata.json", "ding.ogg", "egg.svg", "stylesheet.css", "LICENSE", config.srcDir + "/*.js"])
        .pipe(gulp.dest(config.installDir));
});