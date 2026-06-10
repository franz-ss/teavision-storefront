import { readFileSync, writeFileSync } from 'node:fs'
import { gunzipSync } from 'node:zlib'
const html = readFileSync('design/teavision-redesign.html', 'utf8')
const manifest = JSON.parse(
  html.match(/<script type="__bundler\/manifest">([\s\S]*?)<\/script>/)[1],
)
const ids = JSON.parse(
  html.match(/<script type="__bundler\/ext_resources">([\s\S]*?)<\/script>/)[1],
)
for (const { id, uuid } of ids) {
  const e = manifest[uuid]
  let bytes = Buffer.from(e.data, 'base64')
  if (e.compressed) bytes = gunzipSync(bytes)
  writeFileSync(
    `public/images/${id.replace(/([A-Z])/g, '-$1').toLowerCase()}.png`,
    bytes,
  )
}
