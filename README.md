# Auto Memrise

Auto input level for [Memrise](https://www.memrise.com/)

## Install

Required: **Nodejs**

```bash
yarn add puppeteer axios
```

## Run

```bash
yarn start ./input/level_1.json
```

## Input format

```json
{
  "levelUrl": "https://www.memrise.com/course/5735753/english-vocabulary-in-use-elementary/3/",
  "words": [
    { "en": "teeth", "vi": "Hàm răng" },
    { "en": "tooth", "vi": "Răng" },
    { "en": "lip", "vi": "môi" }
  ]
}
```