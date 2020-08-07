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
const {debug, debugTime, info} = Me.imports.log;
const Clock = Me.imports.clock.Clock;
const EggTimer = Me.imports.eggtimer.EggTimer;
const Sound = Me.imports.sound.Sound;
const Duration = Me.imports.duration.Duration;

const Config = imports.misc.config;
const MIN_TIMER = 2;
const MAX_TIMER = 3000;

// -- control --
class Controller {

    constructor(eggTimer, indicator, clock, sound) {
        this.eggTimer = eggTimer
        this.indicator = indicator
        this.clock = clock
        this.sound = sound
    }


    togglePlayPause() {
        debug('toggle play/pause');

        if (this.clock.ticking()) {
            this.pause();
        } else {
            this.start();
        }
    }

    start() {
        info('start');
        this.indicator.showPauseButton();
        this.clock.startTicking();
    }

    finish() {
        info('finish');
        this.sound.play();
        this.changeDurationByPercent(this.indicator.timeSlider.value);
    }

    changeDurationByPercent(percentage) {
        this.changeDuration(Duration.of(MIN_TIMER, MAX_TIMER, percentage));
    }

    changeDuration(duration) {
        debugTime('change duration', duration);
        this.eggTimer.init(duration)
        this.pause();
    }

    pause() {
        this.clock.stopTicking();
        this.indicator.showPlayButton();
    }
}

// -- app --

let eggTimer
let sound
let indicator = null;
let clock;
let controller;

function init() {
    info(`initializing`);
}

function enable() {
    info(`enabling`);

    indicator = new EggTimerIndicator();
    eggTimer = new EggTimer(
        indicator.displayDuration.bind(indicator),
        new Duration(MIN_TIMER)
    );
    function eggTimerTick() {
        eggTimer.tick(controller.finish.bind(controller));
    }
    clock = new Clock(eggTimerTick);
    sound = new Sound();

    controller = new Controller(
        eggTimer, indicator, clock, sound
    );


    Main.panel.addToStatusArea(`${Me.metadata.name}-indicator`, indicator);
}

function disable() {
    info(`disabling`);

    if (indicator !== null) {
        indicator.destroy();
        indicator = null;
    }
}

// -- view --
let EggTimerIndicator = class EggTimerIndicator extends PanelMenu.Button {

    _init() {
        super._init(0.0, `${Me.metadata.name} Indicator`, false);

        this.add_child(this.createPanelBox());
        this.menu.addMenuItem(this.createMenu());
    }

    createPanelBox() {
        this.timeDisplay = new St.Label({
            text: new Duration(MIN_TIMER).prettyPrint(),
            y_align: Clutter.ActorAlign.CENTER,
        });
        let panelBox = new St.BoxLayout();
        panelBox.add(new St.Icon({
            gicon: Gio.icon_new_for_string(`${Me.path}/egg.svg`),
            style_class: 'system-status-icon'
        }));
        panelBox.add(this.timeDisplay);
        return panelBox;
    }

    createMenu() {
        let sliderItem = new PopupMenu.PopupBaseMenuItem();
        this.timeSlider = new Slider.Slider(0);
        this.timeSlider.connect(valueChanged(), this.sliderMoved.bind(this));
        sliderItem.add(this.timeSlider);

        this.playIcon = new St.Icon({
            gicon: new Gio.ThemedIcon({name: 'media-playback-start'}),
            style_class: 'system-status-icon'
        });
        this.pauseIcon = new St.Icon({
            gicon: new Gio.ThemedIcon({name: 'media-playback-pause'}),
            style_class: 'system-status-icon'
        });

        this.playPauseButton = new St.Button();
        this.playPauseButton.connect('clicked', this.clickPlayPause.bind(this));
        this.playPauseButton.set_child(this.playIcon);

        let playButtomItem = new PopupMenu.PopupBaseMenuItem();
        playButtomItem.add(this.playPauseButton);

        let section = new PopupMenu.PopupMenuSection();
        section.addMenuItem(sliderItem);
        section.addMenuItem(playButtomItem);
        return section;
    }

    displayDuration(duration) {
        this.timeDisplay.set_text(duration.prettyPrint());
    }

    sliderMoved(item) {
        controller.changeDurationByPercent(item.value);
    }

    clickPlayPause() {
        controller.togglePlayPause();
    }

    showPauseButton() {
        if (this.playPauseButton.get_child() !== this.pauseIcon) {
            this.playPauseButton.set_child(this.pauseIcon);
        }
        this.menu.close();
    }

    showPlayButton() {
        if (this.playPauseButton.get_child() !== this.playIcon) {
            this.playPauseButton.set_child(this.playIcon);
        }
    }
}

// -- compatibility --
function valueChanged() {
    return parseFloat(Config.PACKAGE_VERSION.substring(0, 4)) > 3.32
        ? 'notify::value'
        : 'value-changed';
}

if (parseInt(Config.PACKAGE_VERSION.split('.')[1]) > 30) {
    EggTimerIndicator = GObject.registerClass(
        {GTypeName: 'EggTimerIndicator'},
        EggTimerIndicator
    );
}