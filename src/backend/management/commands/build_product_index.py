import json
from pathlib import Path

import faiss
import numpy as np
from django.conf import settings
from django.core.management.base import BaseCommand
from sentence_transformers import SentenceTransformer

from backend.models import Listing


class Command(BaseCommand):
    help = "Build/refresh the FAISS index for semantic product search."

    def add_arguments(self, parser):
        parser.add_argument(
            "--model",
            default="sentence-transformers/all-MiniLM-L6-v2",
            help="SentenceTransformer model to use for embeddings.",
        )
        parser.add_argument(
            "--output-dir",
            default="backend/search_index",
            help="Directory (relative to src/) where index files will be stored.",
        )

    def handle(self, *args, **options):
        listings = Listing.objects.all()
        if not listings.exists():
            self.stdout.write(self.style.WARNING("No listings found; nothing to index."))
            return

        model_name = options["model"]
        output_dir = Path(settings.BASE_DIR) / options["output_dir"]
        output_dir.mkdir(parents=True, exist_ok=True)
        index_path = output_dir / "product_index.faiss"
        id_path = output_dir / "product_ids.npy"
        meta_path = output_dir / "metadata.json"

        self.stdout.write(f"Loading embedding model: {model_name}")
        model = SentenceTransformer(model_name)

        texts = []
        listing_ids = []
        for listing in listings:
            text_parts = [
                listing.title or "",
                listing.description or "",
                getattr(listing.category, "name", ""),
                f"Color: {listing.color}" if listing.color else "",
                f"Price: {listing.price}" if listing.price else "",
                f"Seller: {listing.user.name}" if listing.user_id else "",
            ]
            dense_text = ". ".join(part for part in text_parts if part).strip()
            if not dense_text:
                dense_text = listing.title or "Marketplace listing"
            texts.append(dense_text)
            listing_ids.append(listing.id)

        self.stdout.write(f"Encoding {len(texts)} listings…")
        embeddings = model.encode(
            texts,
            batch_size=32,
            convert_to_numpy=True,
            show_progress_bar=True,
            normalize_embeddings=True,
        ).astype("float32")

        dim = embeddings.shape[1]
        index = faiss.IndexFlatIP(dim)
        index.add(embeddings)

        faiss.write_index(index, str(index_path))
        np.save(id_path, np.array(listing_ids, dtype=np.int32))

        meta = {"model": model_name, "count": len(listing_ids)}
        meta_path.write_text(json.dumps(meta, indent=2))

        self.stdout.write(
            self.style.SUCCESS(
                f"Saved FAISS index ({len(listing_ids)} items) to {index_path}"
            )
        )

