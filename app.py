"""Travel & Meetings Planner — FastAPI entry point.

Serves the JSON API under /api and the built React SPA for everything else.
"""
import os

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from server.api import router as api_router

app = FastAPI(title="Travel & Meetings Planner")

app.include_router(api_router, prefix="/api")

_FRONTEND_DIR = os.path.join(os.path.dirname(__file__), "frontend", "dist")
_STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")


@app.get("/healthz")
def healthz():
    return {"status": "ok"}


# Link Catalog tile icons live under /static/icons/lib/... — the shared
# link_bookmarks table stores those exact paths in icon_url. Mount before the
# SPA catch-all so they aren't swallowed by the index.html fallback.
if os.path.isdir(_STATIC_DIR):
    app.mount("/static", StaticFiles(directory=_STATIC_DIR), name="static")

if os.path.isdir(_FRONTEND_DIR):
    app.mount(
        "/assets",
        StaticFiles(directory=os.path.join(_FRONTEND_DIR, "assets")),
        name="assets",
    )

    @app.get("/{full_path:path}")
    def serve_spa(full_path: str):
        # API routes are handled above; anything else serves the SPA shell.
        index = os.path.join(_FRONTEND_DIR, "index.html")
        return FileResponse(index)
