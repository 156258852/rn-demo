
import React, { useRef } from 'react';
import { Alert, Button, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';


export default function WebViewTest() {

  const webViewRef = useRef<WebView>(null);

  // 处理从WebView发来的消息
  const onMessage = (event: any) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      Alert.alert('收到来自WebView的消息', JSON.stringify(message, null, 2));
    } catch (error) {
      Alert.alert('消息接收', event.nativeEvent.data);
    }
  };

  // 向WebView发送消息
  const sendMessageToWebView = () => {
    const message = {
      type: 'greeting',
      content: 'Hello from React Native!',
      timestamp: new Date().toISOString()
    };

    webViewRef.current?.postMessage(JSON.stringify(message));
  };

  const onLoadEnd = () => {
  const script = `
    sessionStorage.setItem('appMode', 'true');
  `;
  webViewRef.current?.injectJavaScript(script);
};


const btnClick = () => {
  const script = `
    if (window.ON_CLICK_BACK_BTN) {
      window.ON_CLICK_BACK_BTN();
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'LOG',
        message: 'ON_CLICK_BACK_BTN function called'
      }));
    } else {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'LOG',
        message: 'ON_CLICK_BACK_BTN function not found'
      }));
    }
  `;
  
  webViewRef.current?.injectJavaScript(script);
};
  React.useEffect(()=>{
    (window as any).webRef = webViewRef.current
  },[])

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* <button onClick={btnClick}>返回</button> */}
      <Button
      title="点击我"
      onPress={() => btnClick()}
    />
      <WebView
        ref={webViewRef}
        originWhitelist={['*']} // 允许加载任何来源的内容
        // source={{ uri: 'https://cdbh.ztiots.com/cdb-h5/#/' }}
        // source={{ uri: 'https://www.kimi.com/chat/d3pd66lgsoa1id3trtog' }}
        source={{uri: 'https://wwwuat2.aia.com.hk/aia-plus/zh-cn/login'}}
        // source={{uri: 'http://localhost:3001/' }}
        onMessage={onMessage}
        javaScriptEnabled={true} // 启用JavaScript,目的是为了让WebView内的脚本能够运行
        domStorageEnabled={true} // 启用DOM存储
        style={styles.webview}
        onLoadEnd={onLoadEnd}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    padding: 10,
    paddingBottom: 0,
  },
  webview: {
    flex: 1,
  },
});

// export default function WebViewTest() {
//   Linking.openURL('https://cdbh.ztiots.com/cdb-h5/#/');

// }
