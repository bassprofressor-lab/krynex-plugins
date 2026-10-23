// Cyberbrain mod (plugin 0.2.3, Claude Code 2.1.287 or later; older versions ignore it).
//
// Two things the settings hooks cannot do:
//
// 1. Tell the person when the context is about to be compacted. A PreCompact settings hook's
//    systemMessage is discarded by Claude Code, so the warning the binary prints never reached
//    anyone, and since 2.1.299 a session also compacts after about an hour idle, when nobody
//    is watching. What was learned and not written with `cyberbrain write` is lost then.
// 2. `/recall <question>`: the project's memory without a Claude turn. Runs the plugin's own
//    starter (the same verified binary the hooks use); the answer prints in the transcript,
//    where Claude reads it too.
//
// Nothing here talks to the network or writes a file. The only call out is $.process.run on
// this plugin's bin/cyberbrain, with an argument list and no shell.

function starter($) {
  return $.plugin.root + '/bin/cyberbrain'
}

export function register(on) {
  on('session.compact', async ($, e, next) => {
    const msg =
      'context is being compacted: what this session learned and did not record with ' +
      '`cyberbrain write` is gone from the context after this. Rings 0 and 1 come back.'
    $.ui.toast(msg)
    $.ui.log(msg)
    return next(e)
  }).catch(async ($, e, next) => {
    // A notice must never hold up a compaction: whatever failed, let it go on (or keep the
    // result if it already ran).
    return next(e)
  })

  on('session.start', async ($, e, next) => {
    try {
      await $.command.register({
        name: 'recall',
        description: 'Search the Cyberbrain memory of this project (no Claude turn)',
        argumentHint: '<question> | --id <citation>',
        immediate: true,
      })
    } catch (err) {
      // A taken name must not stop the session; say so where the person looks.
      $.ui.log('/recall not registered: ' + (err && err.message ? err.message : String(err)))
    }
    return next(e)
  })

  on('command.run', { command: 'recall' }, async ($, e) => {
    const args = (e.args || '').trim()
    if (!args) {
      return { text: 'Usage: /recall <question>  or  /recall --id <citation>' }
    }
    const m = args.match(/^--id\s+(\S+)$/)
    const argv = m ? [starter($), 'recall', '--id', m[1]] : [starter($), 'recall', args]
    try {
      const r = await $.process.run(argv) // 30 s default timeout
      const out = (r.stdout || '').trim()
      if (r.exitCode !== 0) {
        return { text: 'cyberbrain recall failed (exit ' + r.exitCode + '): ' + ((r.stderr || '').trim() || out) }
      }
      return { text: out || 'no hits' }
    } catch (err) {
      return { text: 'cyberbrain recall did not run: ' + (err && err.message ? err.message : String(err)) }
    }
  })
}
