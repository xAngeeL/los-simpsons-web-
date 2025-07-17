import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from PIL import Image
import os
from io import BytesIO

url = "https://simpsons.fandom.com/es/wiki/Tercera_temporada"
output_dir = "imagenes_tercera_temporada"
os.makedirs(output_dir, exist_ok=True)

headers = {
    "User-Agent": "Mozilla/5.0"
}

res = requests.get(url, headers=headers)
soup = BeautifulSoup(res.content, "html.parser")

imgs = soup.find_all("img")
contador = 0
descargadas = set()

for img in imgs:
    src = img.get("src")
    if not src:
        continue

    # Solo imágenes relevantes
    if (
        src.startswith("https") and
        "latest" in src and
        any(ext in src for ext in [".webp", ".jpg", ".jpeg", ".png"])
    ):
        img_url = urljoin(url, src.split("?")[0])

        if img_url in descargadas:
            continue
        descargadas.add(img_url)

        try:
            img_data = requests.get(img_url, headers=headers).content
            image = Image.open(BytesIO(img_data)).convert("RGB")
            filename = os.path.join(output_dir, f"{contador}.jpg")
            image.save(filename, "JPEG")
            contador += 1
        except Exception as e:
            print(f"Error con {img_url}: {e}")

print(f"{contador} imágenes descargadas en: {output_dir}")
