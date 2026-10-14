from PIL import Image, ImageFilter
import numpy as np, math

src = r"C:\Users\晶晶\Documents\ChatGPT\工作室官网设计\昭桥智能-原图局部加i-v1.png"
dst = r"C:\Users\晶晶\Documents\ChatGPT\工作室官网设计\昭桥智能-原图局部加i-v2-去边缘细线.png"

im = Image.open(src).convert("RGBA")
arr = np.array(im)
h, w = arr.shape[:2]

# Centerline of the faint stray hairline visible to the left of A.
# Stop before it meets the thick A stroke, so the A stays intact.
anchors = np.array([
    [755.0, 980.0],
    [800.0, 950.0],
    [850.0, 895.0],
    [900.0, 840.0],
    [925.0, 815.0],
], dtype=float)

# Build a smooth polyline by Catmull-Rom interpolation.
pts=[]
for i in range(len(anchors)-1):
    p0 = anchors[max(0,i-1)]
    p1 = anchors[i]
    p2 = anchors[i+1]
    p3 = anchors[min(len(anchors)-1,i+2)]
    for j in range(31):
        t=j/30.0
        t2=t*t; t3=t2*t
        q=0.5*((2*p1)+(-p0+p2)*t+(2*p0-5*p1+4*p2-p3)*t2+(-p0+3*p1-3*p2+p3)*t3)
        pts.append(q)
pts=np.array(pts)

Y,X=np.mgrid[0:h,0:w]
mask=np.zeros((h,w),dtype=np.uint8)
radius=8.0
for x,y in pts:
    d2=(X-x)**2+(Y-y)**2
    mask[d2 <= radius*radius] = 255

# The path is very faint; use a clean background pixel on the same scanline
# from the left to reconstruct the warm-white field without painting a white band.
ys,xs=np.where(mask>0)
filled=arr.copy()
for y,x in zip(ys,xs):
    sx=max(0,min(w-1,int(x-150)))
    sy=max(0,min(h-1,int(y)))
    # average a small patch around the clean source pixel
    y0=max(0,sy-2); y1=min(h,sy+3)
    x0=max(0,sx-2); x1=min(w,sx+3)
    sample=arr[y0:y1,x0:x1,:3].reshape(-1,3)
    filled[y,x,:3]=np.median(sample,axis=0).astype(np.uint8)
    filled[y,x,3]=arr[y,x,3]

# Feather only the edge of the repair, keeping the center fully covered.
# Keep the core repair opaque so the hairline disappears completely; the
# warm-white source pixels already provide a natural-looking edge.
ma=(mask.astype(np.float32)/255.0)
out=(arr.astype(np.float32)*(1-ma[...,None]) + filled.astype(np.float32)*ma[...,None]).clip(0,255).astype(np.uint8)
Image.fromarray(out,"RGBA").save(dst)
print(dst)
