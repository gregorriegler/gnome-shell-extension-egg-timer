const fs = require('fs');
const path = require('path');
const gulp = require("gulp");
const exec = require('child_process').exec;

const metadata = JSON.parse(fs.readFileSync("metadata.json"));

const installDir = path.join(process.env.HOME, ".local/share/gnome-shell/extensions/") + metadata.uuid;

var config = {
    srcDir: path.join(__dirname, "src"),
    installDir: installDir,
};

function install(cb) {
    gulp.src(["metadata.json", "ding.ogg", "egg.svg", "stylesheet.css", "LICENSE", config.srcDir + "/*.js"])
        .pipe(gulp.dest(config.installDir));
    cb();
}

function restartGnomeShell(cb) {
    exec("gdbus call --session --dest org.gnome.Shell --object-path /org/gnome/Shell --method org.gnome.Shell.Eval 'Meta.restart(_(\"Restarting…\"))'")
    cb();
}

exports.install = install;
exports.restartGnomeShell = restartGnomeShell;
exports.start = gulp.series(
    install,
    restartGnomeShell
);