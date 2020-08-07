##show log
`journalctl -f -o cat /usr/bin/gnome-shell | grep 'egg-timer' -A7`