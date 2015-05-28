# JSGobstones

You can build the project with

```sh
./compile.py --main ./src/RawGobstones.ts
```
execute the file *./bin/index.html* in your favourite browser. Program execution result will be available in the console's output.

You can purge the project with

```sh
./compile.py --purge
```

# Generating Parser

```sh
./pegjs ./src/parser/gobstones.pegjs ./src/parser/gobstones.ts
```

**Author**: Ary Pablo Batista
