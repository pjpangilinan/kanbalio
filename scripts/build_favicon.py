from PIL import Image, ImageDraw, ImageFont
import os

OUT = "public/favicon.ico"
SIZES = [16, 32, 48, 64]
BG = (10, 15, 30, 255)
ACCENT = (0, 212, 255, 255)
DIM = (240, 244, 255, 255)

def load_font(size):
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationMono-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf",
        "/usr/share/fonts/TTF/DejaVuSansMono-Bold.ttf",
    ]
    for path in candidates:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()

def render(size):
    img = Image.new("RGBA", (size, size), BG)
    draw = ImageDraw.Draw(img)

    text = "[Pj]"
    font_size = max(6, int(size * 0.62))
    font = load_font(font_size)

    bbox = draw.textbbox((0, 0), text, font=font, anchor="lt")
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    x = (size - tw) // 2 - bbox[0]
    y = (size - th) // 2 - bbox[1]

    accent_w = int(tw * 0.18)
    draw.text((x, y), text[0], font=font, fill=ACCENT)
    draw.text((x + accent_w, y), text[1:], font=font, fill=DIM)
    return img

images = [render(s) for s in SIZES]
os.makedirs("public", exist_ok=True)
images[0].save(
    OUT,
    format="ICO",
    sizes=[(s, s) for s in SIZES],
    append_images=images[1:],
)
print(f"Wrote {OUT}")
