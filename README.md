# Toolstack

A collection of free, browser-based developer and productivity tools, such as
formatters, converters, generators and calculators, plus multiplayer party
games. Everything runs as static HTML, CSS and JavaScript, with no build step.
 
The party games share `js/party-room.js` and `css/party-games.css`. The room
creator acts as the referee, and every player connects straight to them with
PeerJS.

## Running locally

Serve the folder with any static web server, then open `index.html`. For example:

```bash
npx serve .
```

## License

Toolstack is released under the [MIT License](LICENSE).

It includes third-party open source libraries (MIT, Apache-2.0, BSD and others)
that remain under their own licenses. See
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) and the [`licenses/`](licenses/)
folder for details.
