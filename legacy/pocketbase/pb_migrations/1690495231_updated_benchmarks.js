migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("23oc597r1w774e3")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "y6rghgal",
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
  const collection = dao.findCollectionByNameOrId("23oc597r1w774e3")

  // remove
  collection.schema.removeField("y6rghgal")

  return dao.saveCollection(collection)
})
