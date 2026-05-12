migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("moci2v3bp601jku")

  // remove
  collection.schema.removeField("2oyoqfin")

  // remove
  collection.schema.removeField("f7mtlk31")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("moci2v3bp601jku")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "2oyoqfin",
    "name": "shot",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "f7mtlk31",
    "name": "sg",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  return dao.saveCollection(collection)
})
