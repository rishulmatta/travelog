module.exports = {
    "moduleFileExtensions": ["js", "jsx"],


    "moduleNameMapper": {
      "\\.(css|less)$": "<rootDir>/__mocks__/styleMock.js",
      "\\.(gif|ttf|eot|svg)$": "<rootDir>/__mocks__/fileMock.js",
        "models(.*)$": "<rootDir>/models$1",
        "routes(.*)$": "<rootDir>/routes$1",
        "server_utils(.*)$": "<rootDir>/server_utils$1",
        "config/app": "<rootDir>/config/app",
        "test/helpers(.*)$": "<rootDir>/test/helpers$1"
    }
};