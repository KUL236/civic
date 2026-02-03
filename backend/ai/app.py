from flask import Flask,request,jsonify # pyright: ignore[reportMissingImports]
from PIL import Image # pyright: ignore[reportMissingImports]
import torch, torchvision.transforms as T # pyright: ignore[reportMissingImports]
from torchvision.models import resnet18 # pyright: ignore[reportMissingImports]

app=Flask(__name__)
model=resnet18(pretrained=True)
model.eval()
labels=["Garbage","Water","Road","Streetlight"]

@app.route("/detect",methods=["POST"])
def detect():
    img = Image.open(request.files["image"])
    x = T.ToTensor()(img).unsqueeze(0)
    y = model(x).argmax().item()
    return jsonify({"label":labels[y%4]})

app.run(port=6000)