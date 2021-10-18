/*
 * All routes for maps are defined here
 * Since this file is loaded in server.js into api/maps,
 *   these routes are mounted onto /maps
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const generateRandomString = require('../public/scripts/generate_string.js');

module.exports = (db) => {

  router.get('/create', (req, res) => {
    res.render("create_map");
  });

  router.post('/create', (req, res) => {
    // console.log("req.body",req.body)
    const markers = req.body.markers;
    const mapID = generateRandomString();
    const mapTitle = req.body.mapTitle;
    const mapDesc = req.body.mapDescription;

    const queryStringMaps = `INSERT INTO maps (id, title, description, user_id, preview_image) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const valuesMaps = [`${mapID}`, `${mapTitle}`, `${mapDesc}`, '1', 'https://i.pinimg.com/474x/b4/7b/96/b47b9623ba93546b9a2c412e1abe9306.jpg'];

    const generatePoints = (markers) => {
      for (const marker of markers) {
        const queryStringPoints = `INSERT INTO points (title, description, latitude, longitude, map_id, user_id, category) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
        const valuesPoints = [marker.pointTitle, marker.pointDescription, marker.coordinates.lat, marker.coordinates.lng, mapID, '1', marker.category];
        db.query(queryStringPoints, valuesPoints);
      }
    };

    db.query(queryStringMaps, valuesMaps) //query+insert map data first
    .then(() => {
      generatePoints(markers); //query+insert points data second. inside promise.then to ensure that this chains after map creation
    })
      .catch(err => {
        console.error('points_err:', err.message);
        res
          .status(500)
      });
    });

    return router;

};