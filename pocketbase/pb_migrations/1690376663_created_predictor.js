migrate((db) => {
  const collection = new Collection({
    "id": "yn2bv41di7ct5ov",
    "created": "2023-07-26 13:04:23.604Z",
    "updated": "2023-07-26 13:04:23.604Z",
    "name": "predictor",
    "type": "base",
    "system": false,
    "schema": [
      {
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
      },
      {
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
      },
      {
        "system": false,
        "id": "ws9rmv0b",
        "name": "value",
        "type": "number",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null
        }
      },
      {
        "system": false,
        "id": "st69m4v8",
        "name": "active",
        "type": "bool",
        "required": false,
        "unique": false,
        "options": {}
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("yn2bv41di7ct5ov");

  return dao.deleteCollection(collection);
})
