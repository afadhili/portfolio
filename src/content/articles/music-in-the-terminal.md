Not everything needs another browser tab. [YT Music CLI](https://github.com/afadhili/ytmusic-cli) puts music search and playback into a terminal interface: a small idea with a surprising number of moving parts.

The public README documents search, playlists, lyrics, queue management, and playback. These notes are a tour of that documented design, not a claim about usage numbers or performance.

## A screen made of text

Ink lets a TypeScript program render an interactive terminal UI. The interface can show what is playing and what is queued without asking someone to leave the keyboard. ASCII cover previews add a little texture without pretending the terminal is a graphical music app.

The UI is only one layer. The README describes mpv for playback, yt-dlp for caching, and SQLite with Drizzle for local storage. Those roles are distinct: what you see, what you hear, and what the app remembers do not have to live in the same piece of code.

## Why this is an interesting CLI

A command-line app can be more than a set of flags. Search results, playlists, and lyrics all benefit from a navigable interface, while playback needs to keep working as the screen changes. YT Music CLI sits in that space between a traditional command and a desktop player.

The repository includes [screenshots](https://github.com/afadhili/ytmusic-cli/tree/main/screenshots) if you want to see the interface rather than imagine it.

## One small takeaway

A terminal interface can still feel considered. The choices about what to show, what to store, and what to hand off to a player matter as much as the choice of UI framework. The [case study](/projects/ytmusic-cli) includes the documented stack and screenshots.
