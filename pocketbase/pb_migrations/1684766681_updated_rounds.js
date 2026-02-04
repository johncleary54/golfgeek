migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3842da5w8t952so")

  collection.listRule = "@request.auth.id = userId.id"
  collection.viewRule = "@request.auth.id = userId.id"
  collection.createRule = ""
  collection.updateRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3842da5w8t952so")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null
  collection.updateRule = null

  return dao.saveCollection(collection)
})
