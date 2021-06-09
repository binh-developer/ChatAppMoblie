## Note

### Develop in Android Device. Haven't test in IOS yet.

### Rename App Name

```
npx react-native-rename <newName>
```

### Install manually

```
npm install @react-navigation/native
npm install react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view
npm install @react-navigation/stack
npm install react-native-elements
npm install react-native-gifted-chat
npm install --save @react-native-firebase/app
```

### Run Push Notification

```
cd functions
npm run start
```

## Fix Warning Error from package <strong>react-native-gifted-chat</strong>

```
Animated.event now requires a second argument for options
```

- Install patch-package:

```
npm install -g patch-package
```

- In your root of project create a folder name patches and inside patches folder create a file with name: <strong>react-native-lightbox+0.8.1.patch</strong> with the following content:

```diff
diff --git a/node_modules/react-native-lightbox/LightboxOverlay.js b/LightboxOverlay.js
index 9e01f9a..d093b44 100644
--- a/node_modules/react-native-lightbox/LightboxOverlay.js
+++ b/node_modules/react-native-lightbox/LightboxOverlay.js
@@ -99,7 +99,7 @@ export default class LightboxOverlay extends Component {
       onPanResponderMove: Animated.event([
         null,
         { dy: this.state.pan }
-      ]),
+      ], { useNativeDriver: false }),
       onPanResponderTerminationRequest: (evt, gestureState) => true,
       onPanResponderRelease: (evt, gestureState) => {
         if(Math.abs(gestureState.dy) > DRAG_DISMISS_THRESHOLD) {
@@ -115,7 +115,7 @@ export default class LightboxOverlay extends Component {
         } else {
           Animated.spring(
             this.state.pan,
-            { toValue: 0, ...this.props.springConfig }
+            { toValue: 0, useNativeDriver: false, ...this.props.springConfig }
           ).start(() => { this.setState({ isPanning: false }); });
         }
       },
@@ -144,7 +144,7 @@ export default class LightboxOverlay extends Component {

     Animated.spring(
       this.state.openVal,
-      { toValue: 1, ...this.props.springConfig }
+      { toValue: 1, useNativeDriver: false, ...this.props.springConfig }
     ).start(() => {
       this.setState({ isAnimating: false });
       this.props.didOpen();
@@ -161,7 +161,7 @@ export default class LightboxOverlay extends Component {
     });
     Animated.spring(
       this.state.openVal,
-      { toValue: 0, ...this.props.springConfig }
+      { toValue: 0, useNativeDriver: false, ...this.props.springConfig }
     ).start(() => {
       this.setState({
         isAnimating: false,
```

- Run:

```
patch-package
```
