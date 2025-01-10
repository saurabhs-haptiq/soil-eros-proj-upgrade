import os
from flask import Flask, request, jsonify, send_file, send_from_directory
from flask_cors import CORS
from PIL import Image
import numpy as np
import matplotlib.pyplot as plt
from fpdf import FPDF

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend-backend communication

# Path to your images directory
IMAGE_DIR = 'images'


from matplotlib.colors import LinearSegmentedColormap
# Function to compare two images
def compare_images(image1_path, image2_path):
    image1 = Image.open(image1_path).convert("L")
    image2 = Image.open(image2_path).convert("L")

    if image1.size != image2.size:
        image2 = image2.resize(image1.size)

    array1 = np.array(image1)
    array2 = np.array(image2)

    diff = np.abs(array1 - array2)
    threshold = 50
    significant_change = diff > threshold

    diff_file = "difference.png"
    plt.figure(figsize=(10, 6))
    plt.title("Differences Between Images")
    green_colormap = LinearSegmentedColormap.from_list("green_only", [(0, "white"), (1, "red")])
    plt.imshow(diff, cmap=green_colormap, interpolation="nearest")
    plt.colorbar(label="Difference Magnitude")
    plt.savefig(diff_file)
    plt.close()

    comparison_plot_file = "comparison_plot.png"
    plt.figure(figsize=(15, 5))
    

    # Display Image 1
    image1_rgb = Image.open(image1_path)
    plt.subplot(1, 3, 1)
    plt.imshow(image1_rgb)
    plt.title("Image 1")
    plt.axis('off')

    # Display Image 2
    image2_rgb = Image.open(image2_path)
    plt.subplot(1, 3, 2)
    plt.imshow(image2_rgb)
    plt.title("Image 2")
    plt.axis('off')

    # Display Difference
    plt.subplot(1, 3, 3)
    plt.imshow(diff, cmap=green_colormap, interpolation="nearest")
    plt.title("Difference")
    plt.axis('off')

    plt.savefig(comparison_plot_file)
    plt.close()

    total_pixels = diff.size
    significant_pixels = np.sum(significant_change)
    percent_change = (significant_pixels / total_pixels) * 100

    return {
        "diff_file": diff_file,
        "comparison_plot_file": comparison_plot_file,
        "total_pixels": total_pixels,
        "significant_pixels": significant_pixels,
        "percent_change": percent_change,
    }

# Function to generate a PDF report
def generate_report(result, output_pdf="image_comparison_report.pdf"):
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    pdf.set_font("Arial", size=12)

    pdf.set_font("Arial", style="B", size=16)
    pdf.cell(200, 10, txt="Image Comparison Report", ln=True, align="C")
    pdf.ln(10)

    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt="Comparison Results:", ln=True)
    pdf.cell(200, 10, txt=f"Total Pixels: {result['total_pixels']}", ln=True)
    pdf.cell(200, 10, txt=f"Significant Change Pixels: {result['significant_pixels']}", ln=True)
    pdf.cell(200, 10, txt=f"Vegetation Loss Percentage: {result['percent_change']:.2f}%", ln=True)
    pdf.ln(10)

    pdf.image(result["diff_file"], x=10, y=None, w=180)
    pdf.ln(10)

    pdf.output(output_pdf)
    return output_pdf

# API endpoint to compare images
@app.route("/compare", methods=["POST"])
def compare():
    if "image1" not in request.form or "image2" not in request.form:
        return jsonify({"error": "Please provide both image names."}), 400

    image1_name = request.form["image1"]
    image2_name = request.form["image2"]

    # Paths to the selected images
    image1_path = os.path.join(IMAGE_DIR, image1_name)
    image2_path = os.path.join(IMAGE_DIR, image2_name)

    if not os.path.exists(image1_path) or not os.path.exists(image2_path):
        return jsonify({"error": f"One or both of the images '{image1_name}' and '{image2_name}' do not exist in the 'images' folder."}), 400

    # Proceed with comparison
    result = compare_images(image1_path, image2_path)
    pdf_file = generate_report(result)

    # Clean up temporary files
    os.remove(result["diff_file"])
    # os.remove(result["comparison_plot_file"])

    return send_file(pdf_file, as_attachment=True)

import time

@app.route("/comparison-plot")
def get_comparison_plot():
    file_path = os.path.join(os.getcwd(), "comparison_plot.png")
    if not os.path.exists(file_path):
        return jsonify({"error": "Comparison plot file not found."}), 404

    # Add a cache-busting mechanism
    response = send_from_directory(os.getcwd(), "comparison_plot.png")
    
    # Set cache control to prevent caching
    response.cache_control.no_cache = True
    response.cache_control.no_store = True
    response.cache_control.must_revalidate = True
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    
    return response



if __name__ == "__main__":
    app.run(debug=True)
