"use strict";

const { entrypoints } = require("uxp");
const { attachPanel } = require("./src/app/controller");

entrypoints.setup({
    plugin: {
        create() {}
    },
    panels: {
        mainPanel: {
            create(rootNode) {
                attachPanel(rootNode);
            },
            show(rootNode) {
                const controller = attachPanel(rootNode);
                controller.refreshHostSnapshot();
            }
        }
    }
});
