# Krynex plugins for Claude Code

```
/plugin marketplace add bassprofressor-lab/krynex-plugins
/plugin install cyberbrain@krynex-plugins
```

## cyberbrain

Local, cited project memory for coding agents. Notes are Markdown files in your repository;
rings 0 and 1 are injected at every session start, `recall` searches the rest with a
citation on every hit, and the core never touches the network.

What the plugin brings:

- the six lifecycle hooks (session start, prompt, before and after a tool call, stop, compaction)
- the MCP server (`cyberbrain mcp`)
- three skills: `recall` (before you search), `write` (so the next session finds it), `handoff`
  (pass context to subagents instead of searching three times)

A project needs a store once: `cyberbrain init` in the project root. Without one the hooks say
so at session start and do nothing else.

### How the binary gets onto your machine

`bin/cyberbrain` is a starter. On first use it downloads the release pinned in
[`plugins/cyberbrain/VERSION`](plugins/cyberbrain/VERSION) from
[github.com/bassprofressor-lab/cyberbrain](https://github.com/bassprofressor-lab/cyberbrain/releases),
checks it against that release's `SHA256SUMS`, and keeps it in Claude Code's plugin data
directory. A checksum that does not match means nothing is run. It never fetches "latest":
a new binary comes with a plugin update that changes `VERSION`, nothing else.

Builds: Linux x86_64, Windows x86_64 (Git Bash, which Claude Code on Windows uses), macOS on
Apple silicon. Set `CYBERBRAIN_BIN=/path/to/cyberbrain` to use your own build.

If you set Cyberbrain up earlier with `cyberbrain install`, run it again after installing the
plugin: it notices the plugin and takes its own hook entries out of `.claude/settings.json`,
so no event runs twice.

## Licences

The plugin (manifests, skills, hooks, starter) is Apache-2.0. The Cyberbrain binary it
downloads is [FSL-1.1-ALv2](https://github.com/bassprofressor-lab/cyberbrain/blob/main/LICENSE.md):
free to use, including commercially, except to offer a competing product; each release
becomes Apache-2.0 two years after it ships.

Krynex Labs · [krynexlabs.de/cyberbrain](https://www.krynexlabs.de/cyberbrain/)
