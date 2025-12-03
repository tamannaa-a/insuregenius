import pytesseract
from PIL import Image

def run_ocr(path: str):
    try:
        img = Image.open(path)
        return pytesseract.image_to_string(img)
    except:
        return "OCR failed."
