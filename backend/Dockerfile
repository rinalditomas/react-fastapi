# Use an official Python runtime as a base image
FROM python:3.8-slim

# Set the working directory to /app inside the container
WORKDIR /app

# Copy the requirements file into the container at /app
COPY requirements.txt /app/

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application's code into the container at /app
COPY . /app/

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Set an environment variable
ENV NAME World

# Specify the command to run on container start
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--reload"]