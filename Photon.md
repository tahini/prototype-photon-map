Pour installer photon localement avec les données du Québec

1. Cloner et compiler nominatim en suivant les instructions ici: https://nominatim.org/release-docs/latest/appendix/Install-on-Ubuntu-20/

2. Importation des données avec les instructions ici: https://nominatim.org/release-docs/latest/admin/Import/ Le fichier .env a été créé dans le projet. 

2.1. Utilisation de la région de Québec depuis geofabrik
2.2. Commande d'installation nominatim: `nominatim import --osm-file quebec-latest.osm --reverse-only 2>&1`
2.3. Ajout du fichier d,importance `nominatim refresh --wiki-data --importance` tel qu'indiqué dans la page d'import (garder le fichier gzippé)

3. Importation des données nominatim dans photon: `java -jar photon-0.3.5.jar -nominatim-import -host localhost -port 5432 -database openStreetMap -user nominatim -password nominatim1234 -languages fr,en`


Requêtes autour de Villeray:
http://localhost:2322/api?q=villeroy&lon=-73.61593&lat=45.548107&limit=10

Requête autour de Verdn:
http://localhost:2322/api?q=verdon&lon=73.57277&lat=45.460672&limit=10&zoom=16&location_bias_scale=0.5