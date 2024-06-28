# URL Shortening Service

This is a URL shortening service built with Node.js, TypeScript, and Express. It includes features for encoding, decoding, and retrieving statistics for URLs. The service uses caching for performance optimization and includes unit and integration tests for reliability.

## Installation

1. **Install dependencies**:
    ```bash
    yarn install
    ```

3. **Set up environment variables**:
    Create a `.env` file in the root directory with the following variables:
    ```plaintext
    PORT=3000
    BASE_URL=http://localhost:3000
    CACHE_TTL=3600
    ```

## Running the Application

1. **Start the server**:
    ```bash
    yarn dev
    ```

2. **API Endpoints**:
    - `POST /encode`: Encodes a URL to a shortened URL.
    - `POST /decode`: Decodes a shortened URL to its original URL.
    - `GET /statistic/{url_path}`: Returns basic statistics for a short URL path.

## Running Tests

1. **Run all tests**:
    ```bash
    yarn test
    ```

2. **Run tests in watch mode**:
    ```bash
    yarn test:watch
    ```

3. **Run tests with coverage**:
    ```bash
    yarn test:coverage
    ```

## Project Structure

- `src/`: Contains the source code.
  - `controllers/`: Express controllers.
  - `dtos/`: Data transfer objects.
  - `models/`: Mongoose models.
  - `repositories/`: Database repositories.
  - `services/`: Business logic services.
  - `utils/`: Utility functions and classes.
- `tests/`: Contains test files.
  - `unit/`: Unit tests.
  - `integration/`: Integration tests.

## Contributing

Feel free to open issues or submit pull requests for iomplmprovements and bug fixes.

## License

This project is licensed under the MIT License.
