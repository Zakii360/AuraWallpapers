{
  "targets": [
    {
      "target_name": "aura_desktop",
      "sources": ["src/desktop_integration.cc"],
      "include_dirs": ["<!@(node -p \"require('node-addon-api').include\")"],
      "dependencies": ["<!(node -p \"require('node-addon-api').gyp\")"],
      "cflags!": ["-fno-exceptions"],
      "cflags_cc!": ["-fno-exceptions"],
      "defines": ["NAPI_DISABLE_CPP_EXCEPTIONS"],
      "conditions": [
        [
          "OS=='win32'",
          {
            "libraries": ["user32.lib"],
            "msvs_settings": {
              "VCCLCompilerTool": { "ExceptionHandling": 1 }
            }
          }
        ]
      ]
    }
  ]
}
