module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    //"extends": [
    //    "standard"
    //],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        "for-direction":            "warn",
        "no-compare-neg-zero":      "warn",
        "no-cond-assign":           "error",
        "no-constant-condition":    "warn",
        "no-dupe-args":             "error",
        "no-dupe-keys":             "error",
        "no-duplicate-case":        "error",
        "no-empty-character-class": "error",
        "no-extra-parens":          "warn",
        "no-extra-semi":            "warn",
        "no-func-assign":           "error",
        "no-inner-declarations":    "warn",
        "no-irregular-whitespace":  "warn",
        "no-unreachable":           "warn",
        "no-unexpected-multiline":  "warn",
        "no-unsafe-negation":       "warn",
        "class-methods-use-this":   "error",
        "consistent-return":        "error",
        "curly":                    ["warn", "all"],
        "default-case":             "warn",
        "dot-location":             ["warn", "property"],
        "no-new":                   "error",
        "no-new-func":               "error",
        "global-require":           "error",
        "array-bracket-newline":    ["warn", "never"],
        "array-bracket-spacing":    "warn",
        "array-element-newline":    ["warn", "never"],
        "block-spacing":            ["warn", "always"],
        "brace-style":              ["warn", "stroustrup"],
        "camelcase":                "warn",
        "capitalized-comments":     ["warn", "always"],
        "comma-style":              ["warn", "last"],
        "func-call-spacing":        "warn",
        "indent":                   "warn",
        "key-spacing":              "warn",
        "keyword-spacing":          "warn",
        "line-comment-position":    "warn",
        "lines-around-comment":     "warn",
        "lines-between-class-members":   "warn",
        "multiline-comment-style":  "warn",
        "no-trailing-spaces":       "warn",
        "semi":                     "error"
    }
};