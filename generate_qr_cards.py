"""
Dramagic free QR generator.

Use this when you have a real CSV of students and want to create QR PNGs
without paying a QR website.

Input CSV columns:
  id,code,full_name,class_letter,parent_phone

Run:
  python generate_qr_cards.py students.csv assets/qr

If qrcode is not installed:
  pip install qrcode[pil]
"""

import csv
import sys
from pathlib import Path

try:
    import qrcode
except ImportError:
    print("Missing package. Install it with: pip install qrcode[pil]")
    raise


def main():
    csv_path = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("students.csv")
    out_dir = Path(sys.argv[2]) if len(sys.argv) > 2 else Path("assets/qr")
    out_dir.mkdir(parents=True, exist_ok=True)

    with csv_path.open(newline="", encoding="utf-8") as file:
        rows = list(csv.DictReader(file))

    for row in rows:
        code = row["code"].strip()
        if not code:
            continue

        qr = qrcode.QRCode(
            version=None,
            error_correction=qrcode.constants.ERROR_CORRECT_M,
            box_size=12,
            border=4,
        )
        qr.add_data(code)
        qr.make(fit=True)
        image = qr.make_image(fill_color="black", back_color="white").convert("RGB")
        image.save(out_dir / f"{code}.png")

    print(f"Generated {len(rows)} QR code(s) in {out_dir}")


if __name__ == "__main__":
    main()
