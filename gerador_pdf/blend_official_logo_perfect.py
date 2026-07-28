import os
from PIL import Image, ImageFilter, ImageEnhance, ImageDraw

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def swap_fake_logo_with_official_3d():
    ref_path = os.path.normpath(os.path.join(BASE_DIR, "../../Rafael-date/convite pdf.jpeg"))
    logo_path = os.path.join(BASE_DIR, "assets", "img", "logo.png")
    out_path = os.path.join(BASE_DIR, "assets", "img", "pdf_card_cover.jpg")
    
    if not os.path.exists(ref_path) or not os.path.exists(logo_path):
        print("Arquivos de referência não encontrados!")
        return

    bg = Image.open(ref_path).convert("RGBA")
    logo = Image.open(logo_path).convert("RGBA")
    
    W, H = bg.size # 1024 x 1536
    cx, cy = W // 2, 765
    
    # 1. Take a pure, 100% clean parchment texture patch from X=120..260, Y=450..490 (NO vertical lines or shadows!)
    pure_parchment = bg.crop((120, 450, 260, 490))
    
    # Resize pure parchment to cover the ENTIRE central region including the old tail shadow (760 x 680 px)
    cover_w, cover_h = 760, 680
    bg_fill = pure_parchment.resize((cover_w, cover_h), Image.Resampling.LANCZOS)
    bg_fill = bg_fill.filter(ImageFilter.GaussianBlur(radius=2))
    
    # Soft rounded rectangle mask to blend smoothly with surrounding parchment
    mask = Image.new("L", (cover_w, cover_h), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle((10, 10, cover_w - 10, cover_h - 10), radius=60, fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(radius=30))
    
    # Paste clean parchment over old fake logo & tail shadows completely
    bg.paste(bg_fill, (cx - cover_w // 2, cy - cover_h // 2 + 15), mask)
    
    # 2. Resize official logo.png to fit perfectly in center
    target_logo_size = 470
    logo_resized = logo.resize((target_logo_size, target_logo_size), Image.Resampling.LANCZOS)
    
    # 3. Create realistic 3D gold drop shadow underneath logo.png
    shadow_mask = logo_resized.split()[3]
    shadow = Image.new("RGBA", (target_logo_size, target_logo_size), (50, 35, 15, 120))
    shadow.putalpha(shadow_mask)
    shadow = shadow.filter(ImageFilter.GaussianBlur(radius=5))
    
    # Composite shadow slightly offset (3px right, 4px down)
    bg.paste(shadow, (cx - target_logo_size // 2 + 3, cy - target_logo_size // 2 + 4), shadow)
    
    # 4. Composite official logo.png
    bg.paste(logo_resized, (cx - target_logo_size // 2, cy - target_logo_size // 2), logo_resized)
    
    # Save final high-res image
    bg_rgb = bg.convert("RGB")
    bg_rgb.save(out_path, quality=98)
    print("Logo oficial colocada sobre fundo 100% limpo!")

if __name__ == "__main__":
    swap_fake_logo_with_official_3d()
