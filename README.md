# Convite de Casamento Interativo — Alleane & Rafael

Este repositório foi organizado em pastas específicas para cada funcionalidade:

---

## 📂 Estrutura do Projeto

### 1. `convite_digital/` (Aplicação Web / Convite Virtual Interativo)
Contém toda a experiência interativa em HTML/CSS/JS com animações 3D, música de fundo, envelope de camurça, partículas e RSVP.

- **`index.html`**: Estrutura e marcação da página web.
- **`styles.css`**: Estilização, animações, tema escuro/dourado e design 3D.
- **`script.js`**: Lógica de interatividade, áudio, partículas, selo 3D e contagem regressiva.
- **`assets/`**: Imagens (`img/`), áudios (`audio/`) e arquivos visuais da aplicação web.

---

## 2. `gerador_pdf/` (Módulo Gerador de PDF Interativo)
Contém os scripts Python de automação, imagens base e o arquivo PDF final interativo pronto para envio via WhatsApp / E-mail.

- **`Convite_Interativo_Alleane_e_Rafael.pdf`**: PDF interativo final com link clicável.
- **`convite_pdf_preview.png`**: Imagem de pré-visualização do PDF.
- **`create_pdf.py`**: Script Python principal que gera o PDF final utilizando ReportLab.
- **`build_exact_pdf.py` / `blend_official_logo_perfect.py`**: Scripts de tratamento de imagem e inclusão do monograma oficial na capa do PDF.
- **`assets/img/`**: Recursos visuais específicos para a capa e composição do PDF (`pdf_card_cover.jpg`, `logo.png`).

---

## 🚀 Como Executar

### Convite Digital (Web):
Abra o arquivo `convite_digital/index.html` em qualquer navegador web ou suba a pasta no Vercel / GitHub Pages.

### Gerador de PDF:
1. Navegue até a pasta `gerador_pdf/`:
   ```bash
   cd gerador_pdf
   ```
2. Execute o script Python:
   ```bash
   python create_pdf.py
   ```
