"""Resolve the signed-in user.

Databricks Apps forward the authenticated user's identity in request headers.
Locally we fall back to DEV_USER_EMAIL so the app is usable in dev.
"""
import os

from fastapi import Request


def current_user(request: Request) -> str:
    email = (
        request.headers.get("X-Forwarded-Email")
        or request.headers.get("x-forwarded-email")
        or request.headers.get("X-Forwarded-Preferred-Username")
    )
    if not email:
        email = os.environ.get("DEV_USER_EMAIL", "dev@databricks.com")
    return email
