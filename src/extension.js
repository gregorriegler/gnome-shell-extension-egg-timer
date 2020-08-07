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
 * TODO: Attempting to add actor of type 'StIcon' to a container of type 'StButton', but the actor has already a parent of type 'StButton'.
 */
'use strict';

const {St, Clutter, Gio, GObject} = imports.gi;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Slider = imports.ui.slider;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const {debug, info} = Me.imports.log;
const EggTimer = Me.imports.eggtimer.EggTimer;
const Sound = Me.imports.sound.Sound;
const Duration = Me.imports.duration.Duration;

const Config = imports.misc.config;
const Mainloop = imports.mainloop;
const MIN_TIMER = 2;
const MAX_TIMER = 60;

let eggTimer
let sound
let indicator = null;
let timeout;


//-- control code --
let playing = false;

function startTimer() {
    info(`start timer, playing: ${playing}`);
    if (playing === false) {
        playing = true;
        continueTimer();
    }
}

function continueTimer() {
    if (playing) {
        debug(`continue timer`);

        timeout = Mainloop.timeout_add_seconds(1, () => {
            eggTimer.tick();
            continueTimer()
        });
    }
}

function finishTimer() {
    info('finished timer');
    sound.play();
    pauseTimer(Duration.of(MIN_TIMER, MAX_TIMER, indicator.timeSlider.value));
    indicator.showPlayButton();
}

function pauseTimer(duration) {
    debug('pauseTimer ' + (duration ? duration.prettyPrint() : ''));
    playing = false;

    if (timeout !== undefined) {
        Mainloop.source_remove(timeout);
        timeout = undefined;
    }

    eggTimer.init(duration)
}

let EggTimerIndicator = class EggTimerIndicator extends PanelMenu.Button {

    _init() {
        super._init(0.0, `${Me.metadata.name} Indicator`, false);

        let eggIcon = new St.Icon({
            gicon: Gio.icon_new_for_string(`${Me.path}/egg.svg`),
            style_class: 'system-status-icon'
        });
        this.timeDisplay = new St.Label({
            text: new Duration(MIN_TIMER).prettyPrint(),
            y_align: Clutter.ActorAlign.CENTER,
        });

        let panelBox = new St.BoxLayout();
        panelBox.add_actor(eggIcon);
        panelBox.add_actor(this.timeDisplay);
        this.add_child(panelBox);

        let section = new PopupMenu.PopupMenuSection();
        this.menu.addMenuItem(section);

        let sliderItem = new PopupMenu.PopupBaseMenuItem();
        this.timeSlider = new Slider.Slider(0);
        this.timeSlider.connect(parseFloat(Config.PACKAGE_VERSION.substring(0, 4)) > 3.32 ? 'notify::value' : 'value-changed', this.sliderMoved.bind(this));

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
        this.playButton.set_child(this.playIcon);

        let playButtomItem = new PopupMenu.PopupBaseMenuItem();
        playButtomItem.add(this.playButton);

        section.addMenuItem(sliderItem);
        section.addMenuItem(playButtomItem);
    }

    displayDuration(duration) {
        this.timeDisplay.set_text(duration.prettyPrint());
    }

    sliderMoved(item) {
        debug(`slider moved ${item.value}`);
        pauseTimer(Duration.of(MIN_TIMER, MAX_TIMER, item.value));
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
        this.playButton.set_child(this.pauseIcon);
        this.menu.close();
    }

    showPlayButton() {
        if(this.playButton.get_child() !== this.playIcon) {
            this.playButton.set_child(this.playIcon);
        }
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

    function displayDuration() {
        return indicator.displayDuration.bind(indicator);
    }

    eggTimer = new EggTimer(displayDuration(), finishTimer, new Duration(MIN_TIMER));
    Main.panel.addToStatusArea(`${Me.metadata.name} Indicator`, indicator);
    sound = new Sound();
}

function disable() {
    info(`disabling`);

    if (indicator !== null) {
        indicator.destroy();
        indicator = null;
    }
}