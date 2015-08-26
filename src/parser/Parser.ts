var parser = parser || { parse : (s) => { throw new Error("Parser not initialized yet.") } }

function buildInteractiveBody(branches) {
    return [ "{",
        "var _key = API.read();",
        "while (_key != K_CTRL_D) {",
            "switch (_key) {",
                branches,
            "}",
            "API.show();",
            "_key = API.read();",
        "}",
     "}"
    ].join("\n")
}