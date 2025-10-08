#!/bin/bash

# Create placeholder logos for insurance carriers
# This will create simple text-based placeholder images using ImageMagick (if available)
# or create a fallback SVG placeholder

echo "Creating placeholder logos for insurance carriers..."

# Create carriers directory if it doesn't exist
mkdir -p public/images/carriers

# List of carriers
carriers=(
    "american-amicable:American Amicable"
    "americo:Americo"
    "corebridge:Corebridge"
    "fg:F&G"
    "foresters:Foresters"
    "lga:LGA"
    "mutual-of-omaha:Mutual of Omaha"
    "sbli:SBLI"
    "united-home-life:United Home Life"
    "transamerica:Transamerica"
    "american-equity:American Equity"
    "assurity:Assurity"
    "athene:Athene"
    "gerber:Gerber Life"
    "john-hancock:John Hancock"
    "lafayette-life:Lafayette Life"
    "liberty-bankers:Liberty Bankers"
    "mutual-trust-life:Mutual Trust Life"
    "national-life:National Life"
    "royal-neighbors:Royal Neighbors"
)

# Check if ImageMagick is available
if command -v convert &> /dev/null; then
    echo "Using ImageMagick to create placeholder logos..."
    for item in "${carriers[@]}"; do
        filename="${item%%:*}"
        company="${item##*:}"
        
        echo "Creating placeholder for $company..."
        convert -size 200x200 xc:white \
                -fill '#1f2937' \
                -font Arial \
                -pointsize 16 \
                -gravity center \
                -annotate +0+0 "$company" \
                -border 1 \
                -bordercolor '#e5e7eb' \
                "public/images/carriers/${filename}.png"
    done
else
    echo "ImageMagick not found. Creating SVG placeholders..."
    for item in "${carriers[@]}"; do
        filename="${item%%:*}"
        company="${item##*:}"
        
        echo "Creating SVG placeholder for $company..."
        cat > "public/images/carriers/${filename}.svg" << EOF
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="#f9fafb" stroke="#e5e7eb" stroke-width="2"/>
  <text x="100" y="100" font-family="Arial, sans-serif" font-size="14" 
        text-anchor="middle" dominant-baseline="middle" fill="#374151">
    ${company}
  </text>
</svg>
EOF
    done
fi

echo "Placeholder logos created!"
echo "Replace these with actual carrier logos when available."