from src.dao.base import BaseDAO
from src.user.models import User

class UserDAO(BaseDAO):
    model = User