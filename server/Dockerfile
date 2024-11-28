# FROM ubuntu

# # Set the working directory inside the container
# WORKDIR /app

# # Copy only the package.json files first to take advantage of Docker caching

# # Install dependencies
# RUN apt-get update && apt-get install -y \
#     curl \
#     && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
#     && apt-get install -y nodejs \
#     && apt-get clean \
#     && rm -rf /var/lib/apt/lists/*


# # Copy all necessary files including index.js and the 'user' folder
# COPY ./package*.json ./package*.json
# COPY ./user ./user
# COPY . .
# RUN npm install

# # Run the application
# CMD ["node", "index.js"]

# Use the official Node.js image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Start the application
CMD ["node", "index.js"]
