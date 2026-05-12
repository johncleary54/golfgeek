migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ediwbaexh1kvriu")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "3dbttaz3",
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
  const collection = dao.findCollectionByNameOrId("ediwbaexh1kvriu")

  // remove
  collection.schema.removeField("3dbttaz3")

  return dao.saveCollection(collection)
})
