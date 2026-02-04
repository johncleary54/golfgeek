migrate((db) => {
  const collection = new Collection({
    "id": "ediwbaexh1kvriu",
    "created": "2023-06-07 11:16:20.220Z",
    "updated": "2023-06-07 11:16:20.220Z",
    "name": "holes",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "mtldwygj",
        "name": "roundId",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "collectionId": "3842da5w8t952so",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "uuevmzbq",
        "name": "hole",
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
        "id": "zbyni8sy",
        "name": "par",
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
  const collection = dao.findCollectionByNameOrId("ediwbaexh1kvriu");

  return dao.deleteCollection(collection);
})
