#!/bin/bash

# Script to download insurance carrier logos
# Make sure to run this from the project root directory

echo "Creating carriers logo directory..."
mkdir -p public/images/carriers

echo "Downloading carrier logos..."

# American Amicable
curl -o public/images/carriers/american-amicable.png "https://www.american-amicable.com/sites/default/files/AA-Logo-Horizontal.png"

# Americo
curl -o public/images/carriers/americo.png "https://www.americo.com/themes/custom/americo/logo.png"

# Corebridge Financial
curl -o public/images/carriers/corebridge.png "https://www.corebridge.com/content/dam/onesite/corebridge/logos/corebridge-logo.png"

# F&G
curl -o public/images/carriers/fg.png "https://www.fglife.com/wps/wcm/connect/fglife/7e9f9c5d-8f5c-4f7e-9c5d-8f5c4f7e9c5d/FG-Logo.png"

# Foresters
curl -o public/images/carriers/foresters.png "https://www.foresters.com/themes/custom/foresters/images/foresters-logo.png"

# LGA by Banner Life
curl -o public/images/carriers/lga.png "https://www.lgamerica.com/wps/wcm/connect/lgamerica/images/lga-logo.png"

# Mutual of Omaha
curl -o public/images/carriers/mutual-of-omaha.png "https://www.mutualofomaha.com/sites/default/files/mutual-of-omaha-logo.png"

# SBLI
curl -o public/images/carriers/sbli.png "https://www.sbli.com/images/sbli-logo.png"

# United Home Life
curl -o public/images/carriers/united-home-life.png "https://www.unitedhomelife.com/images/uhl-logo.png"

# Transamerica
curl -o public/images/carriers/transamerica.png "https://www.transamerica.com/images/transamerica-logo.png"

# American Equity
curl -o public/images/carriers/american-equity.png "https://www.american-equity.com/images/american-equity-logo.png"

# Assurity
curl -o public/images/carriers/assurity.png "https://www.assurity.com/images/assurity-logo.png"

# Athene
curl -o public/images/carriers/athene.png "https://www.athene.com/images/athene-logo.png"

# Gerber Life
curl -o public/images/carriers/gerber.png "https://www.gerberlife.com/images/gerber-life-logo.png"

# John Hancock
curl -o public/images/carriers/john-hancock.png "https://www.johnhancock.com/images/john-hancock-logo.png"

# Lafayette Life
curl -o public/images/carriers/lafayette-life.png "https://www.lafayettelife.com/images/lafayette-life-logo.png"

# Liberty Bankers
curl -o public/images/carriers/liberty-bankers.png "https://www.libertybankers.com/images/liberty-bankers-logo.png"

# Mutual Trust Life
curl -o public/images/carriers/mutual-trust-life.png "https://www.mutualtrustlife.com/images/mutual-trust-logo.png"

# National Life Group
curl -o public/images/carriers/national-life.png "https://www.nationallife.com/images/national-life-logo.png"

# Royal Neighbors
curl -o public/images/carriers/royal-neighbors.png "https://www.royalneighbors.org/images/royal-neighbors-logo.png"

echo "Logo download complete!"
echo "Note: Some URLs may not work. You'll need to manually download logos that failed."
echo "Check each carrier's official website for their brand assets or media kit."