# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from typing import List
# import uuid

# from app.database import get_db
# from app.models.node import Node
# from app.schemas.node import NodeCreate, NodeUpdate, NodeResponse
# # from app.services.embeddings import embed_node, delete_node_embedding
# from app.services.gemini import brainstorm_node, improve_node

# router = APIRouter(prefix="/nodes", tags=["nodes"])

# @router.get("/", response_model=List[NodeResponse])
# def get_nodes(user_id: str, db: Session = Depends(get_db)):
#     return db.query(Node).filter(Node.user_id == user_id).all()

# @router.post("/", response_model=NodeResponse)
# async def create_node(
#     user_id: str,
#     node: NodeCreate,
#     db: Session = Depends(get_db)
# ):
#     node_id = str(uuid.uuid4())
#     embedding = embed_node(node.label, node.type, node.description or "")
#     # chroma_id = embed_node(
#     #     user_id, node_id,
#     #     node.label, node.type,
#     #     node.description or ""
#     # )
#     db_node = Node(
#         id=node_id,
#         user_id=user_id,
#         label=node.label,
#         type=node.type,
#         description=node.description,
#         rx=node.rx,
#         ry=node.ry,
#         # chroma_id=chroma_id
#         embedding=embedding
#     )
#     db.add(db_node)
#     db.commit()
#     db.refresh(db_node)
#     return db_node

# @router.put("/{node_id}", response_model=NodeResponse)
# def update_node(
#     node_id: str,
#     updates: NodeUpdate,
#     db: Session = Depends(get_db)
# ):
#     node = db.query(Node).filter(Node.id == node_id).first()
#     if not node:
#         raise HTTPException(status_code=404, detail="Node not found")
#     for k, v in updates.dict(exclude_none=True).items():
#         setattr(node, k, v)
#     db.commit()
#     db.refresh(node)
#     return node

# # @router.delete("/{node_id}")
# # def delete_node(node_id: str, db: Session = Depends(get_db)):
# #     node = db.query(Node).filter(Node.id == node_id).first()
# #     if not node:
# #         raise HTTPException(status_code=404, detail="Node not found")
# #     if node.chroma_id:
# #         delete_node_embedding(node.user_id, node.chroma_id)
# #     db.delete(node)
# #     db.commit()
# #     return {"deleted": node_id}

# @router.post("/{node_id}/brainstorm")
# async def brainstorm(node_id: str, db: Session = Depends(get_db)):
#     node = db.query(Node).filter(Node.id == node_id).first()
#     if not node:
#         raise HTTPException(status_code=404, detail="Node not found")
#     result = await brainstorm_node(node.label, node.type, node.description or "")
#     return {"result": result}

# @router.post("/{node_id}/improve")
# async def improve(node_id: str, db: Session = Depends(get_db)):
#     node = db.query(Node).filter(Node.id == node_id).first()
#     if not node:
#         raise HTTPException(status_code=404, detail="Node not found")
#     result = await improve_node(node.label, node.type, node.description or "")
#     return {"result": result}



from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid

from app.database import get_db
from app.models.node import Node
from app.schemas.node import NodeCreate, NodeUpdate, NodeResponse
from app.services.embeddings import embed_node
from app.services.gemini import brainstorm_node, improve_node

router = APIRouter(prefix="/nodes", tags=["nodes"])

@router.get("/", response_model=List[NodeResponse])
def get_nodes(user_id: str, db: Session = Depends(get_db)):
    return db.query(Node).filter(Node.user_id == user_id).all()

@router.post("/", response_model=NodeResponse)
async def create_node(
    user_id: str,
    node: NodeCreate,
    db: Session = Depends(get_db)
):
    node_id = str(uuid.uuid4())
    embedding = embed_node(node.label, node.type, node.description or "")
    db_node = Node(
        id=node_id,
        user_id=user_id,
        label=node.label,
        type=node.type,
        description=node.description,
        rx=node.rx,
        ry=node.ry,
        embedding=embedding
    )
    db.add(db_node)
    db.commit()
    db.refresh(db_node)
    return db_node

@router.put("/{node_id}", response_model=NodeResponse)
def update_node(
    node_id: str,
    updates: NodeUpdate,
    db: Session = Depends(get_db)
):
    node = db.query(Node).filter(Node.id == node_id).first()
    if not node:
        raise HTTPException(status_code=404, detail="Node not found")
    for k, v in updates.dict(exclude_none=True).items():
        setattr(node, k, v)
    db.commit()
    db.refresh(node)
    return node

@router.delete("/{node_id}")
def delete_node(node_id: str, db: Session = Depends(get_db)):
    node = db.query(Node).filter(Node.id == node_id).first()
    if not node:
        raise HTTPException(status_code=404, detail="Node not found")
    db.delete(node)
    db.commit()
    return {"deleted": node_id}

@router.post("/{node_id}/brainstorm")
async def brainstorm(node_id: str, db: Session = Depends(get_db)):
    node = db.query(Node).filter(Node.id == node_id).first()
    if not node:
        raise HTTPException(status_code=404, detail="Node not found")
    result = await brainstorm_node(node.label, node.type, node.description or "")
    return {"result": result}

@router.post("/{node_id}/improve")
async def improve(node_id: str, db: Session = Depends(get_db)):
    node = db.query(Node).filter(Node.id == node_id).first()
    if not node:
        raise HTTPException(status_code=404, detail="Node not found")
    result = await improve_node(node.label, node.type, node.description or "")
    return {"result": result}
