const fs = require('fs')
const fsExtra = require('fs-extra')
const path = require('path')
const gulp = require("gulp")
const mocha = require('gulp-mocha');
const zip = require('gulp-zip')
const modifyFile = require('gulp-modify-file')
const exec = require('child_process').exec

const metadata = JSON.parse(fs.readFileSync("metadata.json"))

const config = {
    srcDir: path.join(__dirname, "src"),
    buildDir: path.join(__dirname, "build"),
    distDir: path.join(__dirname, "dist"),
    installDir: path.join(process.env.HOME, ".local/share/gnome-shell/extensions/") + metadata.uuid
}

function clean(cb) {
    fsExtra.emptyDirSync(config.buildDir)
    fsExtra.emptyDirSync(config.distDir)
    cb()
}

function test() {
    return gulp.src('test/*', {read: false})
        .pipe(mocha())
        .on("error", function (err) {
            console.log(err.toString())
            this.emit('end')
        })
}

function buildAssets() {
    return gulp.src(["metadata.json", "ding.ogg", "egg.svg", "stylesheet.css", "LICENSE"])
        .pipe(gulp.dest(config.buildDir))
}

function buildSource() {
    return gulp.src([config.srcDir + "/*.js"])
        .pipe(modifyFile((content, path, file) => {
            return content
                .replace(/module\.exports.*/, '')
                .replace(/const[\s]+(.*)[\s]+=[\s]+require\(\'\.\.\/src\/(.*)\'\)/, "const $1 = imports.misc.extensionUtils.getCurrentExtension().imports.$2.$1")
        }))
        .pipe(gulp.dest(config.buildDir))
}

function dist() {
    return gulp.src([config.buildDir + "/*"])
        .pipe(zip(metadata.uuid + ".zip"))
        .pipe(gulp.dest(config.distDir))
}

function install() {
    return gulp.src([config.buildDir + "/*"])
        .pipe(gulp.dest(config.installDir))
}

function restartGnomeShell(cb) {
    exec("gdbus call --session --dest org.gnome.Shell --object-path /org/gnome/Shell --method org.gnome.Shell.Eval 'Meta.restart(_(\"Restarting…\"))'")
    cb()
}

const build = gulp.parallel(buildAssets, buildSource)
const cleanBuild = gulp.series(clean, test, build)
exports.clean = clean
exports.test = test
exports.restartGnomeShell = restartGnomeShell
exports.build = cleanBuild
exports.install = gulp.series(cleanBuild, install)
exports.start = gulp.series(cleanBuild, install, restartGnomeShell)
exports.dist = gulp.series(cleanBuild, dist)
exports.justDist = dist
