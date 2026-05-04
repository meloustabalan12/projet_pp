from pydantic import BaseModel, EmailStr, field_validator
from typing import List, Optional

VALID_STATUSES = {"open", "in_progress", "resolved", "closed"}
VALID_PRIORITIES = {"low", "medium", "high"}


class TagBase(BaseModel):
    name: str


class TagCreate(TagBase):
    pass


class TagOut(TagBase):
    id: int

    class Config:
        from_attributes = True


class CategoryBase(BaseModel):
    name: str


class CategoryCreate(CategoryBase):
    pass


class CategoryOut(CategoryBase):
    id: int

    class Config:
        from_attributes = True


class UserBase(BaseModel):
    full_name: str
    email: EmailStr
    role: str = "client"


class UserCreate(UserBase):
    pass


class UserOut(UserBase):
    id: int

    class Config:
        from_attributes = True


class ResolutionBase(BaseModel):
    content: str
    solved_by: str


class ResolutionCreate(ResolutionBase):
    pass


class ResolutionOut(ResolutionBase):
    id: int

    class Config:
        from_attributes = True


class TicketCreate(BaseModel):
    title: str
    description: str
    status: str = "open"
    priority: Optional[str] = None
    owner_id: int
    category_id: int
    tag_ids: List[int] = []

    @field_validator("status")
    @classmethod
    def validate_status(cls, value):
        if value not in VALID_STATUSES:
            raise ValueError(f"Status must be one of: {', '.join(VALID_STATUSES)}")
        return value

    @field_validator("priority")
    @classmethod
    def validate_priority(cls, value):
        if value is not None and value not in VALID_PRIORITIES:
            raise ValueError(f"Priority must be one of: {', '.join(VALID_PRIORITIES)}")
        return value


class TicketUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    category_id: Optional[int] = None
    tag_ids: Optional[List[int]] = None

    @field_validator("status")
    @classmethod
    def validate_status(cls, value):
        if value is not None and value not in VALID_STATUSES:
            raise ValueError(f"Status must be one of: {', '.join(VALID_STATUSES)}")
        return value

    @field_validator("priority")
    @classmethod
    def validate_priority(cls, value):
        if value is not None and value not in VALID_PRIORITIES:
            raise ValueError(f"Priority must be one of: {', '.join(VALID_PRIORITIES)}")
        return value


class TicketStatusUpdate(BaseModel):
    status: str

    @field_validator("status")
    @classmethod
    def validate_status(cls, value):
        if value not in VALID_STATUSES:
            raise ValueError(f"Status must be one of: {', '.join(VALID_STATUSES)}")
        return value


class TicketOut(BaseModel):
    id: int
    title: str
    description: str
    status: str
    priority: str
    suggested_category: Optional[str] = None
    ai_hint: Optional[str] = None
    owner: UserOut
    category: CategoryOut
    tags: List[TagOut] = []
    resolution: Optional[ResolutionOut] = None

    class Config:
        from_attributes = True


class StatsOut(BaseModel):
    total: int
    open: int
    in_progress: int
    resolved: int
    closed: int
    high_priority: int