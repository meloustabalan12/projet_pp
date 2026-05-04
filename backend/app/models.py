from sqlalchemy import Column, Integer, String, Text, ForeignKey, Table
from sqlalchemy.orm import relationship
from .database import Base

ticket_tag = Table(
    "ticket_tag",
    Base.metadata,
    Column("ticket_id", ForeignKey("tickets.id", ondelete="CASCADE"), primary_key=True),
    Column("tag_id", ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True),
)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, nullable=False, index=True)
    role = Column(String(50), nullable=False, default="client")

    tickets = relationship("Ticket", back_populates="owner", cascade="all, delete")


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)

    tickets = relationship("Ticket", back_populates="category")


class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)

    tickets = relationship("Ticket", secondary=ticket_tag, back_populates="tags")


class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String(30), nullable=False, default="open")
    priority = Column(String(30), nullable=False, default="medium")
    suggested_category = Column(String(100), nullable=True)
    ai_hint = Column(String(255), nullable=True)

    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)

    owner = relationship("User", back_populates="tickets")
    category = relationship("Category", back_populates="tickets")
    tags = relationship("Tag", secondary=ticket_tag, back_populates="tickets")

    resolution = relationship(
        "Resolution",
        back_populates="ticket",
        uselist=False,
        cascade="all, delete-orphan"
    )


class Resolution(Base):
    __tablename__ = "resolutions"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    solved_by = Column(String(100), nullable=False)

    ticket_id = Column(Integer, ForeignKey("tickets.id"), unique=True, nullable=False)

    ticket = relationship("Ticket", back_populates="resolution")