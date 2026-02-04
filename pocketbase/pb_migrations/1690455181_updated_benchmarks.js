migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("23oc597r1w774e3")

  collection.listRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("23oc597r1w774e3")

  collection.listRule = null

  return dao.saveCollection(collection)
})
