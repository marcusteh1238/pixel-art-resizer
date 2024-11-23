# Pixel Art Resizer

A simple web app for resizing pixel art images based off scale, or to fit certain dimensions. It uses nearest-neighbor interpolation to maintain sharp edges and prevent blurring. 

For resizing images to a size with a scale that is not a power of 2, it will first upscale to the nearest higher power of 2, then downscale to the specified size. This prevents blurring as far as possible, though to maintain accuracy, a power of 2 is always recommended.

This web app is made via Create React App, built to be deployed on a github page, because I aim for no server side processing that needs to be done in order to scale the images. Everything is done on the client's browser.

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/marcusteh1238/pixel-art-resizer.git
   cd pixel-art-resizer
   ```

2. Install dependencies:
   ```bash
   yarn
   ```

3. Start the development server:
   ```bash
   yarn start
   ```

4. To deploy:
   ```bash
   yarn deploy
   ```

## Deployment

The app is configured for GitHub Pages deployment. If you want to deploy it somewhere else, you need to change the `homepage` field in `package.json` to your website.

## Usage
1. Open the web app in your browser
2. Upload your pixel art image
3. Choose either scale factor or target dimensions
4. Download the resized image

## Contributing
Contributions are welcome! Please feel free to submit a PR.
