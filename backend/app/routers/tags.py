from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/tags", tags=["Tags"])


@router.post("/", response_model=schemas.TagOut, status_code=status.HTTP_201_CREATED)
def create_tag(tag: schemas.TagCreate, db: Session = Depends(get_db)):
    existing = db.query(models.Tag).filter(models.Tag.name == tag.name).first()
    if existing:
        raise HTTPException(status_code=409, detail="Ce tag existe déjà.")

    db_tag = models.Tag(**tag.model_dump())
    db.add(db_tag)
    db.commit()
    db.refresh(db_tag)
    return db_tag


@router.get("/", response_model=list[schemas.TagOut])
def list_tags(db: Session = Depends(get_db)):
    return db.query(models.Tag).order_by(models.Tag.name.asc()).all()


@router.get("/{tag_id}", response_model=schemas.TagOut)
def get_tag(tag_id: int, db: Session = Depends(get_db)):
    tag = db.query(models.Tag).filter(models.Tag.id == tag_id).first()
    if not tag:
        raise HTTPException(status_code=404, detail="Tag introuvable.")
    return tag


@router.put("/{tag_id}", response_model=schemas.TagOut)
def update_tag(tag_id: int, payload: schemas.TagCreate, db: Session = Depends(get_db)):
    tag = db.query(models.Tag).filter(models.Tag.id == tag_id).first()
    if not tag:
        raise HTTPException(status_code=404, detail="Tag introuvable.")

    existing = (
        db.query(models.Tag)
        .filter(models.Tag.name == payload.name, models.Tag.id != tag_id)
        .first()
    )
    if existing:
        raise HTTPException(status_code=409, detail="Ce tag existe déjà.")

    tag.name = payload.name
    db.commit()
    db.refresh(tag)
    return tag


@router.delete("/{tag_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tag(tag_id: int, db: Session = Depends(get_db)):
    tag = db.query(models.Tag).filter(models.Tag.id == tag_id).first()
    if not tag:
        raise HTTPException(status_code=404, detail="Tag introuvable.")

    db.delete(tag)
    db.commit()
    return None