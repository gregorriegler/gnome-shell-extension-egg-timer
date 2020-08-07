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

const Main = imports.ui.main;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const {info} = Me.imports.log;
const EggTimerIndicator = Me.imports.indicator.EggTimerIndicator;
const Controller = Me.imports.controller.Controller;
const EggTimer = Me.imports.eggtimer.EggTimer;
const Duration = Me.imports.duration.Duration;

function init() {
    info('initializing');
}

function enable() {
    info('enabling');

    let controller;
    let indicator = new EggTimerIndicator();
    let eggTimer = new EggTimer(
        indicator.displayDuration.bind(indicator),
        new Duration(0)
    );
    controller = new Controller(
        eggTimer, indicator
    );

    let togglePlayPause = function () {
        controller.togglePlayPause()
    }

    let changeDurationByPercent = function (percentage) {
        controller.changeDurationByPercent(percentage)
    }

    indicator.setHandlers(togglePlayPause, changeDurationByPercent)

    Main.panel.addToStatusArea(`${Me.metadata.name}-indicator`, indicator);
}

function disable() {
    info(`disabling`);
    controller.destroy()
}