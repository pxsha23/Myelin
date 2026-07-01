# from sqlalchemy import Column, String, DateTime, Float, ForeignKey
# from sqlalchemy.sql import func
# from app.database import Base

# class Node(Base):
#     __tablename__ = "nodes"

#     id = Column(String, primary_key=True, index=True)
#     user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
#     label = Column(String, nullable=False)
#     type = Column(String, nullable=False)
#     description = Column(String, nullable=True)
#     status = Column(String, default="active")
#     rx = Column(Float, default=0.5)
#     ry = Column(Float, default=0.5)
#     chroma_id = Column(String, nullable=True)
#     created_at = Column(DateTime(timezone=True), server_default=func.now())
#     updated_at = Column(DateTime(timezone=True), onupdate=func.now())

# changed code cause render couldn't handle so much data, it failed intantly after deployement

from sqlalchemy import Column, String, DateTime, Float, ForeignKey, JSON
from sqlalchemy.sql import func
from app.database import Base

class Node(Base):
    __tablename__ = "nodes"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    label = Column(String, nullable=False)
    type = Column(String, nullable=False)
    description = Column(String, nullable=True)
    status = Column(String, default="active")
    rx = Column(Float, default=0.5)
    ry = Column(Float, default=0.5)
    embedding = Column(JSON, nullable=True)   # <-- replaces chroma_id
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
