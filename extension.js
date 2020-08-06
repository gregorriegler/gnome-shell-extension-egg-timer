/* An egg timer for the top panel
 *
 * Icons made by Freepik <http://www.freepik.com/> from Flaticon <https://www.flaticon.com/>
 * Sound from Mobtimer <https://github.com/zoeesilcock/mobtimer-react/blob/master/public/audio/music_box.wav>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 *
 * journalctl -f -o cat /usr/bin/gnome-shell | grep egg-timer -A7
 * TODO: refactor ui
 * TODO: egg timer decides when to start and when to stop ticks
 * TODO: on click play close menu
 * TODO: loop button for endless timer
 * TODO: name, manifest and so on
 * TODO: try a version where the play button is in the top bar
 * TODO: 00:00 not shown
 * TODO: Attempting to add actor of type 'StIcon' to a container of type 'StButton', but the actor has already a parent of type 'StButton'.
 */
'use strict';

const {St, Clutter, Gio, GObject} = imports.gi;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Slider = imports.ui.slider;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const EggTimer = Me.imports.eggtimer.EggTimer;

const Config = imports.misc.config;
const Mainloop = imports.mainloop;
const MIN_TIMER = 2;
const Debug = false;

let eggTimer
let indicator = null;
let timeDisplay;
let timeout;
let playing = false;
let finishSound;

function initSound() {
    finishSound = Gio.File.new_for_path(`${Me.path}/ding.ogg`);
}

function playSound() {
    let soundPlayer = global.display.get_sound_player();
    soundPlayer.play_from_file(finishSound, 'arbitrary description', null);
}

function initTimer() {
    eggTimer = new EggTimer(displayDuration, finishTimer, MIN_TIMER);
}

function startTimer() {
    info(`start timer`);
    if (playing === false) {
        playing = true;
        continueTimer();
    }
}

function finishTimer() {
    info('finished timer');
    playSound();
    pauseTimer(duration(indicator.timeSlider.value));
    indicator.showPlayButton();
}

function pauseTimer(timer) {
    debug(`pauseTimer ${timer}`);
    playing = false;

    if (timeout !== undefined) {
        Mainloop.source_remove(timeout);
        timeout = undefined;
    }

    if (timer !== undefined) {
        eggTimer.init(timer + MIN_TIMER)
    }
}

function continueTimer() {
    if (playing) {
        debug(`continue timer. timeout: ${timeout}`);

        timeout = Mainloop.timeout_add_seconds(1, () => {
            eggTimer.tick();
            continueTimer()
        });
    }
}

function prettyPrintDuration(duration) {
    let minutes = parseInt(duration / 60, 10);
    let seconds = parseInt(duration % 60, 10);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    let timeLeftPretty = minutes + ":" + seconds;
    return timeLeftPretty;
}

function displayDuration(duration) {
    timeDisplay.set_text(prettyPrintDuration(duration));
}

function duration(value) {
    return Math.floor(value * 50) * 60;
}

let EggTimerIndicator = class EggTimerIndicator extends PanelMenu.Button {

    _init() {
        super._init(0.0, `${Me.metadata.name} Indicator`, false);

        let eggIcon = new St.Icon({
            gicon: Gio.icon_new_for_string(`${Me.path}/egg.svg`),
            style_class: 'system-status-icon'
        });
        timeDisplay = new St.Label({
            text: prettyPrintDuration(duration(0)),
            y_align: Clutter.ActorAlign.CENTER,
        });

        let panelBox = new St.BoxLayout();
        panelBox.add_actor(eggIcon);
        panelBox.add_actor(timeDisplay);

        this.add_child(panelBox);


        let section = new PopupMenu.PopupMenuSection();
        this.menu.addMenuItem(section);

        let sliderItem = new PopupMenu.PopupBaseMenuItem();
        this.timeSlider = new Slider.Slider(0);
        this.timeSlider.connect(parseFloat(Config.PACKAGE_VERSION.substring(0, 4)) > 3.32 ? 'notify::value' : 'value-changed', this.sliderMoved.bind(this));
        initTimer();

        sliderItem.add(this.timeSlider);


        this.playIcon = new St.Icon({
            gicon: new Gio.ThemedIcon({name: 'media-playback-start'}),
            style_class: 'system-status-icon'
        });

        this.pauseIcon = new St.Icon({
            gicon: new Gio.ThemedIcon({name: 'media-playback-pause'}),
            style_class: 'system-status-icon'
        });

        this.playButton = new St.Button();
        this.playButton.connect('clicked', this.clickPlayPause.bind(this));
        this.playButton.add_actor(this.playIcon);

        let playButtomItem = new PopupMenu.PopupBaseMenuItem();
        playButtomItem.add(this.playButton);

        section.addMenuItem(sliderItem);
        section.addMenuItem(playButtomItem);
    }

    sliderMoved(item) {
        debug(`slider moved ${item.value}`);
        pauseTimer(duration(item.value));
        this.showPlayButton();
    }

    clickPlayPause() {
        debug('clicked play/pause');
        if (playing) {
            pauseTimer();
            this.showPlayButton();
        } else {
            startTimer();
            this.showPauseButton();
        }
    }

    showPauseButton() {
        this.playButton.add_actor(this.pauseIcon);
        this.menu.close();
    }

    showPlayButton() {
        this.playButton.add_actor(this.playIcon);
    }
}

if (parseInt(Config.PACKAGE_VERSION.split('.')[1]) > 30) {
    EggTimerIndicator = GObject.registerClass(
        {GTypeName: 'EggTimerIndicator'},
        EggTimerIndicator
    );
}

function init() {
    info(`initializing`);
}

function enable() {
    info(`enabling`);

    indicator = new EggTimerIndicator();
    Main.panel.addToStatusArea(`${Me.metadata.name} Indicator`, indicator);
    initSound();
}

function disable() {
    info(`disabling`);

    if (indicator !== null) {
        indicator.destroy();
        indicator = null;
    }
}

function info(message) {
    log(Me.metadata.name + ' [info]: ' + message)
}

function debug(message) {
    if (Debug) {
        log(Me.metadata.name + ' [debug]: ' + message)
    }
}
