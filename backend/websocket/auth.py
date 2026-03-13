from urllib.parse import parse_qs

from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from django.contrib.auth.models import AnonymousUser
from django.db import close_old_connections
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import AccessToken

from apps.accounts.models import User


@database_sync_to_async
def get_user(user_id: int):
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return AnonymousUser()


class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        close_old_connections()
        query_string = parse_qs(scope.get("query_string", b"").decode())
        token = query_string.get("token", [None])[0]
        if token:
            try:
                validated = AccessToken(token)
                scope["user"] = await get_user(validated["user_id"])
            except (InvalidToken, TokenError, KeyError):
                scope["user"] = AnonymousUser()
        else:
            scope["user"] = AnonymousUser()

        return await super().__call__(scope, receive, send)
