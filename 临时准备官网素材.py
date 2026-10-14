from PIL import Image
import numpy as np
from pathlib import Path
src=Path(r"C:\Users\晶晶\Documents\ChatGPT\工作室官网设计\昭桥智能-Logo-去左侧细线-v1.png")
out=Path(r"C:\Users\晶晶\Documents\ChatGPT\工作室官网设计\dist\assets")
out.mkdir(parents=True,exist_ok=True)
im=Image.open(src).convert("RGBA")
a=np.array(im)
rgb=a[:,:,:3]
# Remove near-white background while preserving pale logo strokes.
alpha=np.clip((255-rgb.min(axis=2))*5,0,255).astype(np.uint8)
alpha[(rgb.min(axis=2)>250)] = 0
rgba=np.dstack([rgb,alpha])
# symbol crop: the full mark above the wordmark
for name,box in {
    "zhaoqiao-mark.png":(180,220,980,730),
    "zhaoqiao-lockup.png":(180,220,980,1005),
}.items():
    crop=Image.fromarray(rgba).crop(box)
    crop.save(out/name)
print(out)

