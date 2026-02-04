migrate((db) => {
  const collection = new Collection({
    "id": "23oc597r1w774e3",
    "created": "2023-07-27 10:25:35.254Z",
    "updated": "2023-07-27 10:25:35.254Z",
    "name": "benchmarks",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "j1gdppsz",
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
        "id": "2vwio1ur",
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
        "id": "ls5jhaym",
        "name": "value",
        "type": "number",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null
        }
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
  const collection = dao.findCollectionByNameOrId("23oc597r1w774e3");

  return dao.deleteCollection(collection);
})
