from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size):
    # Create image with transparent background
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Draw gradient circle background
    center = size // 2
    radius = int(size * 0.9) // 2
    
    # Create gradient effect by drawing multiple circles
    for i in range(radius, 0, -1):
        # Calculate color gradient from purple to darker purple
        ratio = i / radius
        r = int(102 + (118 - 102) * (1 - ratio))
        g = int(126 + (75 - 126) * (1 - ratio))
        b = int(234 + (162 - 234) * (1 - ratio))
        color = (r, g, b, 255)
        draw.ellipse(
            [center - i, center - i, center + i, center + i],
            fill=color
        )
    
    # Draw dollar sign
    try:
        font_size = int(size * 0.55)
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
    except:
        font = ImageFont.load_default()
    
    # Draw dollar sign
    text = "$"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    text_x = (size - text_width) // 2
    text_y = (size - text_height) // 2 - int(size * 0.05)
    
    draw.text((text_x, text_y), text, fill=(255, 255, 255, 255), font=font)
    
    return img

# Generate icons
for size, filename in [(16, 'icon16.png'), (48, 'icon48.png'), (128, 'icon128.png')]:
    icon = create_icon(size)
    icon.save(f'/home/claude/crypto-portfolio-tracker/assets/{filename}')
    print(f'Created {filename}')

print('All icons created successfully!')
