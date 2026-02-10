import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

const BASE_URL = "https://sergei.love";

export default function MatchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scale = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);
  const heartScale = useSharedValue(0);

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    scale.value = withSpring(1, { damping: 12, stiffness: 150 });
    heartScale.value = withDelay(
      300,
      withSequence(
        withSpring(1.3, { damping: 8, stiffness: 200 }),
        withSpring(1, { damping: 10, stiffness: 180 })
      )
    );
    textOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));
    buttonOpacity.value = withDelay(800, withTiming(1, { duration: 500 }));
  }, []);

  const avatarStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  return (
    <LinearGradient
      colors={["#FE3C72", "#FF6B6B", "#FF8E53"]}
      style={{ flex: 1 }}
    >
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 40,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
        <Animated.View style={avatarStyle}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: -30,
            }}
          >
            <View
              style={{
                width: 130,
                height: 130,
                borderRadius: 65,
                borderWidth: 3,
                borderColor: "#fff",
                overflow: "hidden",
                backgroundColor: "#333",
              }}
            >
              <Image
                source={`${BASE_URL}/assets/images/profile-suit-smile-5.jpg`}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
            </View>
            <Animated.View style={heartStyle}>
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: "#fff",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                  boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
                }}
              >
                <Text style={{ fontSize: 24 }}>{"❤️"}</Text>
              </View>
            </Animated.View>
            <View
              style={{
                width: 130,
                height: 130,
                borderRadius: 65,
                borderWidth: 3,
                borderColor: "#fff",
                overflow: "hidden",
                backgroundColor: "#333",
              }}
            >
              <Image
                source={`${BASE_URL}/assets/images/profile-gondola-4.jpg`}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[{ alignItems: "center", marginTop: 30 }, textStyle]}>
          <Text
            style={{
              fontSize: 40,
              fontWeight: "800",
              color: "#fff",
              textAlign: "center",
              textTransform: "uppercase",
              letterSpacing: 3,
            }}
          >
            It's a Match!
          </Text>
          <Text
            style={{
              fontSize: 17,
              color: "rgba(255,255,255,0.9)",
              textAlign: "center",
              marginTop: 12,
              lineHeight: 24,
            }}
          >
            You and Sergei liked each other.{"\n"}This was clearly inevitable.
          </Text>
        </Animated.View>

        <Animated.View
          style={[{ width: "100%", gap: 12, marginTop: 40 }, buttonStyle]}
        >
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.back();
            }}
            style={({ pressed }) => ({
              backgroundColor: "#fff",
              paddingVertical: 16,
              borderRadius: 30,
              alignItems: "center",
              opacity: pressed ? 0.85 : 1,
              transform: [{ scale: pressed ? 0.97 : 1 }],
            })}
          >
            <Text
              style={{
                color: "#FE3C72",
                fontSize: 18,
                fontWeight: "700",
              }}
            >
              Send a Message
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              router.back();
            }}
            style={({ pressed }) => ({
              borderWidth: 2,
              borderColor: "#fff",
              paddingVertical: 16,
              borderRadius: 30,
              alignItems: "center",
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 18,
                fontWeight: "700",
              }}
            >
              Keep Swiping
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}
