"""
Utilities for loading and querying the FAISS semantic search index.
"""

from pathlib import Path
from typing import Optional

import faiss
import numpy as np
from django.conf import settings
from sentence_transformers import SentenceTransformer


index: Optional[faiss.Index] = None
product_ids: Optional[np.ndarray] = None
model: Optional[SentenceTransformer] = None


def load_index(
    model_name: str = "sentence-transformers/all-MiniLM-L6-v2",
    relative_dir: str = "backend/search_index",
) -> bool:
    """
    Load the FAISS index, id map, and embedding model into memory.
    Returns True if successful, False otherwise.
    """
    global index, product_ids, model

    base_dir = Path(settings.BASE_DIR)
    index_dir = base_dir / relative_dir
    index_path = index_dir / "product_index.faiss"
    ids_path = index_dir / "product_ids.npy"

    if not index_path.exists() or not ids_path.exists():
        return False

    index = faiss.read_index(str(index_path))
    product_ids = np.load(ids_path)
    model = SentenceTransformer(model_name)
    return True


def is_ready() -> bool:
    """Helper to see if the search index is loaded."""
    return index is not None and product_ids is not None and model is not None

