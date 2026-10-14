from PIL import Image, ImageDraw, ImageFont, ImageFilter
from pathlib import Path
import textwrap, math

work = Path(r'C:\Users\晶晶\Documents\ChatGPT\工作室官网设计')
hero_path = work / 'zhaoqiao-visual-hero-v1.png'
out_path = work / '昭桥智能-品牌应用视觉概念板-v1.png'
W,H = 1800,1200
bg = '#F5F6FB'; ink='#1B1830'; muted='#6B6C7D'; violet='#6B5CFF'; coral='#FF6B7A'; aqua='#63E6D3'; lilac='#DCD8FF'; cream='#FFF8F1'; navy='#242444'
img = Image.new('RGB',(W,H),bg)
d = ImageDraw.Draw(img)
font_path = r'C:\Windows\Fonts\NotoSansSC-VF.ttf'
def F(size, bold=False):
    return ImageFont.truetype(font_path,size)
def rr(box,r,fill,outline=None,w=1):
    d.rounded_rectangle(box,radius=r,fill=fill,outline=outline,width=w)
def txt(xy,s,size,fill=ink,anchor='la',spacing=4):
    d.multiline_text(xy,s,font=F(size),fill=fill,anchor=anchor,spacing=spacing)
def fit_crop(im, size):
    ratio=max(size[0]/im.width,size[1]/im.height)
    z=im.resize((int(im.width*ratio),int(im.height*ratio)),Image.Resampling.LANCZOS)
    left=(z.width-size[0])//2; top=(z.height-size[1])//2
    return z.crop((left,top,left+size[0],top+size[1]))

def panel(x,y,w,h,fill='#FFFFFF'):
    rr((x,y,x+w,y+h),28,fill)
    d.rounded_rectangle((x,y,x+w,y+h),28,outline='#E5E6EF',width=2)

# Header
rr((58,42,W-58,128),26,'#FFFFFF')
d.line((92,85,136,85),fill=violet,width=8)
d.line((112,85,112,58),fill=coral,width=8)
txt((155,83),'昭桥智能',33,ink,anchor='lm')
txt((365,83),'ZHAOQIAO',21,muted,anchor='lm')
txt((W-95,83),'让 AI 走进现实',23,violet,anchor='rm')
# small system note
text_note='连接现实与 AI｜科技连接现实，年轻而有温度，专业且让人安心'
txt((72,163),text_note,18,muted)

# grid constants
x1,y1=58,205; gap=30; pw=(W-116-gap)//2; ph=450
x2=x1+pw+gap; y2=y1+ph+gap

# A video cover hero
panel(x1,y1,pw,ph,'#E9E8FF')
hero=Image.open(hero_path).convert('RGB')
hero=fit_crop(hero,(pw,ph))
# overlay light veil on left for copy
veil=Image.new('RGBA',(pw,ph),(255,255,255,0)); vd=ImageDraw.Draw(veil)
vd.rectangle((0,0,int(pw*0.56),ph),fill=(245,245,255,190))
hero=Image.alpha_composite(hero.convert('RGBA'),veil).convert('RGB')
img.paste(hero,(x1,y1))
d=ImageDraw.Draw(img)
rr((x1+24,y1+24,x1+160,y1+58),16,coral)
txt((x1+92,y1+41),'AI下现场',17,'#FFFFFF',anchor='mm')
txt((x1+38,y1+130),'让 AI\n走进现实',45,ink)
txt((x1+40,y1+266),'昭桥智能｜真实业务现场\n把问题讲清楚，把动作做出来',18,ink,spacing=8)
# play marker
rr((x1+40,y1+382,x1+115,y1+420),18,ink)
txt((x1+77,y1+401),'▶  01',15,'#FFFFFF',anchor='mm')
txt((x1+pw-30,y1+ph-24),'VIDEO COVER / 16:9',13,muted,anchor='ra')

# B proposal cover
panel(x2,y1,pw,ph,navy)
d=ImageDraw.Draw(img)
# structural bridge lines
for off,col in [(0,aqua),(14,violet),(28,coral)]:
    pts=[(x2+pw-420,y1+ph-75-off),(x2+pw-300,y1+ph-140-off),(x2+pw-180,y1+ph-85-off),(x2+pw-65,y1+ph-170-off)]
    d.line(pts,fill=col,width=5,joint='curve')
# interface modules
rr((x2+pw-410,y1+80,x2+pw-250,y1+182),18,'#3C3A6A',outline='#8179FF',w=2)
rr((x2+pw-215,y1+115,x2+pw-78,y1+244),18,'#303052',outline='#66E6D4',w=2)
d.ellipse((x2+pw-190,y1+151,x2+pw-164,y1+177),fill=coral)
txt((x2+44,y1+62),'企业 AI 方案',18,aqua)
txt((x2+44,y1+120),'连接现实\n与 AI',49,'#FFFFFF')
txt((x2+46,y1+286),'从认知培训到岗位落地\n建立可复用的 AI 工作方式',18,'#D9D8EA',spacing=8)
rr((x2+46,y1+380,x2+190,y1+420),20,violet)
txt((x2+118,y1+400),'方案封面',15,'#FFFFFF',anchor='mm')
txt((x2+pw-30,y1+ph-24),'PROPOSAL / A4',13,'#B8B8D0',anchor='ra')

# C course poster
panel(x1,y2,pw,ph,cream)
d=ImageDraw.Draw(img)
# side rail
rr((x1+28,y2+28,x1+52,y2+ph-28),12,violet)
for i,c in enumerate([violet,coral,aqua]):
    rr((x1+78+i*75,y2+42,x1+130+i*75,y2+94),16,c)
txt((x1+78,y2+145),'AI 岗位实战课',22,coral)
txt((x1+78,y2+188),'把一个工作\n场景做成',42,ink)
txt((x1+80,y2+305),'从问题拆解 → 现场演练 → 交付模板\n昭桥智能｜让 AI 走进现实',18,muted,spacing=8)
# mini process strip
for i,(label,c) in enumerate([('看懂',violet),('会用',aqua),('落地',coral)]):
    xx=x1+80+i*150
    rr((xx,y2+382,xx+116,y2+420),19,c)
    txt((xx+58,y2+401),label,15,'#FFFFFF',anchor='mm')
txt((x1+pw-28,y2+ph-24),'COURSE POSTER / 3:4',13,muted,anchor='ra')

# D social card
panel(x2,y2,pw,ph,'#FFFFFF')
d=ImageDraw.Draw(img)
# split layout left text right modules
rr((x2+30,y2+30,x2+pw-30,y2+ph-30),22,'#F4F2FF')
# little label
rr((x2+58,y2+63,x2+190,y2+96),16,ink)
txt((x2+124,y2+79),'GEO · AI 可见度',14,'#FFFFFF',anchor='mm')
txt((x2+58,y2+145),'企业如何\n被 AI 看见？',38,ink)
txt((x2+60,y2+280),'把品牌、产品和知识\n整理成 AI 能理解的内容。',18,muted,spacing=8)
# connected nodes
base_x=x2+pw-286; base_y=y2+102
for i,(dx,dy,c) in enumerate([(0,0,violet),(80,42,coral),(24,124,aqua),(120,158,ink)]):
    rr((base_x+dx,base_y+dy,base_x+dx+92,base_y+dy+70),20,c)
# links
for a,b in [((base_x+92,base_y+34),(base_x+80,base_y+42)),((base_x+44,base_y+70),(base_x+24+45,base_y+124)),((base_x+80+46,base_y+42+70),(base_x+120+46,base_y+158))]:
    d.line((a[0],a[1],b[0],b[1]),fill=ink,width=5)
rr((x2+58,y2+384,x2+206,y2+420),18,coral)
txt((x2+132,y2+402),'查看方法',15,'#FFFFFF',anchor='mm')
txt((x2+pw-28,y2+ph-24),'SOCIAL CARD / 3:4',13,muted,anchor='ra')

# Footer legend
footer_y=1130
d.line((58,footer_y-22,W-58,footer_y-22),fill='#DFE0EA',width=2)
txt((58,footer_y),'视觉关键词',16,muted)
keys=[('模块化连接',violet),('温和科技',aqua),('行动重点',coral),('安全底色',navy)]
xx=210
for label,c in keys:
    rr((xx,footer_y-14,xx+22,footer_y+8),8,c)
    txt((xx+34,footer_y-3),label,15,ink,anchor='lm')
    xx+=165

a=img.resize((1800,1200),Image.Resampling.LANCZOS)
a.save(out_path,quality=95)
print(out_path)
