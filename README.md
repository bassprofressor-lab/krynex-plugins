# Krynex plugins for Claude Code

```
/plugin marketplace add bassprofressor-lab/krynex-plugins
/plugin install cyberbrain@krynex-plugins
/plugin install agentguard@krynex-plugins
```

Two plugins, independent of each other: install one or both.

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
checks it against [`plugins/cyberbrain/SHA256SUMS`](plugins/cyberbrain/SHA256SUMS) in this
repository, and keeps it in Claude Code's plugin data directory. A checksum that does not match
means nothing is run. The checksums live here and not in the release on purpose: whoever could
replace a release could replace its checksum file with it, so tampering would also need a
visible commit to this repository. CI checks that the pinned values match the release. It never
fetches "latest": a new binary comes with a plugin update that changes `VERSION` and
`SHA256SUMS`, nothing else.

Builds: Linux x86_64, Windows x86_64 (Git Bash, which Claude Code on Windows uses), macOS on
Apple silicon. Set `CYBERBRAIN_BIN=/path/to/cyberbrain` to use your own build.

If you set Cyberbrain up earlier with `cyberbrain install`, run it again after installing the
plugin: it notices the plugin and takes its own hook entries out of `.claude/settings.json`,
so no event runs twice.

## agentguard

Asks your AgentGuard service before every shell command, file write and web fetch the agent
makes, and does what it answers. **AgentGuard is a commercial service by Krynex Labs**, run for
you or set up inside your network under contract. This plugin is only the client in Claude Code:
it is free and open, and it does nothing without an AgentGuard instance and an agent key.
Access: [krynexlabs.de/services/agentguard](https://www.krynexlabs.de/services/agentguard/).

When you enable it, Claude Code asks for the service address, the agent key (kept in your
system's secure credential store), the tenant, the agent id, and the mode:

- **shadow** (default): every call is recorded with what AgentGuard would have decided; nothing
  is stopped. The safe way to start.
- **enforce**: deny and ask are carried out. If the service cannot answer, reads still go ahead
  and everything else asks a person. If the guard itself cannot start, it asks a person too.

The address must be on your machine or in your private network: tool calls carry commands and
file contents, and there is no switch to send them to a public address.

It runs the same Cyberbrain binary as `cyberbrain guard`, downloaded and checked the same way
(see above); it needs no memory store. If you use both plugins and your Cyberbrain store also
has a `[governance]` address, the call is checked twice; use one of the two.

## Licences

The plugins (manifests, skills, hooks, starters) are Apache-2.0. Cyberbrain is free on a single
machine; the team collector (hub) needs a licence. AgentGuard, the service, is not part of this
repository and not open source. The Cyberbrain binary it
downloads is [FSL-1.1-ALv2](https://github.com/bassprofressor-lab/cyberbrain/blob/main/LICENSE.md):
free to use, including commercially, except to offer a competing product; each release
becomes Apache-2.0 two years after it ships.

Krynex Labs · [krynexlabs.de/cyberbrain](https://www.krynexlabs.de/cyberbrain/)
