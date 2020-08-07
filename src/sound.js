'use strict'

const Gio = imports.gi.Gio
const Me = imports.misc.extensionUtils.getCurrentExtension()

class Sound {
    constructor() {
        this.soundFile = Gio.File.new_for_path(`${Me.path}/ding.ogg`)
    }

    play() {
        let soundPlayer = global.display.get_sound_player()
        soundPlayer.play_from_file(this.soundFile, 'arbitrary description', null)
    }
}