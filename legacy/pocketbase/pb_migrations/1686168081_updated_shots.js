migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("moci2v3bp601jku")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "vaumndlr",
    "name": "userId",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("moci2v3bp601jku")

  // remove
  collection.schema.removeField("vaumndlr")

  return dao.saveCollection(collection)
})
