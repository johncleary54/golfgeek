migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("yn2bv41di7ct5ov")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "zdtgimb7",
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

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "7ncyoytz",
    "name": "type",
    "type": "text",
    "required": true,
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
  const collection = dao.findCollectionByNameOrId("yn2bv41di7ct5ov")

  // remove
  collection.schema.removeField("zdtgimb7")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "7ncyoytz",
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
})
