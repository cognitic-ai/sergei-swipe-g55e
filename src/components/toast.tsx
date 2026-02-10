import { useCallback, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

type ToastType = "error" | "success" | "info";

interface ToastData {
  title: string;
  message: string;
  type: ToastType;
  id: string;
}

let toastQueue: ToastData[] = [];
let showToastCallback: ((toast: ToastData) => void) | null = null;

export function toast(options: { title: string; message: string; preset: string }) {
  const type: ToastType = options.preset === "error" ? "error" : options.preset === "done" ? "success" : "info";
  const toastData: ToastData = {
    title: options.title,
    message: options.message,
    type,
    id: Date.now().toString(),
  };

  if (showToastCallback) {
    showToastCallback(toastData);
  } else {
    toastQueue.push(toastData);
  }
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [currentToast, setCurrentToast] = useState<ToastData | null>(null);
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(-200);
  const opacity = useSharedValue(0);

  const showToast = useCallback((toastData: ToastData) => {
    setCurrentToast(toastData);
    translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
    opacity.value = withTiming(1, { duration: 300 });

    setTimeout(() => {
      hideToast();
    }, 3000);
  }, []);

  const hideToast = useCallback(() => {
    translateY.value = withSpring(-200, { damping: 15, stiffness: 150 });
    opacity.value = withTiming(0, { duration: 200 });
    setTimeout(() => {
      setCurrentToast(null);
    }, 300);
  }, []);

  useEffect(() => {
    showToastCallback = showToast;

    // Process any queued toasts
    if (toastQueue.length > 0) {
      const toast = toastQueue.shift();
      if (toast) showToast(toast);
    }

    return () => {
      showToastCallback = null;
    };
  }, [showToast]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const getToastColors = (type: ToastType) => {
    switch (type) {
      case "error":
        return { bg: "#e74c3c", icon: "close-circle" as const };
      case "success":
        return { bg: "#2ecc71", icon: "checkmark-circle" as const };
      default:
        return { bg: "#3498db", icon: "information-circle" as const };
    }
  };

  return (
    <>
      {children}
      {currentToast && (
        <Animated.View
          style={[
            {
              position: "absolute",
              top: insets.top + 10,
              left: 16,
              right: 16,
              zIndex: 1000,
            },
            animatedStyle,
          ]}
        >
          <Pressable onPress={hideToast}>
            <View
              style={{
                backgroundColor: getToastColors(currentToast.type).bg,
                borderRadius: 12,
                borderCurve: "continuous",
                padding: 16,
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                boxShadow: "0px 4px 12px rgba(0,0,0,0.3)",
              }}
            >
              <Ionicons
                name={getToastColors(currentToast.type).icon}
                size={24}
                color="#fff"
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 16,
                    fontWeight: "600",
                    marginBottom: 2,
                  }}
                >
                  {currentToast.title}
                </Text>
                <Text
                  style={{
                    color: "rgba(255,255,255,0.9)",
                    fontSize: 14,
                    lineHeight: 18,
                  }}
                >
                  {currentToast.message}
                </Text>
              </View>
            </View>
          </Pressable>
        </Animated.View>
      )}
    </>
  );
}