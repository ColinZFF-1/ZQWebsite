from PIL import Image
import numpy as np
im=np.array(Image.open(r"C:\Users\晶晶\Documents\ChatGPT\工作室官网设计\昭桥智能-原图局部加i-v1.png").convert("RGB"))
# crop coords abs, inspect faint non-white pixels in left A region
for y in range(760,1001,10):
    row=im[y,680:980,:].astype(int)
    # background near-white; line has lower channel/colour; threshold broad
    score=255-row.mean(axis=1)
    xs=np.where(score>2.0)[0]+680
    # show runs before x930, avoiding large trajectory/arch where possible
    xs=xs[xs<930]
    if len(xs):
        # group into runs
        runs=[]; s=pr=xs[0]
        for x in xs[1:]:
            if x>pr+1:
                runs.append((s,pr));s=x
            pr=x
        runs.append((s,pr))
        print(y,runs[:8])

