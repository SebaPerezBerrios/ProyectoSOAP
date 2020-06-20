{
  "targets": [
    {
      "target_name": "addon",
      "sources": [ "cpp/main.cc" ],
      "include_dirs": ["<!@(node -p \"require('node-addon-api').include\")"],
      "cflags_cc": ["-fexceptions", "-fpermissive", "-O3"]
    }
  ]
}