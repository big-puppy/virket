## Ionic Virket Example App
#### # Installation

To run this example in production or development mode you have to make sure, `ionic` and `cordova` are installed globally on your machine. After that you can install all necessary dependencies for running this example.

0. Check if `npm` is installed. Otherwise please [install `node.js` and `npm`](https://nodejs.org/en/download/package-manager/).
```bash
npm -v
```

1. Install ionic and cordova command line interface globally.
```bash
npm install -g cordova ionic
```

2. Install all dependencies listed in [`package.json`](/package.json).
```bash
npm install
```

#### # Running the example in your browser
```bash
ionic serve
```

#### # Running the example on your device
3. Add an iOS or Android to the project.
```bash
ionic cordova platform add ios 
# or 
ionic cordova platform add android
```

4. Run the app on your device.
```bash
ionic cordova run ios
# or
ionic cordova run android
```

*For further information please read [ionic's deployment guide](https://ionicframework.com/docs/intro/deploying/).*