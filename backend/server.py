from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
from PIL import Image
import io
import torch
from realesrgan import RealESRGANer

app = Flask(__name__)
CORS(app)

device = torch.device('cpu')
model = RealESRGANer(
    scale=4,
    model_path='https://github.com/xinntao/Real-ESRGAN/releases/download/v0.1.0/RealESRGAN_x4plus.pth',
    device=device
)

@app.route('/enhance', methods=['POST'])
def enhance():
    data = request.json
    img_data = base64.b64decode(data['image'].split(',')[1])
    img = Image.open(io.BytesIO(img_data))
    output, _ = model.enhance(img, outscale=4)
    buffered = io.BytesIO()
    output.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    return jsonify({'enhanced': f'data:image/png;base64,{img_str}'})

if __name__ == '__main__':
    app.run(port=5000)
