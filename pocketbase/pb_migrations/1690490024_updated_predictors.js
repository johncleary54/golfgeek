migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("yn2bv41di7ct5ov")

  collection.deleteRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("yn2bv41di7ct5ov")

  collection.deleteRule = null

  return dao.saveCollection(collection)
})
