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
 * but WITHOUT ANY WARRANTY without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 *
 */
'use strict'

const Me = imports.misc.extensionUtils.getCurrentExtension()
const {info} = Me.imports.log
const EggTimer = Me.imports.eggtimer.EggTimer
const EggTimerIndicator = Me.imports.indicator.EggTimerIndicator
const Presenter = Me.imports.presenter.Presenter
const Clock = Me.imports.clock.Clock
const Sound = Me.imports.sound.Sound

let presenter
let indicator

function init() {
    info('initializing')
}

function enable() {
    info('enabling')
    indicator = new EggTimerIndicator()
    presenter = new Presenter(
        indicator,
        new EggTimer(),
        Clock,
        new Sound()
    )
}

function disable() {
    info(`disabling`)
    presenter.destroy()
    indicator.destroy()
}
