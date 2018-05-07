// Client Side
const jestClientConfig = {
    "moduleFileExtensions": ["js", "jsx"],
    "moduleNameMapper": {
        "\\.(css|less)$": "<rootDir>/__mocks__/styleMock.js",
        "\\.(gif|ttf|eot|svg)$": "<rootDir>/__mocks__/fileMock.js",
        "models(.*)$": "<rootDir>/src/models$1",
        "components(.*)$": "<rootDir>/src/components$1",
        "pages(.*)$": "<rootDir>/src/pages$1",
        "client_utils(.*)$": "<rootDir>/src/client_utils$1",
    }
};


module.exports = jestClientConfig;