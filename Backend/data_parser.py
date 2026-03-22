import json
import os

def load_fontibon_polygon():
    # Load localidades.json
    path = os.path.join("Data", "localidades.json")
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    # Filter for Fontibon
    fontibon = None
    for feature in data.get("features", []):
        if feature.get("attributes", {}).get("LocCodigo") == "09" or feature.get("attributes", {}).get("LocNombre", "").upper() == "FONTIBON":
            fontibon = feature
            break
            
    if not fontibon:
        return {"type": "FeatureCollection", "features": []}
        
    # Convert Esri JSON to GeoJSON
    geojson_feature = {
        "type": "Feature",
        "properties": fontibon["attributes"],
        "geometry": {
            "type": "Polygon",
            "coordinates": fontibon["geometry"]["rings"]
        }
    }
    
    return {
        "type": "FeatureCollection",
        "features": [geojson_feature]
    }

def load_fontibon_paraderos():
    # Load paraderos.json
    path = os.path.join("Data", "paraderos.json")
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    features = []
    # Filter for localidad_ == 9 (Fontibon)
    for feature in data.get("features", []):
        if feature.get("attributes", {}).get("localidad_") == 9:
            geojson_feature = {
                "type": "Feature",
                "properties": feature["attributes"],
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        feature["geometry"]["x"],
                        feature["geometry"]["y"]
                    ]
                }
            }
            features.append(geojson_feature)
            
    return {
        "type": "FeatureCollection",
        "features": features
    }
