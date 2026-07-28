import os
from PIL import Image, ImageFilter, ImageEnhance

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def place_official_logo_on_card():
    card_path = os.path.join(BASE_DIR, "assets", "img", "pdf_card_cover.jpg")
    logo_path = os.path.join(BASE_DIR, "assets", "img", "logo.png")
    
    if not os.path.exists(card_path) or not os.path.exists(logo_path):
        print("Arquivo não encontrado!")
        return
        
    card = Image.open(card_path).convert("RGBA")
    logo = Image.open(logo_path).convert("RGBA")
    
    W, H = card.size
    cx, cy = W // 2, 620
    
    # 1. Clean the center area of the wreath using surrounding suede texture
    # Sample a patch of emerald suede texture from nearby (e.g., X=250, Y=620)
    texture_patch = card.crop((230, 560, 310, 680))
    # Blur slightly to create a smooth base fill
    smooth_patch = texture_patch.filter(ImageFilter.GaussianBlur(radius=8))
    
    # Paste smooth patch over the generic AR center with soft circular gradient/ellipse
    mask_patch = Image.new("L", (260, 260), 0)
    from PIL import ImageDraw
    draw = ImageDraw.Draw(mask_patch)
    draw.ellipse((20, 20, 240, 240), fill=255)
    mask_patch = mask_patch.filter(ImageFilter.GaussianBlur(radius=15))
    
    # Create background fill image
    bg_fill = smooth_patch.resize((260, 260))
    card.paste(bg_fill, (cx - 130, cy - 130), mask_patch)
    
    # 2. Resize official logo.png to fit perfectly inside the gold wreath
    logo_size = 250
    logo_resized = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
    
    # Enhance logo gold brightness & contrast slightly to pop on emerald suede
    enhancer = ImageEnhance.Contrast(logo_resized)
    logo_enhanced = enhancer.enhance(1.15)
    
    # 3. Paste official logo onto the card
    card.paste(logo_enhanced, (cx - logo_size // 2, cy - logo_size // 2), logo_enhanced)
    
    # Save back as RGB JPEG
    final_card = card.convert("RGB")
    final_card.save(card_path, quality=95)
    print("Logo oficial colocado no cartão com sucesso!")

if __name__ == "__main__":
    place_official_logo_on_card()
