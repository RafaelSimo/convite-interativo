import os
from reportlab.pdfgen import canvas

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def generate_interactive_pdf():
    pdf_filename = os.path.join(BASE_DIR, "Convite_Interativo_Alleane_e_Rafael.pdf")
    img_path = os.path.join(BASE_DIR, "assets", "img", "pdf_card_cover.jpg")
    
    # 2:3 Aspect ratio matching user image (450 x 675 pt)
    w, h = 450, 675
    c = canvas.Canvas(pdf_filename, pagesize=(w, h))
    c.setTitle("Convite de Casamento | Alleane & Rafael")
    c.setAuthor("Alleane & Rafael")
    c.setSubject("Convite Virtual Interativo")
    
    # 1. Draw High-Resolution User Cover Image across full page
    if os.path.exists(img_path):
        c.drawImage(img_path, 0, 0, width=w, height=h, preserveAspectRatio=False)
    
    # 2. Interactive Hyperlink Target URL
    target_url = "https://convite-interativo-beige.vercel.app/"
    
    # Central Logo Area Bounding Box (X: 100..350 pt, Y: 200..480 pt)
    c.linkURL(target_url, (100, 200, 350, 480), relative=1)
    
    # Full Page Hyperlink (tapping anywhere on the logo or page opens the convite)
    c.linkURL(target_url, (0, 0, w, h), relative=1)
    
    c.save()
    print("PDF Interativo gerado com sucesso com a imagem exata do usuário!")

if __name__ == "__main__":
    generate_interactive_pdf()
