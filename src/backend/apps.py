import logging
from django.apps import AppConfig


logger = logging.getLogger(__name__)


class BackendConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'backend'

    def ready(self):
        from . import search

        if search.load_index():
            logger.info("Semantic search index loaded successfully.")
        else:
            logger.warning(
                "Semantic search index not found. Run "
                "`python manage.py build_product_index` to enable it."
            )
