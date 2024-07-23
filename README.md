
# Project Setup and Running Instructions

This document outlines the steps required to set up and run the various components of the project. Make sure to follow the steps in order to ensure everything functions correctly.

## Prerequisites

Before you begin, ensure that you have the Conda environment `places` set up with all the necessary dependencies. This environment is critical for running the provided scripts.

## Step-by-Step Instructions

### Step 1: Activate the Conda Environment

First, activate the Conda environment that contains all the dependencies needed for the scripts. Open anaconda prompt and run the following command:

```bash
conda activate places
```

### Step 2: Start the Flask Server

Navigate to the `flask-server` directory and start the Flask server by running `app.py`. This server is necessary for handling backend requests made by the web application. Execute the following commands in your terminal:

```bash
cd flask-server
python app.py
```

### Step 3: Start the Express Server and View the Webpage

In a new anaconda prompt window (ensuring that your `places` environment is still activated), start the Express server. Once the server is running, you can access the static webpage by visiting `localhost:3000` in your web browser. Follow these commands:

```bash
cd path/to/your/express-server-folder
node server.js
```

Now, open your web browser and go to `http://localhost:3000` to view the static webpage.

### Step 4: Interact with the Webpage and Get Images

After accessing the webpage at `localhost:3000`, input a number of images and select two points on the map as required by the application.

### Step 5: Load and Run the Jupyter Notebook

Once you see the images in the webpage, open the Jupyter Notebook named `Places Unified Code.ipynb`. This notebook contains scripts that process the images you selected from the webpage. Run all the cells in the notebook to execute the image processing scripts:

```bash
jupyter notebook 'Places Unified Code.ipynb'
```
