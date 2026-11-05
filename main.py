import re
from datetime import datetime, timezone
from uuid import uuid4
from typing import List

from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, ConfigDict


# =====================================================
# FastAPI Application
# =====================================================

app = FastAPI(
    title="AI Second Brain",
    description="A personal memory API to store, search, and retrieve memories.",
    version="0.2.0"
)

# =====================================================
# CORS Configuration for React Frontend
# =====================================================

allowed_origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =====================================================
# Temporary In-Memory Storage
# Note: Data resets when the server restarts.
# =====================================================

memories = []


# =====================================================
# Pydantic Models / Data Validation
# =====================================================

class MemoryInput(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    content: str = Field(
        ...,
        min_length=1,
        max_length=2000,
        description="Memory content"
    )

    importance: float = Field(
        default=0.5,
        ge=0.0,
        le=1.0,
        description="Importance score between 0 and 1"
    )


class MemoryResponse(BaseModel):
    id: str
    content: str
    importance: float
    created_at: datetime


class AskInput(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    query: str = Field(
        ...,
        min_length=1,
        max_length=500,
        description="Question to search memories"
    )


# =====================================================
# Helper Function
# =====================================================

def _tokenize(text: str) -> set[str]:
    """
    Extract lowercase alphanumeric words, stripping punctuation.
    """
    return set(re.findall(r"\b\w+\b", text.lower()))


def find_matching_memories(query: str) -> List[dict]:
    """
    Find memories that share words with the query.
    Results are ranked by importance.
    """

    query_words = _tokenize(query)
    if not query_words:
        return []

    matching_memories = []

    for memory in memories:
        content_words = _tokenize(memory["content"])

        if query_words.intersection(content_words):
            matching_memories.append(memory)

    matching_memories.sort(
        key=lambda item: item["importance"],
        reverse=True
    )

    return matching_memories


# =====================================================
# Home Endpoint
# =====================================================

@app.get("/")
def home():
    return {
        "message": "AI Second Brain backend is running!",
        "status": "success"
    }


# =====================================================
# Health Check
# =====================================================

@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "total_memories": len(memories)
    }


# =====================================================
# Add Memory
# =====================================================

@app.post(
    "/api/memories",
    status_code=status.HTTP_201_CREATED
)
def add_memory(memory: MemoryInput):
    new_memory = {
        "id": str(uuid4()),
        "content": memory.content,
        "importance": memory.importance,
        "created_at": datetime.now(timezone.utc)
    }

    memories.append(new_memory)

    return {
        "message": "Memory saved successfully",
        "memory": new_memory
    }


# =====================================================
# Get All Memories
# =====================================================

@app.get("/api/memories")
def get_memories():
    return {
        "count": len(memories),
        "memories": memories
    }


# =====================================================
# Search Memories (Must precede /api/memories/{memory_id})
# =====================================================

@app.get("/api/memories/search")
def search_memories(
    q: str = Query(
        ...,
        min_length=1,
        max_length=500,
        description="Search query"
    )
):
    matching_memories = find_matching_memories(q)

    return {
        "query": q,
        "count": len(matching_memories),
        "memories": matching_memories
    }


# =====================================================
# Get Single Memory by ID
# =====================================================

@app.get("/api/memories/{memory_id}")
def get_memory(memory_id: str):
    for memory in memories:
        if memory["id"] == memory_id:
            return {
                "message": "Memory retrieved successfully",
                "memory": memory
            }

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Memory not found"
    )


# =====================================================
# Delete Memory
# =====================================================

@app.delete("/api/memories/{memory_id}")
def delete_memory(memory_id: str):
    for index, memory in enumerate(memories):
        if memory["id"] == memory_id:
            deleted_memory = memories.pop(index)

            return {
                "message": "Memory deleted successfully",
                "memory": deleted_memory
            }

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Memory not found"
    )


# =====================================================
# Ask Question
# =====================================================

@app.post("/api/ask")
def ask_question(data: AskInput):
    matching_memories = find_matching_memories(data.query)

    if matching_memories:
        answer = "I found related memories."
    else:
        answer = "I couldn't find a related memory yet."

    return {
        "query": data.query,
        "answer": answer,
        "memories_used": matching_memories
    }
