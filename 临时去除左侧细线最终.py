from PIL import Image, ImageDraw
import numpy as np

src = r"C:\Users\晶晶\Documents\ChatGPT\工作室官网设计\昭桥智能-原图局部加i-v1.png"
dst = r"C:\Users\晶晶\Documents\ChatGPT\工作室官网设计\昭桥智能-原图局部加i-v2-去掉边缘细线.png"
im = Image.open(src).convert("RGBA")
arr = np.array(im)
h, w = arr.shape[:2]

hair = np.array([[755,980],[800,950],[850,895],[900,840],[930,810]], dtype=float)
apath = [(1005,755),(975,790),(945,835),(920,895),(895,970),(875,1050),(860,1120)]

def catmull(anchors):
    pts=[]
    for i in range(len(anchors)-1):
        p0=anchors[max(0,i-1)]; p1=anchors[i]; p2=anchors[i+1]; p3=anchors[min(len(anchors)-1,i+2)]
        for j in range(31):
            t=j/30.0; t2=t*t; t3=t2*t
            q=0.5*((2*p1)+(-p0+p2)*t+(2*p0-5*p1+4*p2-p3)*t2+(-p0+3*p1-3*p2+p3)*t3)
            pts.append(q)
    return np.array(pts)

hairpts=catmull(hair)
Y,X=np.mgrid[0:h,0:w]
hairmask=np.zeros((h,w),dtype=np.uint8)
for x,y in hairpts:
    hairmask[((X-x)**2+(Y-y)**2)<=12.0**2]=255

protect=Image.new("L",(w,h),0)
d=ImageDraw.Draw(protect)
d.line([tuple(map(float,p)) for p in apath],fill=255,width=34,joint="curve")
protect_np=np.array(protect,dtype=np.uint8)
mask=np.where(protect_np>0,0,hairmask).astype(np.uint8)

filled=arr.copy()
ys,xs=np.where(mask>0)
for y,x in zip(ys,xs):
    sx=max(0,min(w-1,int(x-150)))
    sy=int(y)
    sample=arr[max(0,sy-2):min(h,sy+3),max(0,sx-2):min(w,sx+3),:3].reshape(-1,3)
    filled[y,x,:3]=np.median(sample,axis=0).astype(np.uint8)

out=arr.copy()
out[mask>0]=filled[mask>0]
Image.fromarray(out,"RGBA").save(dst)
print(dst)

