import os
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance, ImageDraw

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def process_homogeneous_background():
    ref_path = os.path.normpath(os.path.join(BASE_DIR, "../../Rafael-date/convite pdf.jpeg"))
    logo_path = os.path.join(BASE_DIR, "assets", "img", "logo.png")
    out_path = os.path.join(BASE_DIR, "assets", "img", "pdf_card_cover.jpg")
    
    if not os.path.exists(ref_path) or not os.path.exists(logo_path):
        print("Arquivos de referência não encontrados!")
        return

    bg = Image.open(ref_path).convert("RGB")
    logo = Image.open(logo_path).convert("RGBA")
    
    W, H = bg.size # 1024 x 1536
    cx, cy = W // 2, 765
    
    # 1. Take a 100% PURE parchment patch from X=460..560, Y=468..492 (PURE BLANK PARCHMENT BELOW HEART!)
    pure_patch = bg.crop((460, 468, 560, 492))
    
    # Expand patch to cover central logo region (740 x 580 px)
    cover_w, cover_h = 740, 580
    bg_fill = pure_patch.resize((cover_w, cover_h), Image.Resampling.LANCZOS)
    bg_fill = bg_fill.filter(ImageFilter.GaussianBlur(radius=1.5))
    
    # Feathered ellipse mask for smooth seamless blending
    mask = Image.new("L", (cover_w, cover_h), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((20, 20, cover_w - 20, cover_h - 20), fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(radius=35))
    
    # Paste pure blank parchment patch over central logo & slit area
    bg.paste(bg_fill, (cx - cover_w // 2, cy - cover_h // 2 + 10), mask)
    
    # Convert bg back to RGBA
    bg_rgba = bg.convert("RGBA")
    
    # 2. Resize official logo.png to match exact size & proportions of fake logo (430 x 430 px)
    logo_size = 430
    logo_resized = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
    
    # 3. Create realistic 3D Gold Drop Shadow
    shadow_mask = logo_resized.split()[3]
    shadow = Image.new("RGBA", (logo_size, logo_size), (45, 30, 12, 130))
    shadow.putalpha(shadow_mask)
    shadow = shadow.filter(ImageFilter.GaussianBlur(radius=4.5))
    
    # Composite 3D shadow (shifted 3px right, 4px down)
    bg_rgba.paste(shadow, (cx - logo_size // 2 + 3, cy - logo_size // 2 + 4), shadow)
    
    # 4. Composite official logo.png
    bg_rgba.paste(logo_resized, (cx - logo_size // 2, cy - logo_size // 2), logo_resized)
    
    # Save final high-res JPEG
    final_rgb = bg_rgba.convert("RGB")
    final_rgb.save(out_path, quality=98)
    print("Fundo 100% limpo e homogêneo com a logo oficial aplicada!")

if __name__ == "__main__":
    process_homogeneous_background()
