# -*- coding: utf-8 -*-
"""Copy and metadata for Phase 3 FAQ hub and guide articles."""

from seo_shared import FAQ_ITEMS

# Additional FAQs for the hub (homepage keeps FAQ_ITEMS in schema)
FAQ_HUB_EXTRA = [
    {
        "q": "How much does aircon cleaning cost in Lipa or Batangas?",
        "a": "Pricing depends on AC type, HP, condition, and location. Message CoolPro on Messenger with those details — we confirm a quote before your visit with no surprise charges for agreed work.",
    },
    {
        "q": "Why is my aircon leaking water indoors?",
        "a": "Common causes are a clogged drain line, dirty filters, or improper installation slope. We inspect the drain pan and line during cleaning or repair and clear blockages when needed.",
    },
    {
        "q": "Is chemical cleaning safe for inverter aircon?",
        "a": "Yes, when done correctly on the indoor coil and drain system. We use chemical cleaning only when general cleaning is not enough — not on every routine visit.",
    },
    {
        "q": "How long does a general aircon cleaning take?",
        "a": "Most single split-type home units take about 45–90 minutes depending on buildup and access. We confirm timing when you book.",
    },
    {
        "q": "Can you service aircon in condos and apartments?",
        "a": "Yes, for homes and small units in Lipa, Tanauan, Santo Tomas, and nearby Batangas towns. Tell us building rules or time windows when you book.",
    },
    {
        "q": "Do you relocate existing split-type aircon units?",
        "a": "Yes, we provide relocation labor — uninstall, move indoor/outdoor units, and reinstall with new routing when needed. The AC unit stays yours; we quote labor on-site.",
    },
    {
        "q": "What aircon brands do you work on?",
        "a": "We service common residential brands for split-type, window, and floor-standing units. Send your unit label photo on Messenger if you are unsure.",
    },
    {
        "q": "What should I prepare before the technician arrives?",
        "a": "Clear access to the indoor unit, outdoor unit, and electrical outlet. Have someone home to open the unit area. Pets secured in another room help the visit go faster.",
    },
    {
        "q": "Why does my aircon smell bad when turned on?",
        "a": "Odor often comes from mold or bacteria on the evaporator or drain pan. General cleaning may help; persistent smell may need chemical cleaning.",
    },
    {
        "q": "Can you top up freon without cleaning first?",
        "a": "Sometimes, but weak cooling can be caused by dirty coils or a leak. We check pressure and inspect for leaks first — topping up a leaking system is temporary.",
    },
]

FAQ_HUB_ALL = FAQ_ITEMS + FAQ_HUB_EXTRA

GUIDES_INDEX_FILE = "guides-aircon-batangas.html"
FAQ_HUB_FILE = "faq-aircon-lipa-batangas.html"

ARTICLES = [
    {
        "file": "general-vs-chemical-aircon-cleaning-batangas.html",
        "title": "General vs Chemical Aircon Cleaning | CoolPro Batangas",
        "h1": "General vs Chemical Aircon Cleaning",
        "meta": "When to choose general or chemical aircon cleaning in Batangas — explained for split-type and window units. CoolPro Lipa.",
        "image": "coolpro_job_3.jpg",
        "image_alt": "Window aircon chemical cleaning before and after — CoolPro Batangas",
        "service_link": ("ac-chemical-cleaning-lipa-batangas.html", "Aircon chemical cleaning"),
        "related": [
            ("split-type-aircon-cleaning-guide-batangas.html", "Split-type cleaning guide"),
            ("faq-aircon-lipa-batangas.html", "Full FAQ"),
        ],
        "sections": [
            (
                "What is general aircon cleaning?",
                "General cleaning is routine maintenance: filter wash, fin and coil surface cleaning, drain line check, and exterior wipe-down. "
                "For most homes in humid Batangas weather, every 3–6 months is a practical schedule for units used daily.",
            ),
            (
                "What is chemical aircon cleaning?",
                "Chemical cleaning is a deeper service. For split types, the indoor unit is dismantled so the evaporator coil and drain pan can be soaked and flushed. "
                "It is recommended when you still have weak cooling, mold smell, or visible slime after general cleaning.",
            ),
            (
                "Which one do I need?",
                "Choose general cleaning for regular upkeep. Choose chemical cleaning if odor returns quickly, water drips from the indoor unit, or cooling stays weak after a general service. "
                "CoolPro can advise on Messenger after you describe symptoms and send a photo of the unit.",
            ),
        ],
    },
    {
        "file": "aircon-not-cooling-troubleshooting-batangas.html",
        "title": "Aircon Not Cooling? Troubleshooting Guide | CoolPro",
        "h1": "Aircon Not Cooling — Troubleshooting Guide",
        "meta": "Common reasons your aircon is not cooling in Batangas — filters, refrigerant, compressor issues. When to call CoolPro Lipa.",
        "image": "coolpro_job_1.jpg",
        "image_alt": "CoolPro aircon repair and installation — Lipa Batangas",
        "service_link": ("ac-repair-lipa-batangas.html", "Aircon repair & troubleshooting"),
        "related": [
            ("when-to-refrigerant-top-up-aircon-batangas.html", "When to top up refrigerant"),
            ("general-vs-chemical-aircon-cleaning-batangas.html", "General vs chemical cleaning"),
        ],
        "sections": [
            (
                "Check the easy things first",
                "Confirm the remote is on cool mode, the set temperature is below room temperature, and filters are not thick with dust. "
                "A very dirty filter alone can make a unit feel like it is not cooling.",
            ),
            (
                "Unit runs but air is warm",
                "Possible causes include low refrigerant, a failing compressor, dirty coils, or a faulty sensor. "
                "Refrigerant issues need a pressure check — topping up without finding a leak wastes gas. CoolPro diagnoses on-site in Lipa and nearby towns.",
            ),
            (
                "Unit will not start at all",
                "This may be electrical — tripped breaker, faulty remote, PCB, or capacitor. Do not repeatedly reset breakers; note what happened and message us with the brand and model if visible.",
            ),
        ],
    },
    {
        "file": "split-type-aircon-cleaning-guide-batangas.html",
        "title": "Split-Type Aircon Cleaning Guide | CoolPro Lipa",
        "h1": "Split-Type Aircon Cleaning Guide for Homeowners",
        "meta": "How often to clean split-type aircon in the Philippines, what is included, and booking service in Lipa & Batangas.",
        "image": "coolpro_job_2.jpg",
        "image_alt": "CoolPro split-type general cleaning with catch bag — Lipa Batangas",
        "service_link": ("ac-general-cleaning-lipa-batangas.html", "Book general cleaning"),
        "related": [
            ("inverter-aircon-maintenance-philippines.html", "Inverter AC maintenance"),
            ("general-vs-chemical-aircon-cleaning-batangas.html", "General vs chemical cleaning"),
        ],
        "sections": [
            (
                "What we clean on a split-type visit",
                "A standard general service includes filter wash, coil and fin cleaning, drain line flushing or check, and wiping the indoor cabinet and outdoor fins where accessible. "
                "We use catch bags and covers to reduce mess in your room.",
            ),
            (
                "How often in Philippine humidity",
                "Bedrooms used nightly often need cleaning every 3–4 months. Units in kitchens or dusty areas may need it sooner. "
                "If you notice musty air when the AC starts, schedule earlier.",
            ),
            (
                "Booking in Lipa and nearby Batangas",
                "Message CoolPro on Messenger with brand, HP, last cleaning date, and your barangay. We serve Lipa City, Tanauan, Santo Tomas, Malvar, and other nearby towns.",
            ),
        ],
    },
    {
        "file": "inverter-aircon-maintenance-philippines.html",
        "title": "Inverter Aircon Maintenance Philippines | CoolPro",
        "h1": "Inverter Aircon Maintenance in the Philippines",
        "meta": "Maintenance tips for inverter split-type aircon in humid Batangas weather — cleaning, airflow, and when to call a technician.",
        "image": "coolpro_job_2.jpg",
        "image_alt": "Split-type aircon maintenance service — CoolPro Lipa",
        "service_link": ("ac-general-cleaning-lipa-batangas.html", "Schedule maintenance cleaning"),
        "related": [
            ("split-type-aircon-cleaning-guide-batangas.html", "Split-type cleaning guide"),
            ("aircon-not-cooling-troubleshooting-batangas.html", "Not cooling troubleshooting"),
        ],
        "sections": [
            (
                "Why inverter units need regular cleaning",
                "Inverter aircons run longer at variable speeds, so coils and filters collect dust steadily. "
                "Restricted airflow makes the compressor work harder and can increase electricity use.",
            ),
            (
                "What homeowners can do between visits",
                "Vacuum or rinse filters monthly if dusty. Keep outdoor units clear of plants and laundry. "
                "Avoid blocking the return air path with furniture or curtains.",
            ),
            (
                "When to call a professional",
                "Book general cleaning every few months, chemical service if odor or mold persists, and repair if you hear grinding noise, see error codes, or cooling drops suddenly.",
            ),
        ],
    },
    {
        "file": "when-to-refrigerant-top-up-aircon-batangas.html",
        "title": "When to Top Up Aircon Refrigerant | CoolPro Batangas",
        "h1": "When Does Your Aircon Need a Refrigerant Top-Up?",
        "meta": "Signs your aircon may need freon top-up in Batangas — weak cooling, leaks, R410A and R32. CoolPro Lipa service.",
        "image": "coolpro_job_4.jpg",
        "image_alt": "CoolPro outdoor aircon unit service — Batangas",
        "service_link": ("ac-refrigerant-top-up-lipa-batangas.html", "Refrigerant top-up service"),
        "related": [
            ("aircon-not-cooling-troubleshooting-batangas.html", "Not cooling guide"),
            ("faq-aircon-lipa-batangas.html", "FAQ"),
        ],
        "sections": [
            (
                "Signs refrigerant may be low",
                "The unit runs but cooling is weak, ice may form on the copper lines, or it takes longer to cool the room. "
                "These symptoms can also mean dirty coils — diagnosis on-site is important.",
            ),
            (
                "Leak check before top-up",
                "Refrigerant should stay in a sealed system. If gas is low, a leak is possible. "
                "CoolPro checks pressure and inspects common leak points before recharging when appropriate.",
            ),
            (
                "R410A and R32",
                "Modern units use R410A or R32 — the correct type depends on your unit label. "
                "Never mix types. Send a photo of the outdoor unit sticker on Messenger when booking.",
            ),
        ],
    },
]
