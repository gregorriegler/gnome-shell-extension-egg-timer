'use strict'

const Me = imports.misc.extensionUtils.getCurrentExtension()
const Debug = false

const info = message => {
    log(Me.metadata.name + ' [info ]: ' + message)
}

const debug = message => {
    if (Debug) {
        log(Me.metadata.name + ' [debug]: ' + message)
    }
}

const debugTime = (message, time) => {
    if (Debug) {
        log(Me.metadata.name + ' [debug]: ' + message + (time ? ' ' + time.prettyPrint() : ''))
    }
}