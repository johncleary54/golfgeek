migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("23oc597r1w774e3")

  collection.createRule = ""
  collection.updateRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("23oc597r1w774e3")

  collection.createRule = null
  collection.updateRule = null

  return dao.saveCollection(collection)
})
