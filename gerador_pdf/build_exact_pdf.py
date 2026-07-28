import os
from PIL import Image, ImageFilter, ImageEnhance, ImageDraw

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def blend_official_logo_onto_reference():
    ref_path = os.path.normpath(os.path.join(BASE_DIR, "../../Rafael-date/convite pdf.jpeg"))
    logo_path = os.path.join(BASE_DIR, "assets", "img", "logo.png")
    out_path = os.path.join(BASE_DIR, "assets", "img", "pdf_card_cover.jpg")
    
    if not os.path.exists(ref_path) or not os.path.exists(logo_path):
        print("Arquivos de referência não encontrados!")
        return

    bg = Image.open(ref_path).convert("RGBA")
    logo = Image.open(logo_path).convert("RGBA")
    
    W, H = bg.size # 1024 x 1536
    cx, cy = W // 2, 770
    
    # 1. Take a pristine, shadow-free parchment texture patch from X=200..824, Y=465..505
    pristine_strip = bg.crop((200, 465, 824, 505))
    
    # Resize pristine strip to cover the central logo region (650 x 500 px)
    cover_w, cover_h = 650, 500
    clean_bg_patch = pristine_strip.resize((cover_w, cover_h), Image.Resampling.LANCZOS)
    
    # Apply a subtle texture blur so it blends seamlessly
    clean_bg_patch = clean_bg_patch.filter(ImageFilter.GaussianBlur(radius=2))
    
    # Mask with soft feathering along the edges to blend into original parchment
    mask = Image.new("L", (cover_w, cover_h), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((30, 30, cover_w - 30, cover_h - 30), fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(radius=25))
    
    # Paste clean pristine texture to erase old logo & shadows 100%
    bg.paste(clean_bg_patch, (cx - cover_w // 2, cy - cover_h // 2), mask)
    
    # 2. Resize official logo.png to fit perfectly in center
    target_logo_size = 460
    logo_resized = logo.resize((target_logo_size, target_logo_size), Image.Resampling.LANCZOS)
    
    # Match gold contrast
    logo_enhanced = ImageEnhance.Contrast(logo_resized).enhance(1.05)
    
    # 3. Composite official logo onto center of pristine parchment
    bg.paste(logo_enhanced, (cx - target_logo_size // 2, cy - target_logo_size // 2), logo_enhanced)
    
    # Save final high-res background image as JPEG
    bg_rgb = bg.convert("RGB")
    bg_rgb.save(out_path, quality=98)
    print("Nova arte base do PDF limpa e gerada com sucesso!")

if __name__ == "__main__":
    blend_official_logo_onto_reference()
