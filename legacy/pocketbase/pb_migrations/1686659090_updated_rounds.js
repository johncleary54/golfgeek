migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3842da5w8t952so")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "uyhaspoq",
    "name": "type",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3842da5w8t952so")

  // remove
  collection.schema.removeField("uyhaspoq")

  return dao.saveCollection(collection)
})
