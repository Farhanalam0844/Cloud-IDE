# Use the official Node.js image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY ./public ./public
COPY ./src ./src

# Expose the port that the Vite development server will run on
EXPOSE 5173  

# Command to run the application
CMD ["npm", "run", "dev", "--", "--host"]

