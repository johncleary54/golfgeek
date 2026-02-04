migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3842da5w8t952so")

  collection.deleteRule = "@request.auth.id = userId.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3842da5w8t952so")

  collection.deleteRule = null

  return dao.saveCollection(collection)
})
