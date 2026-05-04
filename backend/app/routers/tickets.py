from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas
from ..services.intelligence import analyze_ticket

router = APIRouter(prefix="/tickets", tags=["Tickets"])


def get_ticket_or_404(ticket_id: int, db: Session):
    ticket = db.query(models.Ticket).filter(models.Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket introuvable.")
    return ticket


@router.get("/stats/overview", response_model=schemas.StatsOut)
def get_stats(db: Session = Depends(get_db)):
    tickets = db.query(models.Ticket).all()

    return {
        "total": len(tickets),
        "open": len([t for t in tickets if t.status == "open"]),
        "in_progress": len([t for t in tickets if t.status == "in_progress"]),
        "resolved": len([t for t in tickets if t.status == "resolved"]),
        "closed": len([t for t in tickets if t.status == "closed"]),
        "high_priority": len([t for t in tickets if t.priority == "high"]),
    }


@router.post("/", response_model=schemas.TicketOut, status_code=status.HTTP_201_CREATED)
def create_ticket(ticket: schemas.TicketCreate, db: Session = Depends(get_db)):
    owner = db.query(models.User).filter(models.User.id == ticket.owner_id).first()
    if not owner:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable.")

    category = db.query(models.Category).filter(models.Category.id == ticket.category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Catégorie introuvable.")

    tags = []
    if ticket.tag_ids:
        tags = db.query(models.Tag).filter(models.Tag.id.in_(ticket.tag_ids)).all()
        if len(tags) != len(set(ticket.tag_ids)):
            raise HTTPException(status_code=404, detail="Un ou plusieurs tags sont introuvables.")

    analysis = analyze_ticket(ticket.title, ticket.description)
    final_priority = ticket.priority if ticket.priority else analysis["priority"]

    db_ticket = models.Ticket(
        title=ticket.title,
        description=ticket.description,
        status=ticket.status,
        priority=final_priority,
        owner_id=ticket.owner_id,
        category_id=ticket.category_id,
        tags=tags,
        suggested_category=analysis["suggested_category"],
        ai_hint=analysis["ai_hint"]
    )

    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket


@router.get("/", response_model=list[schemas.TicketOut])
def list_tickets(
    status_filter: str | None = Query(None, alias="status"),
    priority: str | None = None,
    category_id: int | None = None,
    search: str | None = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Ticket)

    if status_filter:
        query = query.filter(models.Ticket.status == status_filter)

    if priority:
        query = query.filter(models.Ticket.priority == priority)

    if category_id:
        query = query.filter(models.Ticket.category_id == category_id)

    if search:
        like_value = f"%{search}%"
        query = query.filter(
            (models.Ticket.title.ilike(like_value)) |
            (models.Ticket.description.ilike(like_value))
        )

    return query.order_by(models.Ticket.id.desc()).all()


@router.get("/{ticket_id}", response_model=schemas.TicketOut)
def get_ticket(ticket_id: int, db: Session = Depends(get_db)):
    return get_ticket_or_404(ticket_id, db)


@router.put("/{ticket_id}", response_model=schemas.TicketOut)
def update_ticket(ticket_id: int, payload: schemas.TicketUpdate, db: Session = Depends(get_db)):
    ticket = get_ticket_or_404(ticket_id, db)

    if payload.category_id is not None:
        category = db.query(models.Category).filter(models.Category.id == payload.category_id).first()
        if not category:
            raise HTTPException(status_code=404, detail="Catégorie introuvable.")
        ticket.category_id = payload.category_id

    if payload.tag_ids is not None:
        tags = db.query(models.Tag).filter(models.Tag.id.in_(payload.tag_ids)).all() if payload.tag_ids else []
        if payload.tag_ids and len(tags) != len(set(payload.tag_ids)):
            raise HTTPException(status_code=404, detail="Un ou plusieurs tags sont introuvables.")
        ticket.tags = tags

    if payload.title is not None:
        ticket.title = payload.title

    if payload.description is not None:
        ticket.description = payload.description

    if payload.status is not None:
        ticket.status = payload.status

    if payload.priority is not None:
        ticket.priority = payload.priority

    if payload.title is not None or payload.description is not None:
        analysis = analyze_ticket(ticket.title, ticket.description)
        ticket.suggested_category = analysis["suggested_category"]
        ticket.ai_hint = analysis["ai_hint"]

    db.commit()
    db.refresh(ticket)
    return ticket


@router.patch("/{ticket_id}/status", response_model=schemas.TicketOut)
def update_ticket_status(ticket_id: int, payload: schemas.TicketStatusUpdate, db: Session = Depends(get_db)):
    ticket = get_ticket_or_404(ticket_id, db)
    ticket.status = payload.status
    db.commit()
    db.refresh(ticket)
    return ticket


@router.post("/{ticket_id}/resolution", response_model=schemas.TicketOut)
def add_resolution(ticket_id: int, resolution: schemas.ResolutionCreate, db: Session = Depends(get_db)):
    ticket = get_ticket_or_404(ticket_id, db)

    if ticket.resolution:
        raise HTTPException(status_code=409, detail="Ce ticket possède déjà une résolution.")

    db_resolution = models.Resolution(
        content=resolution.content,
        solved_by=resolution.solved_by,
        ticket_id=ticket.id
    )

    ticket.status = "resolved"
    db.add(db_resolution)
    db.commit()
    db.refresh(ticket)
    return ticket


@router.delete("/{ticket_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_ticket(ticket_id: int, db: Session = Depends(get_db)):
    ticket = get_ticket_or_404(ticket_id, db)
    db.delete(ticket)
    db.commit()
    return None