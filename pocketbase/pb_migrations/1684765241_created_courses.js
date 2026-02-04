migrate((db) => {
  const collection = new Collection({
    "id": "br6z7zgbzwm96h1",
    "created": "2023-05-22 14:20:41.697Z",
    "updated": "2023-05-22 14:20:41.697Z",
    "name": "courses",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "g8gofqrn",
        "name": "name",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
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
  const collection = dao.findCollectionByNameOrId("br6z7zgbzwm96h1");

  return dao.deleteCollection(collection);
})
