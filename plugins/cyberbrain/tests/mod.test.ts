// Tests for the Cyberbrain mod (hooks/register.js). Run with `claude plugin test plugins/cyberbrain`.
import { expect, test } from 'claude-code/testing'

const quiet = () => ({ value: undefined })

test('a compaction tells the person, in a toast and in the transcript, and goes on', async ($, on) => {
  const seen: string[] = []
  on('ui.toast', ($, e) => (seen.push('toast:' + e.text), { value: undefined }))
  on('ui.log', ($, e) => (seen.push('log:' + e.text), { value: undefined }))
  let compacted = false
  on('session.compact', ($, e) => ((compacted = true), { messages: e.messages }))

  await $.session.compact({ messages: [{ role: 'user', text: 'hallo', toolUses: [] }] })
  expect(compacted).toBe(true)
  expect(seen.length).toBe(2)
  expect(seen[0]).toMatch(/^toast:context is being compacted/)
  expect(seen[1]).toMatch(/cyberbrain write/)
})

test('a compaction goes on even when the notice cannot be shown', async ($, on) => {
  on('ui.toast', () => ({ deny: 'no surface' }))
  on('ui.log', quiet)
  let compacted = false
  on('session.compact', ($, e) => ((compacted = true), { messages: e.messages }))
  await $.session.compact({ messages: [{ role: 'user', text: 'hallo', toolUses: [] }] })
  expect(compacted).toBe(true)
})

test('/recall runs the plugin starter with the question as one argument, no shell', async ($, on) => {
  let argv: string[] = []
  on('process.run', ($, e) => {
    argv = e.argv
    return { value: { exitCode: 0, stdout: '1. r2-abc  r2  some-note\n', stderr: '' } }
  })
  const answer = await $.command.run({ command: 'recall', args: 'why is the deploy slow; rm -rf /' })
  expect(argv.length).toBe(3)
  expect(argv[0]).toMatch(/\/bin\/cyberbrain$/)
  expect(argv[1]).toBe('recall')
  expect(argv[2]).toBe('why is the deploy slow; rm -rf /')
  expect(answer.text).toBe('1. r2-abc  r2  some-note')
})

test('/recall --id expands one citation', async ($, on) => {
  let argv: string[] = []
  on('process.run', ($, e) => ((argv = e.argv), { value: { exitCode: 0, stdout: 'note', stderr: '' } }))
  await $.command.run({ command: 'recall', args: '--id r2-a91f2c33e1bd' })
  expect(argv.slice(1)).toEqual(['recall', '--id', 'r2-a91f2c33e1bd'])
})

test('/recall without a question explains itself and runs nothing', async ($, on) => {
  let ran = false
  on('process.run', () => ((ran = true), { value: { exitCode: 0, stdout: '', stderr: '' } }))
  const answer = await $.command.run({ command: 'recall', args: '  ' })
  expect(ran).toBe(false)
  expect(answer.text).toMatch(/^Usage: \/recall/)
})

test('/recall says so when the binary fails or cannot start', async ($, on) => {
  let calls = 0
  on('process.run', () => {
    calls += 1
    return calls === 1
      ? { value: { exitCode: 1, stdout: '', stderr: 'no store found' } }
      : { deny: 'cannot start' }
  })
  const failed = await $.command.run({ command: 'recall', args: 'x' })
  expect(failed.text).toBe('cyberbrain recall failed (exit 1): no store found')
  const refused = await $.command.run({ command: 'recall', args: 'x' })
  expect(refused.text).toMatch(/^cyberbrain recall did not run: /)
})

test('session start registers /recall, and a taken name does not stop the session', async ($, on) => {
  const registered: string[] = []
  on('command.register', ($, e) => (registered.push(e.name), { value: undefined }))
  on('session.start', () => ({ cwd: '/work' }))
  on('ui.log', quiet)
  await $.session.start({ surface: 'terminal', isInteractive: true, cwd: '/work' })
  expect(registered).toEqual(['recall'])
})

test('a refused /recall registration is logged, the session still starts', async ($, on) => {
  const logs: string[] = []
  on('command.register', () => ({ deny: '"/recall" refused: taken' }))
  on('ui.log', ($, e) => (logs.push(e.text), { value: undefined }))
  let started = false
  on('session.start', () => ((started = true), { cwd: '/work' }))
  await $.session.start({ surface: 'terminal', isInteractive: true, cwd: '/work' })
  expect(started).toBe(true)
  expect(logs[0]).toMatch(/^\/recall not registered: /)
})
