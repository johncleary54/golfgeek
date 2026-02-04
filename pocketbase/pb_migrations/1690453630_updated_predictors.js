migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("yn2bv41di7ct5ov")

  // remove
  collection.schema.removeField("lwpr5lld")

  // remove
  collection.schema.removeField("st69m4v8")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qg23ysnv",
    "name": "benchmarkId",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "23oc597r1w774e3",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("yn2bv41di7ct5ov")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lwpr5lld",
    "name": "name",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "st69m4v8",
    "name": "active",
    "type": "bool",
    "required": false,
    "unique": false,
    "options": {}
  }))

  // remove
  collection.schema.removeField("qg23ysnv")

  return dao.saveCollection(collection)
})
