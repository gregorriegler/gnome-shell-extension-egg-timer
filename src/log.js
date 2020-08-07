const Me = imports.misc.extensionUtils.getCurrentExtension();
const Debug = true;

const info = message => {
    log(Me.metadata.name + ' [info ]: ' + message)
};

const debug = message => {
    if (Debug) {
        log(Me.metadata.name + ' [debug]: ' + message)
    }
};