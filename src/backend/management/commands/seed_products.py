from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

from backend.models import Category, Listing


class Command(BaseCommand):
    help = "Seed the database with demo categories and listings."

    def handle(self, *args, **options):
        Account = get_user_model()
        demo_user, _ = Account.objects.get_or_create(
            email="demo@bulldogmarketplace.com",
            defaults={
                "username": "demouser",
                "name": "Demo Seller",
                "password": "demo1234",
            },
        )
        if not demo_user.has_usable_password():
            demo_user.set_password("demo1234")
            demo_user.save()

        category_specs = [
            ("Electronics", "Phones, laptops, speakers, gadgets."),
            ("Apparel", "Clothing and accessories."),
            ("Home & Decor", "Furniture, ambience lighting, and decor."),
            ("Sports & Outdoors", "Athletic gear and equipment."),
            ("Books & Media", "Textbooks, novels, and creative media."),
        ]

        categories = {}
        for name, desc in category_specs:
            category, _ = Category.objects.get_or_create(
                name=name,
                defaults={"description": desc},
            )
            categories[name] = category

        listings = [
            {
                "title": "CyberNova Wireless Headphones",
                "description": (
                    "Flagship noise-cancelling headphones with adaptive EQ, "
                    "transparency mode, and 30-hour battery life. Includes hard case."
                ),
                "price": 249.99,
                "color": "Obsidian",
                "image": "https://images.unsplash.com/photo-1516116216624-53e697fedbea",
                "category": "Electronics",
            },
            {
                "title": "LumenGlow Smart Desk Lamp",
                "description": (
                    "Minimalist desk lamp with app-controlled color temperature, "
                    "wireless phone charging pad, and ambient backlight."
                ),
                "price": 89.5,
                "color": "Arctic White",
                "image": "https://images.unsplash.com/photo-1493666438817-866a91353ca9",
                "category": "Home & Decor",
            },
            {
                "title": "SummitPulse Running Shoes",
                "description": (
                    "Breathable knit upper with responsive foam midsole. "
                    "Great for daily training and weekend 10Ks."
                ),
                "price": 129.0,
                "color": "Solar Orange",
                "image": "https://images.unsplash.com/photo-1528701800489-20be3c2a2d5d",
                "category": "Sports & Outdoors",
            },
            {
                "title": "Aurora Studio Keyboard",
                "description": (
                    "Hot-swappable 75% mechanical keyboard, gasket-mounted with "
                    "RGB underglow and PBT keycaps. Includes tactile switches."
                ),
                "price": 199.99,
                "color": "Midnight Navy",
                "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
                "category": "Electronics",
            },
            {
                "title": "GlacierFit Puffer Jacket",
                "description": (
                    "Lightweight synthetic down jacket rated to -10°C. "
                    "Packs into its own pocket and repels light rain."
                ),
                "price": 159.5,
                "color": "Glacier Blue",
                "image": "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb",
                "category": "Apparel",
            },
            {
                "title": "Analog Dreams Vinyl Starter Kit",
                "description": (
                    "Includes fully automatic turntable, powered bookshelf speakers, "
                    "and three classic vinyl records to get you spinning immediately."
                ),
                "price": 349.0,
                "color": "Walnut",
                "image": "https://images.unsplash.com/photo-1511379938547-c1f69419868d",
                "category": "Books & Media",
            },
            {
                "title": "OmniBrew Pour-Over Coffee Set",
                "description": (
                    "Glass carafe, stainless dripper, precision scale, and reusable "
                    "filters. Dialed in for third-wave coffee at home."
                ),
                "price": 74.25,
                "color": "Clear",
                "image": "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
                "category": "Home & Decor",
            },
            {
                "title": "Vortex Pro Drone",
                "description": (
                    "4K stabilized camera drone with 3-axis gimbal, obstacle avoidance, "
                    "and 40-minute flight time. Includes spare propellers."
                ),
                "price": 699.0,
                "color": "Stealth Grey",
                "image": "https://images.unsplash.com/photo-1508615143164-7127576c7a52",
                "category": "Electronics",
            },
            {
                "title": "Nebula Canvas Art Print",
                "description": (
                    "40x60 cm stretched canvas print inspired by the Orion Nebula. "
                    "Adds a bold pop of color to any creative workspace."
                ),
                "price": 120.0,
                "color": "Violet Burst",
                "image": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
                "category": "Home & Decor",
            },
            {
                "title": "Arcadia Urban Bike",
                "description": (
                    "Lightweight commuter bike with carbon fork, hydraulic brakes, "
                    "and integrated lights. Perfect for city rides."
                ),
                "price": 980.0,
                "color": "Slate",
                "image": "https://images.unsplash.com/photo-1485965120184-e220f721d03e",
                "category": "Sports & Outdoors",
            },
        ]

        created = 0
        for spec in listings:
            listing, was_created = Listing.objects.update_or_create(
                title=spec["title"],
                defaults={
                    "description": spec["description"],
                    "price": spec["price"],
                    "color": spec["color"],
                    "image": spec["image"],
                    "category": categories[spec["category"]],
                    "user": demo_user,
                },
            )
            if was_created:
                created += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Seeded {created} new listings (user: {demo_user.email})."
            )
        )

