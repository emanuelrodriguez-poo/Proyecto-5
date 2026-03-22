import sys
import os
# Asegurar que el directorio raíz del proyecto esté en el PYTHONPATH para importar Backend
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from Backend.data_parser import load_fontibon_polygon, load_fontibon_paraderos
import os

app = FastAPI()

# Allow CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/fontibon")
def get_fontibon():
    return load_fontibon_polygon()

@app.get("/api/paraderos")
def get_paraderos():
    return load_fontibon_paraderos()

# Mount frontend directory for static files at root
frontend_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "Frontend")
app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")
