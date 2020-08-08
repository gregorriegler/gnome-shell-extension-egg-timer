# Egg Timer for Gnome
I needed a very simple Egg Timer for Gnome.
The existing timer extensions did not work on Gnome 3.36.x so i had to write my own.

Tested on Ubuntu 20.04

- Icons made by Freepik <http://www.freepik.com/> from Flaticon <https://www.flaticon.com/>
- Sound from Mobtimer <https://github.com/zoeesilcock/mobtimer-react/blob/master/public/audio/music_box.wav>

## Install via npm
```
git clone git@github.com:gregorriegler/gnome-shell-extension-egg-timer.git
cd gnome-shell-extension-egg-timer
npm install
npm run install
# Install Tested on Ubuntu 20.04
```

## Restart during development
```
npm run start
```

## Run tests
```
# once
npm test

# watch
npm run test:watch

# watch min
npm run test:watch:min
```


## Show log

```
journalctl -f -o cat /usr/bin/gnome-shell | grep 'egg-timer' -A7
```
