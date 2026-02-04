migrate((db) => {
  const collection = new Collection({
    "id": "moci2v3bp601jku",
    "created": "2023-06-07 11:13:47.161Z",
    "updated": "2023-06-07 11:13:47.161Z",
    "name": "shots",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "1vhpa21u",
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
        "id": "98nc9ox8",
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
        "id": "2oyoqfin",
        "name": "shot",
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
        "id": "j7tjxtzb",
        "name": "location",
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
        "id": "xkmhspef",
        "name": "distance",
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
        "id": "rxklt98m",
        "name": "club",
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
        "id": "yn6cfi58",
        "name": "tags",
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
        "id": "f7mtlk31",
        "name": "sg",
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
  const collection = dao.findCollectionByNameOrId("moci2v3bp601jku");

  return dao.deleteCollection(collection);
})
