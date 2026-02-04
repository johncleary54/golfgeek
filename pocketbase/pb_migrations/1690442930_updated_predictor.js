migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("yn2bv41di7ct5ov")

  collection.name = "predictors"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("yn2bv41di7ct5ov")

  collection.name = "predictor"

  return dao.saveCollection(collection)
})
