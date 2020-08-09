'use strict'

const {St, Clutter, Gio, GObject} = imports.gi
const Config = imports.misc.config
const Main = imports.ui.main
const PanelMenu = imports.ui.panelMenu
const PopupMenu = imports.ui.popupMenu
const Slider = imports.ui.slider
const Me = imports.misc.extensionUtils.getCurrentExtension()
const Duration = Me.imports.duration.Duration

class EggTimerIndicator extends PanelMenu.Button {

    _init() {
        super._init(0.0, `${Me.metadata.name} Indicator`, false)

        this.add_child(this.createPanelBox())
        this.menu.addMenuItem(this.createMenu())
        Main.panel.addToStatusArea(`egg-time-indicator`, this)
    }

    setPlayClickedNotification(playClicked) {
        this.playClicked = playClicked
    }

    setPauseClickedNotification(pauseClicked) {
        this.pauseClicked = pauseClicked
    }

    setChangeDurationByPercentNotification(changeDurationByPercent) {
        this.changeDurationByPercent = changeDurationByPercent
    }

    setToggleLoopNotification(toggleLoop) {
        this.toggleLoop = toggleLoop
    }

    createPanelBox() {
        this.timeDisplay = new St.Label({
            text: new Duration(0).prettyPrint(),
            y_align: Clutter.ActorAlign.CENTER,
        })
        let panelBox = new St.BoxLayout()
        panelBox.add(new St.Icon({
            gicon: Gio.icon_new_for_string(`${Me.path}/egg.svg`),
            style_class: 'system-status-icon'
        }))
        panelBox.add(this.timeDisplay)
        return panelBox
    }

    createMenu() {
        let sliderItem = new PopupMenu.PopupBaseMenuItem()
        this.timeSlider = new Slider.Slider(0)
        this.timeSlider.connect(valueChanged(), this.sliderMoved.bind(this))
        sliderItem.add(this.timeSlider)

        this.playIcon = new St.Icon({
            gicon: new Gio.ThemedIcon({name: 'media-playback-start'}),
            style_class: 'system-status-icon',
        })
        this.pauseIcon = new St.Icon({
            gicon: new Gio.ThemedIcon({name: 'media-playback-pause'}),
            style_class: 'system-status-icon'
        })

        this.playPauseButton = new St.Button()
        this.playPauseButton.connect('clicked', this.clickPlayPause.bind(this))
        this.playPauseButton.set_child(this.playIcon)

        let playButtonItem = new PopupMenu.PopupBaseMenuItem()
        playButtonItem.add(this.playPauseButton)

        this.loopSwitch = new PopupMenu.PopupSwitchMenuItem('Loop', false)
        this.loopSwitch.label.set_y_align(Clutter.ActorAlign.CENTER)
        this.loopSwitch.connect('toggled', this.loopSwitchChanged.bind(this))

        let section = new PopupMenu.PopupMenuSection()
        section.addMenuItem(sliderItem)
        section.addMenuItem(this.loopSwitch)
        section.addMenuItem(playButtonItem)
        return section
    }

    displayDuration(duration) {
        this.timeDisplay.set_text(duration.prettyPrint())
    }

    clickPlayPause() {
        if(this.playPauseButton.get_child() === this.playIcon) {
            this.playClicked()
        } else {
            this.pauseClicked()
        }
    }

    sliderMoved(item) {
        this.changeDurationByPercent(item.value)
    }

    loopSwitchChanged() {
        this.toggleLoop(this.loopSwitch.state)
    }

    showPauseButton() {
        if (this.playPauseButton.get_child() !== this.pauseIcon) {
            this.playPauseButton.set_child(this.pauseIcon)
        }
        this.menu.close()
    }

    showPlayButton() {
        if (this.playPauseButton.get_child() !== this.playIcon) {
            this.playPauseButton.set_child(this.playIcon)
        }
    }
}

// -- compatibility --
function valueChanged() {
    return parseFloat(Config.PACKAGE_VERSION.substring(0, 4)) > 3.32
        ? 'notify::value'
        : 'value-changed'
}

if (parseInt(Config.PACKAGE_VERSION.split('.')[1]) > 30) {
    EggTimerIndicator = GObject.registerClass(
        {GTypeName: 'EggTimerIndicator'},
        EggTimerIndicator
    )
}