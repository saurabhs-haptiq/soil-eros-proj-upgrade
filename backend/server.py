from flask import Flask, request, jsonify, send_file, send_from_directory
from flask_cors import CORS
from PIL import Image
import numpy as np
import matplotlib.pyplot as plt
from fpdf import FPDF
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend-backend communication

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
    plt.imshow(diff, cmap="hot", interpolation="nearest")
    plt.colorbar(label="Difference Magnitude")
    plt.savefig(diff_file)
    plt.close()

    # Save the comparison plot
    comparison_plot_file = "comparison_plot.png"
    plt.figure(figsize=(15, 5))

    # Display Image 1 in RGB mode (keeping original colors)
    image1_rgb = Image.open(image1_path)  # Reopen the image in its original color mode
    plt.subplot(1, 3, 1)
    plt.imshow(image1_rgb)  # Display image 1 in RGB
    plt.title("Image 1")
    plt.axis('off')

    # Display Image 2 in RGB mode (keeping original colors)
    image2_rgb = Image.open(image2_path)  # Reopen the image in its original color mode
    plt.subplot(1, 3, 2)
    plt.imshow(image2_rgb)  # Display image 2 in RGB
    plt.title("Image 2")
    plt.axis('off')

    # Display Difference (using the 'hot' colormap for visualizing pixel difference)
    plt.subplot(1, 3, 3)
    plt.imshow(diff, cmap="hot")  # Keeping the 'hot' colormap to highlight differences
    plt.title("Difference")
    plt.axis('off')

    # Save the comparison plot
    plt.savefig(comparison_plot_file)
    plt.close()

    total_pixels = diff.size
    significant_pixels = np.sum(significant_change)
    percent_change = (significant_pixels / total_pixels) * 100

    return {
        "diff_file": diff_file,
        "comparison_plot_file": comparison_plot_file,  # Return the comparison plot filename
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
    pdf.cell(200, 10, txt=f"Soil Erosion Percentage: {result['percent_change']:.2f}%", ln=True)
    pdf.ln(10)

    pdf.image(result["diff_file"], x=10, y=None, w=180)
    pdf.ln(10)

    pdf.output(output_pdf)
    return output_pdf

# API endpoint to compare images
@app.route("/compare", methods=["POST"])
def compare():
    if "image1" not in request.files or "image2" not in request.files:
        return jsonify({"error": "Please upload both images"}), 400

    image1 = request.files["image1"]
    image2 = request.files["image2"]

    image1_path = "temp_image1.png"
    image2_path = "temp_image2.png"

    image1.save(image1_path)
    image2.save(image2_path)

    result = compare_images(image1_path, image2_path)
    pdf_file = generate_report(result)

    os.remove(image1_path)
    os.remove(image2_path)
    os.remove(result["diff_file"])

    return send_file(pdf_file, as_attachment=True)

@app.route("/comparison-plot")
def get_comparison_plot():
    # Serve the comparison plot image
    return send_from_directory(os.getcwd(), "comparison_plot.png")

if __name__ == "__main__":
    app.run(debug=True)
