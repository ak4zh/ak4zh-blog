import fs from 'node:fs'
import path from 'node:path'
import { DEFAULT_DATA } from '../src/lib/mind-data.js'

let sql = `-- Seed SQL generated from mind-data.js\n\n`

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL'
  return `'${String(str).replace(/'/g, "''")}'`
}

let catOrder = 0
for (const cat of DEFAULT_DATA.categories) {
  catOrder++
  const catId = `cat_${catOrder}`
  const catNsfw = cat.nsfw ? 1 : 0
  sql += `INSERT OR REPLACE INTO categories (id, name, nsfw, sort_order) VALUES (${escapeSql(catId)}, ${escapeSql(cat.name)}, ${catNsfw}, ${catOrder});\n`

  let groupOrder = 0
  for (const group of cat.groups) {
    groupOrder++
    const groupId = `grp_${catOrder}_${groupOrder}`
    sql += `INSERT OR REPLACE INTO groups (id, category_id, name, sort_order) VALUES (${escapeSql(groupId)}, ${escapeSql(catId)}, ${escapeSql(group.name)}, ${groupOrder});\n`

    let itemOrder = 0
    for (const item of group.items) {
      itemOrder++
      const itemId = `item_${catOrder}_${groupOrder}_${itemOrder}`
      const itemNsfw = item.nsfw ? 1 : 0
      const notesJson = JSON.stringify(item.notes || [])

      sql += `INSERT OR REPLACE INTO items (id, group_id, name, href, description, icon, type, status, author, creator, year, media_type, nsfw, notes_json, sort_order) VALUES (
        ${escapeSql(itemId)},
        ${escapeSql(groupId)},
        ${escapeSql(item.name)},
        ${escapeSql(item.href || '')},
        ${escapeSql(item.description || '')},
        ${escapeSql(item.icon || '')},
        ${escapeSql(item.type || 'link')},
        ${escapeSql(item.status || '')},
        ${escapeSql(item.author || '')},
        ${escapeSql(item.creator || '')},
        ${escapeSql(item.year || '')},
        ${escapeSql(item.media_type || '')},
        ${itemNsfw},
        ${escapeSql(notesJson)},
        ${itemOrder}
      );\n`
    }
  }
}

fs.writeFileSync(path.resolve('seed.sql'), sql, 'utf-8')
console.log('Successfully generated seed.sql')
