'use strict'

const id = 'egg-timer'
const Debug = false

const info = message => {
    log(id + ' [info ]: ' + message)
}

const debug = message => {
    if (Debug) {
        log(id + ' [debug]: ' + message)
    }
}

const debugTime = (message, time) => {
    if (Debug) {
        log(id + ' [debug]: ' + message + (time ? ' ' + time.prettyPrint() : ''))
    }
}