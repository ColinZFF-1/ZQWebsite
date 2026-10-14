import tarfile
from pathlib import Path
root=Path(r"C:\Users\晶晶\Documents\ChatGPT\工作室官网设计")
archive=root/"zhaoqiao-site.tar.gz"
with tarfile.open(archive,"w:gz") as tf:
    tf.add(root/".openai/hosting.json",arcname=".openai/hosting.json")
    tf.add(root/"dist",arcname="dist")
print(archive)

