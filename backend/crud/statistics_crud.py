from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
import backend.models.models as models
import schemas
from typing import List
from uuid import UUID
from datetime import datetime, timedelta

def get_average_connections_per_user(db: Session) -> float:
    """
    Calculate the average number of connections per user.
    Considers both initiated and received connections.
    """

    # Get total number of users
    total_users = db.query(models.User).count()
    if total_users == 0:
        return 0.0  # Avoid division by zero if there are no users

    # Get total number of initiated connections
    initiated_connections_count = db.query(models.Connection.user_id).count()

    # Get total number of received connections
    received_connections_count = db.query(models.Connection.connected_user_id).count()

    # Total number of unique connections (each connection is counted twice in above queries)
    total_connections = initiated_connections_count + received_connections_count

    # Calculate average connections per user
    average_connections_per_user = total_connections / total_users

    return average_connections_per_user


def get_statistics(db: Session) -> dict:
    user_count = db.query(func.count(models.User.id)).scalar()

    connection_count = db.query(func.count(models.Connection.id)).scalar()

    last_connection = db.query(models.Connection.connection_made_at).order_by(models.Connection.connection_made_at.desc()).first()

    # Extract the datetime value from the tuple if last_connection is not None
    last_connection_datetime = last_connection[0] if last_connection else None


    # Calculate the average connections per user using the subquery
    average_connections_per_user = get_average_connections_per_user(db)

    

    return {
        'user_count': user_count,
        'connection_count': connection_count,
        'average_connections_per_user': average_connections_per_user,
        'last_connection': last_connection_datetime,
    }