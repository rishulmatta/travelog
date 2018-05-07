const path = require("path");
const PROJECT_DIR = path.join(__dirname, "..", ".."); // proj dir
const CLIENT_DIR = `${PROJECT_DIR}/client`;

const dirs = {
	src: `${CLIENT_DIR}/src`,
	client: CLIENT_DIR,
	dist: `${CLIENT_DIR}/dist`,
	css: `${CLIENT_DIR}/css`,
	project: PROJECT_DIR
};

const alias = {
	pages: `${dirs.src}/pages`,
	css: `${CLIENT_DIR}/css`,
    components: `${dirs.src}/components`,
	models: `${dirs.src}/models`,
	static: `${CLIENT_DIR}/static`,
	client_utils: `${dirs.src}/client_utils`,
	src: `${dirs.src}`
};

module.exports = {
    dirs,
    alias
};