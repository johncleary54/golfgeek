migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("br6z7zgbzwm96h1")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ruc8t204",
    "name": "userId",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": true,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("br6z7zgbzwm96h1")

  // remove
  collection.schema.removeField("ruc8t204")

  return dao.saveCollection(collection)
})
